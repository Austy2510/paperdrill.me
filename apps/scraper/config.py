import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directories
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DOWNLOADS_DIR = BASE_DIR / "downloads"

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
DOWNLOADS_DIR.mkdir(exist_ok=True)

# Database
DATABASE_URL = os.environ.get("DATABASE_URL")

# Scraping settings
HTTP_TIMEOUT = int(os.environ.get("HTTP_TIMEOUT", "30"))
HTTP_RETRY_COUNT = int(os.environ.get("HTTP_RETRY_COUNT", "3"))
REQUEST_DELAY = float(os.environ.get("REQUEST_DELAY", "2.5"))

# Run limits (for development/testing)
LIMIT_PAPERS = int(os.environ.get("LIMIT_PAPERS", "5")) # Set to 0 for unlimited

# Headers to appear as a legitimate browser
DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Ch-Ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
}
