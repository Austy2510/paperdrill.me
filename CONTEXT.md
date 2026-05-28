# Past-Paper Scraper — Context & Progress

This document captures everything that has been built so far for the
**past-paper scraper pipeline** that lives alongside the PaperDrill Node
app. Use it as the single source of truth when picking work back up.

---

## 1. Project goal (recap)

Build a **Python data pipeline** that:

- Scrapes past exam papers from three boards:
  - **CAIE** — `pastpapers.papacambridge.com`
  - **Dhaka Education Board (SSC + HSC)** — `admissionwar.com`,
    `lekhaporabd.net`
  - **Pearson Edexcel International** — `physicsandmathstutor.com`,
    `examsolutions.net`
- Downloads only **new** PDFs (deduped via `source_url` UNIQUE constraint).
- Extracts text with **pdfplumber**, falling back to **pytesseract OCR**
  (via `pdf2image` → poppler) for scanned PDFs.
- **Segments** each paper into individual questions + answers via regex
  (handles ASCII numerals, plus Bangla numerals for Dhaka board).
- Stores everything in **SQLite** with a **Postgres-friendly** schema
  (TEXT / INTEGER / TIMESTAMP only) so it can be ported later.
- Logs every run (new / skipped / failed counts) to a `scrape_log` table.
- Runs on a **schedule** (CAIE/Edexcel monthly, Dhaka weekly during
  Feb/Apr exam season).
- Respects rate limits (≥ 2.5 s between requests), uses a real Chrome
  User-Agent, retries transient errors, and never crashes the whole run
  on a single failure.
- Reads secrets / paths from `.env` (no hard-coded values).

---

## 2. What has been built

### 2.1 Detailed System Dependencies (What is used, where, and its purpose)

**System Level:**
- **`tesseract`**: Used by `extractor.py`. Purpose: Provides the core Optical Character Recognition (OCR) engine used to read text from scanned PDFs (like the older Dhaka board question papers).
- **`poppler`**: Used by `pdf2image` (in `extractor.py`). Purpose: A PDF rendering library required to convert PDF pages into raw images so that Tesseract can process them.

**Python Packages:**
- **`requests`**: Used by `http_client.py`. Purpose: The standard library for making HTTP GET/POST requests. We use it wrapped in a Session to enforce retries and delays.
- **`beautifulsoup4` & `lxml`**: Used by `caie.py` and `dhaka.py`. Purpose: Parses static HTML to extract links to PDF files and navigate standard websites.
- **`pdfplumber`**: Used by `extractor.py`. Purpose: The primary tool for extracting text directly from native (text-layer) PDFs. It is faster and more accurate than OCR.
- **`pdf2image` & `pytesseract`**: Used by `extractor.py`. Purpose: The fallback OCR stack. If `pdfplumber` extracts less than 100 characters (indicating a scanned image), these tools convert the PDF to images and run OCR.
- **`Pillow` (PIL)**: Used by `dhaka.py`. Purpose: Image manipulation. Specifically used to stitch together individual JPG/PNG exam images scraped from `ibb.co` into a single cohesive PDF file.
- **`playwright`**: Used by `edexcel.py` (and fallback in `caie.py`). Purpose: A headless browser automation tool. PMT (PhysicsAndMathsTutor) relies heavily on JavaScript for its directory structure. Playwright actually renders the page so we can scrape the dynamically generated links.
- **`schedule`**: Used by `scheduler.py`. Purpose: Provides a simple, human-readable syntax to run scraping tasks at specific times (e.g., daily at 3 AM).
- **`loguru`**: Used across all files. Purpose: A modern, thread-safe logging library that replaces standard `print()` with formatted, color-coded, and rotating file logs.
- **`python-dotenv`**: Used by `config.py`. Purpose: Loads the `.env` file into system environment variables to keep paths and secrets out of the codebase.
- **`psycopg2-binary`**: Used by `sync_to_postgres.py`. Purpose: The PostgreSQL database adapter used to sync the SQLite data into the main PaperDrill application database.

