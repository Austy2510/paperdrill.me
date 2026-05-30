import re
from loguru import logger
from bs4 import BeautifulSoup

from .base import BaseScraper
from http_client import get_polite_session, polite_get

class CAIEScraper(BaseScraper):
    def __init__(self, db_conn_str: str):
        super().__init__(db_conn_str, board="CAIE")
        # PhysicsAndMathsTutor is very friendly to scrape
        self.sources = [
            {
                "url": "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/cie-paper-4/",
                "subject": "Chemistry",
                "paper_number": "4"
            },
            {
                "url": "https://www.physicsandmathstutor.com/past-papers/a-level-physics/cie-paper-4/",
                "subject": "Physics",
                "paper_number": "4"
            }
        ]

    def _get_subject_links(self) -> list:
        """
        Uses requests (via http_client) to scrape PMT for CAIE past papers.
        """
        pdf_links = []
        
        session = get_polite_session()
        for source in self.sources:
            logger.info(f"Scraping CAIE {source['subject']} Paper {source['paper_number']} from PMT")
            resp = polite_get(session, source['url'])
            if resp.status_code != 200:
                continue
                
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            for a in soup.find_all('a', href=True):
                href = a['href']
                if href.endswith('.pdf') and '/QP/' in href:
                    pdf_links.append({
                        "url": href,
                        "subject": source["subject"],
                        "paper_number": source["paper_number"]
                    })
                    
        return pdf_links

    def run(self, limit: int = 0):
        logger.info(f"Starting CAIE scrape (via PMT) with limit {limit}")
        
        pdf_items = self._get_subject_links()
        
        # Sort so we get newer papers if possible, or just reverse it
        pdf_items.reverse()
        
        count = 0
        for item in pdf_items:
            if limit > 0 and count >= limit:
                logger.info(f"Reached limit of {limit} papers. Stopping CAIE scrape.")
                break
                
            pdf_url = item["url"]
            
            # Example filename: June 2018 (v1) QP.pdf or November 2021 (v2) QP.pdf
            filename = pdf_url.split("/")[-1].replace('%20', ' ')
            
            year_match = re.search(r'(19|20)\d{2}', filename)
            year = int(year_match.group(0)) if year_match else 2023
            
            meta = {
                "subject": item["subject"],
                "level": "A Level",
                "year": year,
                "paper_number": item["paper_number"]
            }
            
            success = self.ingest_paper(meta, pdf_url)
            if success:
                count += 1
                
        logger.info(f"CAIE scrape complete. Ingested {count} papers.")
