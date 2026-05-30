import re
from typing import List, Dict, Any
from loguru import logger

def segment_paper(full_text: str) -> List[Dict[str, Any]]:
    """
    Segments the full text of a paper into individual questions.
    Returns a list of dictionaries, each representing a question.
    """
    if not full_text:
        return []
        
    logger.info("Segmenting paper text into individual questions...")
    
    questions = []
    
    # Very basic regex to split by Question numbers (e.g., "1.", "2.", "1 (a)")
    # This will need to be refined based on the actual formatting of different boards.
    # For now, we look for a newline followed by a number and a period or parenthesis.
    
    # Split pattern: newline, maybe some whitespace, 1-2 digits, followed by . or ) or space(
    # e.g. "\n1." or "\n12)" or "\n1 ("
    split_pattern = r'\n\s*(?=\d{1,2}[\.\)\s])'
    
    segments = re.split(split_pattern, full_text)
    
    # The first segment is usually the title/instructions
    header = segments[0]
    
    # Process the rest as questions
    for i, segment in enumerate(segments[1:], start=1):
        segment = segment.strip()
        if not segment:
            continue
            
        # Try to extract the specific question number
        match = re.match(r'^(\d{1,2})[\.\)\s](.*)', segment, re.DOTALL)
        if match:
            q_num = match.group(1).strip()
            q_text = match.group(2).strip()
        else:
            q_num = str(i)
            q_text = segment
            
        questions.append({
            "question_number": q_num,
            "question_text": q_text,
            "answer_text": "Answer not extracted (requires mark scheme linkage).", # Placeholder
            "topic_tag": "Uncategorized" # Placeholder
        })
        
    logger.info(f"Segmented into {len(questions)} questions.")
    return questions