### 2.2 File structure

```
scraper/
├── .env.example           # config template (copy to .env)
├── requirements.txt       # python deps
├── README.md              # quick start guide
├── CONTEXT.md             # this file
├── config.py              # loads .env, sets paths + HTTP defaults
├── database.py            # SQLite schema + helpers (Postgres-friendly)
├── http_client.py         # polite session: retries, throttle, User-Agent
├── extractor.py           # pdfplumber → pytesseract OCR fallback
├── segmenter.py           # regex splitter (ASCII + Bangla numerals)
├── scheduler.py           # CAIE/Edexcel monthly + Dhaka seasonal
├── main.py                # CLI entry point (init / run / schedule)
├── data/                  # SQLite DB + rotating log
├── downloads/             # downloaded PDFs (board/subject/year tree)
└── scrapers/
    ├── __init__.py
    ├── base.py            # shared ingest_paper() flow + RunStats
    ├── caie.py            # PapaCambridge (subject-code filtered)
    ├── dhaka.py           # admissionwar image→PDF + lekhaporabd answers
    └── edexcel.py         # PMT (Playwright) + ExamSolutions fallback
```

### 2.3 Database schema (`scraper/data/papers.db`)

```sql
papers (
  id, board, subject, subject_code, level, year, session,
  paper_number, paper_type ('QP'|'MS'),
  source_url UNIQUE, local_path, indexed (0|1), created_at
)

questions (
  id, paper_id FK→papers.id ON DELETE CASCADE,
  question_number, question_text, answer_text, topic_tag, created_at
)

scrape_log (
  id, board, run_at, new_papers, skipped, failed, notes
)
```

Indexes on `papers(board)`, `papers(subject)`, `papers(year)`,
`papers(indexed)`, and `questions(paper_id)`.

### 2.4 Storage layout

```
scraper/data/papers.db                                       # SQLite DB
scraper/data/pipeline.log                                    # rotating log (5 MB × 10)
scraper/downloads/{board}/{subject_code}/{year}/{file}.pdf   # PDFs
```

### 2.5 CLI

```bash
python scraper/main.py init               # create SQLite schema
python scraper/main.py run caie           # scrape just CAIE
python scraper/main.py run dhaka          # scrape just Dhaka
python scraper/main.py run edexcel        # scrape just Edexcel
python scraper/main.py run all            # scrape all three
python scraper/main.py schedule           # long-running scheduled mode
```

### 2.6 Schedule (in `scheduler.py`)

Polls once daily at 03:00 UTC and decides whether each job fires today:

- **CAIE**: 1st of every month, plus **Jul 15** and **Dec 15**
  (post-results days).
- **Edexcel**: 1st of every month.
- **Dhaka**: weekly (Mondays) during **February** and **April** exam
  seasons; monthly the rest of the year (covered by the 1st-of-month
  rule).

### 2.7 HTTP client behaviour (`http_client.py`)

- Single shared `requests.Session` with the configured User-Agent.
- **Throttle**: enforces ≥ `REQUEST_DELAY_SECONDS` (default 2.5 s)
  between requests across the whole process.
- **Retries**: up to `MAX_RETRIES` (default 2) on `429`, `500`, `502`,
  `503`, `504`, with exponential-ish back-off. Returns `None` on
  terminal failure — callers handle gracefully.
- `download_pdf(url, dest)` streams to disk in 64 KB chunks.

### 2.8 Extraction (`extractor.py`)

1. Try **pdfplumber** for clean text-layer PDFs.
2. If the result is < 100 chars total, treat as a scanned PDF and fall
   back to **pdf2image → pytesseract OCR** at 200 DPI.
3. Returns a list of per-page strings; never raises.

### 2.9 Segmentation (`segmenter.py`)

- `TOP_QUESTION_RE` — matches `1.`, `1)`, `12 .` style headers at line
  start (re.MULTILINE).
- `BANGLA_QUESTION_RE` — matches `১.`, `২।`, etc. (Bangla numerals 0–9
  ০–৯).
