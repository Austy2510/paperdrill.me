import pdfplumber
from loguru import logger
import os

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF file using pdfplumber.
    Falls back to basic logic or returns empty if it's a scanned PDF
    (OCR implementation is skipped for now based on user constraints).
    """
    if not os.path.exists(pdf_path):
        logger.error(f"PDF not found: {pdf_path}")
        return ""
        
    logger.info(f"Extracting text from {pdf_path} using pdfplumber...")
    text_content = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
                    
        full_text = "\n".join(text_content)
        
        # If very little text was extracted, it might be a scanned document.
        # The original plan called for pytesseract OCR here.
        if len(full_text.strip()) < 100:
            logger.warning(f"Extracted less than 100 characters from {pdf_path}. This might be a scanned PDF requiring OCR.")
            # We are skipping OCR for the initial implementation unless required.
            
        return full_text
        
    except Exception as e:
        logger.error(f"Failed to extract text from {pdf_path}: {e}")
        return ""
