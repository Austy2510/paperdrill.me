import time
import random
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from loguru import logger
from config import HTTP_TIMEOUT, HTTP_RETRY_COUNT, REQUEST_DELAY, DEFAULT_HEADERS

def get_polite_session() -> requests.Session:
    """
    Returns a configured requests.Session with:
    - Custom User-Agent
    - Retry logic for common transient errors (429, 500, 502, 503, 504)
    - Exponential backoff
    """
    session = requests.Session()
    session.headers.update(DEFAULT_HEADERS)
    
    # Configure retries
    retry_strategy = Retry(
        total=HTTP_RETRY_COUNT,
        backoff_factor=1, # 1, 2, 4 seconds...
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["HEAD", "GET", "OPTIONS"]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    return session

def polite_get(session: requests.Session, url: str, **kwargs) -> requests.Response:
    """
    Wrapper around session.get that enforces a rate limit delay before the request.
    """
    # Enforce minimum delay to avoid getting blocked
    # Add a small random jitter
    jitter = random.uniform(0.1, 0.5)
    time.sleep(REQUEST_DELAY + jitter)
    
    logger.debug(f"GET {url}")
    return session.get(url, timeout=HTTP_TIMEOUT, **kwargs)
