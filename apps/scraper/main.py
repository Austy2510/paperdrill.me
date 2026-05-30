import os
import requests
import pdfplumber
import psycopg2
import uuid
from loguru import logger
import tempfile
import sys
from psycopg2.extras import DictCursor

def main():
    logger.info('Python scraper script started execution.')
    
    # Read connection string from environment variables
    db_conn_str = os.environ.get('DATABASE_URL')
    if not db_conn_str:
        logger.error('DATABASE_URL not found in environment variables. Exiting.')
        sys.exit(1)

    try:
        conn = psycopg2.connect(db_conn_str)
        cursor = conn.cursor(cursor_factory=DictCursor)
        logger.info("Successfully connected to the database.")
        
        # Stub for downloading a PDF and extracting text
        # We will use a mock PDF for the sake of demonstrating the script
        pdf_url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        
        logger.info(f"Downloading PDF from: {pdf_url}")
        
        response = requests.get(pdf_url, stream=True)
        response.raise_for_status()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            for chunk in response.iter_content(chunk_size=8192):
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name
            
        logger.info("Extracting text from PDF...")
        text = ""
        with pdfplumber.open(tmp_file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
                
        logger.info(f"Extracted {len(text)} characters from PDF.")
        
        # Insert a new record into `papers` representing this scraped PDF
        # We ensure to pass UUID properly
        new_paper_id = str(uuid.uuid4())
        
        # In a real scraper, we would parse the PDF text to determine the board, subject, level, etc.
        # For now, we mock it.
        insert_query = """
        INSERT INTO papers (id, board, subject, level, year, paper_number, source_pdf_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
        """
        
        cursor.execute(insert_query, (
            new_paper_id,
            "CAIE", 
            "Physics", 
            "A Level", 
            2025, 
            "P4", 
            pdf_url
        ))
        
        conn.commit()
        logger.info(f"Inserted new scraped paper into database with ID {new_paper_id}.")
        
        # Clean up
        cursor.close()
        conn.close()
        os.remove(tmp_file_path)
        
    except Exception as e:
        logger.error(f"Error during scraping pipeline: {e}")
        sys.exit(1)

    logger.info('Python scraper script finished execution.')

if __name__ == "__main__":
    main()
