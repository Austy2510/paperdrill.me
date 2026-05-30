import os
import sys
import argparse
from loguru import logger

from scrapers.caie import CAIEScraper
from scrapers.edexcel import EdexcelScraper
from config import DATABASE_URL, LIMIT_PAPERS

def init_db(conn_str: str):
    """
    Ensures the necessary tables exist in the target database.
    Since we are pointing to the main Neon Postgres DB which already has Drizzle
    migrations managing the schema, this function should just verify connection.
    If the tables don't exist, it should raise a warning.
    """
    import psycopg2
    import time
    max_retries = 5
    delay = 2
    conn = None
    for attempt in range(max_retries):
        try:
            logger.info(f"Connecting to verify database schema (attempt {attempt + 1}/{max_retries})...")
            conn = psycopg2.connect(conn_str)
            break
        except Exception as e:
            logger.warning(f"Verification connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
            else:
                logger.error("Failed to connect for schema verification.")
                raise e

    try:
        cursor = conn.cursor()
        
        # Check if papers table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'papers'
            );
        """)
        
        exists = cursor.fetchone()[0]
        if not exists:
            logger.error("The 'papers' table does not exist in the database! Ensure Drizzle migrations have been run.")
            sys.exit(1)
            
        logger.info("Database schema verified.")
        cursor.close()
        conn.close()
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="PaperDrill Past Paper Scraper Pipeline")
    parser.add_argument("command", choices=["init", "run"], help="Command to execute")
    parser.add_argument("target", nargs="?", choices=["all", "caie", "dhaka", "edexcel"], default="all", help="Which board to scrape")
    
    args = parser.parse_args()
    
    if not DATABASE_URL:
        logger.error("DATABASE_URL environment variable is not set. Cannot run scraper.")
        sys.exit(1)
        
    if args.command == "init":
        logger.info("Initializing database connection...")
        init_db(DATABASE_URL)
        logger.info("Init complete.")
        return
        
    if args.command == "run":
        logger.info(f"Starting scraper pipeline for target: {args.target} with limit: {LIMIT_PAPERS}")
        
        # Verify DB before running
        init_db(DATABASE_URL)
        
        if args.target in ["all", "caie"]:
            caie_scraper = CAIEScraper(DATABASE_URL)
            caie_scraper.run(limit=LIMIT_PAPERS)
            
        if args.target in ["all", "dhaka"]:
            logger.warning("Dhaka board scraper not yet implemented.")
            
        if args.target in ["all", "edexcel"]:
            edexcel_scraper = EdexcelScraper(DATABASE_URL)
            edexcel_scraper.run(limit=LIMIT_PAPERS)
            
        logger.info("Scraper pipeline finished.")

if __name__ == "__main__":
    main()
