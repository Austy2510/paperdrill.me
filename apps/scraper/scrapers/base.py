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
        
        # Connect to Postgres with robust retry logic for Serverless/Neon cold starts
        import time
        max_retries = 5
        delay = 2
        self.conn = None
        for attempt in range(max_retries):
            try:
                logger.info(f"Connecting to database (attempt {attempt + 1}/{max_retries})...")
                self.conn = psycopg2.connect(self.db_conn_str)
                logger.info("Successfully connected to database.")
                break
            except Exception as e:
                logger.warning(f"Connection failed: {e}")
                if attempt < max_retries - 1:
                    logger.info(f"Retrying in {delay} seconds...")
                    time.sleep(delay)
                    delay *= 2
                else:
                    logger.error("Failed to connect to database after all retries.")
                    raise e
        
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
        2. Download QP
        3. Extract QP text
        4. If mark_scheme_url exists, download and extract MS text
        5. Segment into questions and map MS answers
        6. Insert to DB
        """
        cursor = self.conn.cursor()
        
        try:
            # Check if we already have this paper
            cursor.execute("SELECT id FROM papers WHERE source_pdf_url = %s", (pdf_url,))
            if cursor.fetchone():
                logger.debug(f"Paper already exists, skipping: {pdf_url}")
                return False
                
            # Download QP
            pdf_path = self.download_pdf(pdf_url, f"{uuid.uuid4()}.pdf")
            if not pdf_path:
                return False
                
            # Extract QP text
            full_text = extract_text_from_pdf(pdf_path)
            
            # Clean up the QP PDF
            os.remove(pdf_path)
            
            if not full_text.strip():
                logger.warning(f"No text extracted from {pdf_url}. Skipping DB insert.")
                return False
                
            # Handle Mark Scheme download & extraction if present
            mark_scheme_url = paper_meta.get("mark_scheme_url")
            ms_answers = {}
            if mark_scheme_url:
                logger.info(f"Mark Scheme URL provided: {mark_scheme_url}")
                ms_pdf_path = self.download_pdf(mark_scheme_url, f"{uuid.uuid4()}_ms.pdf")
                if ms_pdf_path:
                    ms_text = extract_text_from_pdf(ms_pdf_path)
                    os.remove(ms_pdf_path)
                    if ms_text.strip():
                        from segmenter import segment_ms
                        ms_answers = segment_ms(ms_text)
                        logger.info(f"Successfully extracted {len(ms_answers)} answers from MS.")
            
            # Segment QP into questions
            questions = segment_paper(full_text)
            
            # Pair QP questions with MS answers
            for q in questions:
                q_num = q["question_number"]
                if q_num in ms_answers:
                    q["answer_text"] = ms_answers[q_num]
            
            # Insert Paper
            paper_id = str(uuid.uuid4())
            insert_paper_q = """
            INSERT INTO papers (id, board, subject, level, year, paper_number, source_pdf_url, mark_scheme_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(insert_paper_q, (
                paper_id,
                self.board,
                paper_meta.get("subject", "Unknown"),
                paper_meta.get("level", "Unknown"),
                paper_meta.get("year", 2000),
                paper_meta.get("paper_number", "Unknown"),
                pdf_url,
                mark_scheme_url
            ))
            
            # Insert Questions
            insert_q_query = """
            INSERT INTO questions (id, paper_id, question_number, question_text, answer_text, board, subject, level, year, paper_number, mark_scheme_url, topic)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            # Basic fallback topics map
            subject_to_topic = {
                "Chemistry": "General Chemistry",
                "Physics": "General Physics",
                "Biology": "General Biology",
                "Mathematics": "General Mathematics",
                "Economics": "General Economics",
                "Computer Science": "Programming & Theory"
            }
            
            for q in questions:
                # Use assigned topic if present, otherwise fallback based on subject
                topic = q.get("topic_tag")
                if not topic or topic == "Uncategorized":
                    topic = subject_to_topic.get(paper_meta.get("subject"), "General Studies")
                    
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
                    paper_meta.get("paper_number", "Unknown"),
                    mark_scheme_url,
                    topic
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