- `segment_questions(pages)` → list of `{question_number, question_text,
  answer_text=""}`.
- `segment_answers(pages)` → `{question_number: answer_text}` dict.
- `pair_qp_with_ms(qp_pages, ms_pages)` — convenience: extracts QP
  questions and merges MS answers by matching question number.

### 2.10 Per-board ingest flow (`scrapers/base.py::ingest_paper`)

1. Skip if `source_url` already in `papers` table (dedupe).
2. `download_pdf` → local path under `downloads/{board}/{subject_code}/{year}/`.
3. Insert into `papers` table.
4. Run `extractor.extract_text` on the saved PDF.
5. If `paper_type == 'QP'`: segment into questions, bulk insert into
   `questions`, mark paper indexed.
6. If `paper_type == 'MS'`: find the matching QP via `find_matching_qp`
   (board + subject + year + paper_number), segment answers, attach to
   the QP's question rows by `question_number`.
7. Update `RunStats` (new / skipped / failed counters + notes).
8. After the per-board run finishes, persist totals to `scrape_log` and
   print a summary line.

### 2.11 Per-board specifics

- **CAIE** (`scrapers/caie.py`): walks PapaCambridge session-specific
  listing pages, classifies each PDF by filename regex
  (`9701_s23_qp_42.pdf` → subject_code 9701, session May/June 2023, QP,
  paper 42). **Subject-code filter** ensures only PDFs matching the
  target subject are ingested (session pages aggregate all subjects).
  Has a built-in `SUBJECT_LOOKUP` for common codes. Uses Playwright
  fallback for JS-rendered pages.
- **Dhaka** (`scrapers/dhaka.py`): crawls `admissionwar.com` HSC index
  to discover per-subject question pages. Extracts embedded exam images
  (hosted on `ibb.co`), downloads them, and converts to PDF via
  **Pillow**. Also scrapes `lekhaporabd.net` for answer PDFs (`MS`
  paper_type).
- **Edexcel** (`scrapers/edexcel.py`): uses **Playwright** to crawl
  PhysicsAndMathsTutor (PMT) directory trees, discovering exam PDFs
  through JS-rendered navigation. Parses Edexcel-specific filenames
  (`WMA01_01_que_20230111.pdf`). ExamSolutions kept as static fallback.

---

## 3. What has been verified

- All Python modules import cleanly, no syntax errors.
- `python scraper/main.py init` creates the SQLite schema correctly.
- DB inserts work end-to-end: `insert_paper`, `insert_questions`,
  `log_run`, `find_matching_qp`, `attach_answers`.
- Segmenter pairs QP + MS English text correctly via regex (verified
  with a synthetic 3-question example).
- CLI shows the expected `init` / `run` / `schedule` subcommands.
- All system + Python dependencies installed and importable.

### Live scraping test results (Apr 2026)

| Board   | Primary Source       | Strategy                                          | Status |
|---------|----------------------|---------------------------------------------------|--------|
| CAIE    | PapaCambridge        | Static HTML + Playwright fallback + subject filter | ✅ 118 PDFs from 6 URLs (Chemistry 9701) |
| Edexcel | PhysicsAndMathsTutor | Playwright JS rendering, directory traversal       | ✅ PMT operational, ExamSolutions 4 PDFs |
| Dhaka   | admissionwar.com     | Image scraping (ibb.co) → Pillow → PDF            | ✅ 19 subject pages, 18 images from first page |

---

## 4. What has been left to do (Pending Tasks)

