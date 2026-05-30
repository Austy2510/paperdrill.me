import os
import uuid
from typing import List, Dict, Any, Optional
from loguru import logger
import tempfile
import psycopg2
from psycopg2.extras import DictCursor
from http_client import polite_get, get_polite_session
from extractor import extract_text_from_pdf
from segmenter import segment_paper
from config import DOWNLOADS_DIR

class BaseScraper:
    def __init__(self, db_conn_str: str, board: str):
        self.db_conn_str = db_conn_str
        self.board = board
        self.session = get_polite_session()
        self.conn = psycopg2.connect(self.db_conn_str)
        
    def __del__(self):
        if hasattr(self, 'conn') and self.conn:
            self.conn.close()

    def download_pdf(self, url: str, filename: str) -> Optional[str]:
        """Downloads a PDF from a URL to a temporary or persistent file."""
        try:
            logger.info(f"Downloading {url}...")
            response = polite_get(self.session, url, stream=True)
            response.raise_for_status()
            
            # Save to a temporary file for now
            fd, temp_path = tempfile.mkstemp(suffix=".pdf", dir=DOWNLOADS_DIR)
            with os.fdopen(fd, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
            return temp_path
        except Exception as e:
            logger.error(f"Failed to download {url}: {e}")
            return None

    def ingest_paper(self, paper_meta: Dict[str, Any], pdf_url: str):
        """
        Main flow:
        1. Check if already exists
        2. Download
        3. Extract text
        4. Segment into questions
        5. Insert to DB
        """
        cursor = self.conn.cursor()
        
        try:
            # Check if we already have this paper
            cursor.execute("SELECT id FROM papers WHERE source_pdf_url = %s", (pdf_url,))
            if cursor.fetchone():
                logger.debug(f"Paper already exists, skipping: {pdf_url}")
                return False
                
            # Download
            pdf_path = self.download_pdf(pdf_url, f"{uuid.uuid4()}.pdf")
            if not pdf_path:
                return False
                
            # Extract
            full_text = extract_text_from_pdf(pdf_path)
            
            # Clean up the PDF to save space (since we aren't uploading to S3 right now)
            os.remove(pdf_path)
            
            if not full_text.strip():
                logger.warning(f"No text extracted from {pdf_url}. Skipping DB insert.")
                return False
                
            # Segment
            questions = segment_paper(full_text)
            
            # Insert Paper
            paper_id = str(uuid.uuid4())
            insert_paper_q = """
            INSERT INTO papers (id, board, subject, level, year, paper_number, source_pdf_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(insert_paper_q, (
                paper_id,
                self.board,
                paper_meta.get("subject", "Unknown"),
                paper_meta.get("level", "Unknown"),
                paper_meta.get("year", 2000),
                paper_meta.get("paper_number", "Unknown"),
                pdf_url
            ))
            
            # Insert Questions
            insert_q_query = """
            INSERT INTO questions (id, paper_id, question_number, question_text, answer_text, board, subject, level, year, paper_number)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            for q in questions:
                cursor.execute(insert_q_query, (
                    str(uuid.uuid4()),
                    paper_id,
                    q["question_number"],
                    q["question_text"],
                    q["answer_text"],
                    self.board,
                    paper_meta.get("subject", "Unknown"),
                    paper_meta.get("level", "Unknown"),
                    paper_meta.get("year", 2000),
                    paper_meta.get("paper_number", "Unknown")
                ))
                
            self.conn.commit()
            logger.info(f"Successfully ingested paper and {len(questions)} questions from {pdf_url}")
            return True
            
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Failed to ingest paper {pdf_url}: {e}")
            return False
        finally:
            cursor.close()
            
    def run(self, limit: int = 0):
        """To be implemented by subclasses."""
        raise NotImplementedError()
