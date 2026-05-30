import re
from loguru import logger
from bs4 import BeautifulSoup

from .base import BaseScraper
from http_client import get_polite_session, polite_get

class EdexcelScraper(BaseScraper):
    def __init__(self, db_conn_str: str):
        super().__init__(db_conn_str, board="Edexcel")
        self.sources = [
            {
                "url": "https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/edexcel-paper-1/",
                "subject": "Chemistry",
                "paper_number": "1"
            },
            {
                "url": "https://www.physicsandmathstutor.com/past-papers/a-level-physics/edexcel-paper-1/",
                "subject": "Physics",
                "paper_number": "1"
            },
            {
                "url": "https://www.physicsandmathstutor.com/past-papers/a-level-biology/edexcel-paper-1/",
                "subject": "Biology",
                "paper_number": "1"
            },
            {
                "url": "https://www.physicsandmathstutor.com/past-papers/a-level-maths/edexcel-paper-1/",
                "subject": "Mathematics",
                "paper_number": "1"
            }
        ]

    def _get_subject_links(self) -> list:
        pdf_links = []
        
        session = get_polite_session()
        for source in self.sources:
            logger.info(f"Scraping Edexcel {source['subject']} Paper {source['paper_number']} from PMT")
            resp = polite_get(session, source['url'])
            if resp.status_code != 200:
                continue
                
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            for a in soup.find_all('a', href=True):
                href = a['href']
                # We only want Question Papers (QP)
                if href.endswith('.pdf') and 'QP' in href:
                    pdf_links.append({
                        "url": href,
                        "subject": source["subject"],
                        "paper_number": source["paper_number"]
                    })
                    
        return pdf_links

    def run(self, limit: int = 0):
        logger.info(f"Starting Edexcel scrape (via PMT) with limit {limit}")
        
        pdf_items = self._get_subject_links()
        
        # Sort so we get newer papers if possible
        pdf_items.reverse()
        
        count = 0
        for item in pdf_items:
            if limit > 0 and count >= limit:
                logger.info(f"Reached limit of {limit} papers. Stopping Edexcel scrape.")
                break
                
            pdf_url = item["url"]
            
            # Example filename: June 2018 QP - Paper 1 Edexcel Chemistry A-Level.pdf
            filename = pdf_url.split("/")[-1].replace('%20', ' ')
            
            year_match = re.search(r'(19|20)\d{2}', filename)
            year = int(year_match.group(0)) if year_match else 2023
            
            # Derive Mark Scheme URL from the QP URL
            mark_scheme_url = pdf_url.replace('/QP/', '/MS/').replace('QP', 'MS')
            
            meta = {
                "subject": item["subject"],
                "level": "A Level",
                "year": year,
                "paper_number": item["paper_number"],
                "mark_scheme_url": mark_scheme_url
            }
            
            success = self.ingest_paper(meta, pdf_url)
            if success:
                count += 1
                
        logger.info(f"Edexcel scrape complete. Ingested {count} papers.")