1. **Wait for Full Pipeline Execution**: The command `python main.py run all` is currently running in the background. It needs to complete downloading and segmenting all subjects across CAIE, Edexcel, and Dhaka boards.
2. **Execute Database Sync**: The Python scraper currently writes to a standalone `papers.db` SQLite database. Once the scrape finishes, the `sync_to_postgres.py` script needs to be run and verified to push all parsed data into the main PaperDrill Postgres schema.
3. **Refine Bangla Numeral Segmentation**: The current regex inside `segmenter.py` handles starting numerals correctly but struggles with "mid-block" splits. This needs a more sophisticated approach or a machine-learning based fallback to prevent merging distinct questions.
4. **Implement Topic Classification**: The `questions.topic_tag` field is currently left blank. A future task is to build a classifier (either keyword-based heuristics or an LLM step) to automatically assign topics (e.g., "Algebra", "Kinematics") to each question text.
5. **Dockerize the Scraper**: To run alongside the Vercel/Node deployment seamlessly on a VPS or cloud runner, the Python scraper and its system dependencies (Tesseract, Poppler, Playwright browsers) should be bundled into a `Dockerfile`.

---

## 5. Configuration

Copy and edit:

```bash
cp scraper/.env.example scraper/.env
```

Available knobs:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DB_PATH` | `scraper/data/papers.db` | SQLite file location |
| `DOWNLOAD_DIR` | `scraper/downloads` | PDF storage root |
| `USER_AGENT` | Chrome 120 desktop | Sent on every request |
| `REQUEST_DELAY_SECONDS` | `2.5` | Min delay between any two HTTP calls |
| `REQUEST_TIMEOUT_SECONDS` | `30` | Per-request timeout |
| `MAX_RETRIES` | `2` | Retries on 429 / 5xx |
| `USE_PLAYWRIGHT` | `true` | Enable Playwright for JS-rendered pages |

---

## 6. Relationship to PaperDrill

- PaperDrill (`artifacts/paperdrill` + `artifacts/api-server`) is a fully
  separate **Node.js / TypeScript** app stack that uses **Postgres +
  Drizzle**. It's already serving the MVP and has its own seed data.
- The Python scraper here is a **standalone pipeline** that writes to a
  **separate SQLite database**. It does not yet feed data into the
  PaperDrill Postgres DB.
- When ready to merge the two, write a small sync script that reads
  `scraper/data/papers.db` and upserts into the Drizzle schema. The
  schemas are intentionally aligned (board / subject / year /
  paper_number / question_number) to make this straightforward.

---

## 7. Final state (as of Apr 2026)

### What was built
- `scraper/` directory with full Python pipeline (requests, BeautifulSoup4, pdfplumber, pytesseract, **Playwright**)
- `database.py` — SQLite schema with Postgres-compatible types
- `sync_to_postgres.py` — generates correct Postgres upsert SQL
- `tagger.py` — tags questions from existing DB data
- CLI: `init`, `run {caie|dhaka|edexcel}`, `schedule`, `sync-to-postgres`, `tag-questions`

### Key changes (live scraping fix session)
1. **CAIE (`caie.py`)**: Added mandatory `subject_code` filter in `_find_pdf_links` — session pages aggregate ALL subject PDFs; filter ensures only matching codes pass. Updated URL builder with PapaCambridge subject-specific patterns.
2. **Edexcel (`edexcel.py`)**: Complete rewrite. Primary source is now **PhysicsAndMathsTutor (PMT)** with Playwright-based directory crawling. Added `EDEXCEL_FILENAME_RE` parser for standardized filenames. ExamSolutions kept as static fallback.
3. **Dhaka (`dhaka.py`)**: Complete rewrite. Crawls admissionwar HSC index → discovers 19+ subject pages → extracts embedded exam images from `ibb.co` → downloads and converts to PDF using **Pillow** → ingests through standard pipeline. lekhaporabd kept for answer PDFs.
4. **Config**: `USE_PLAYWRIGHT` now defaults to `true`.
5. **Requirements**: Added `playwright>=1.40`.
6. **Integration / Server fix**: Resolved API server deployment port mismatch. Fixed `artifacts/api-server/.env` to use `PORT=8081` mapping correctly to the external routing setup, restoring access to the main PaperDrill application.

### Next steps
1. **Full live run**: Execute `python main.py run all` to populate the database
2. Wire `sync-to-postgres` + `tag-questions` into Docker container startup
3. **Improve Bangla numeral segmentation** to handle mid-block splits
4. **Topic tagging**: backfill `questions.topic_tag` once real data exists
