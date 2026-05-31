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
            
        # Basic Heuristics to filter out garbage and boilerplate
        if len(q_text) < 15:
            continue
            
        blocklist = [
            "copyright", 
            "all rights reserved", 
            "uccles", 
            "cambridge assessment", 
            "do not write", 
            "turn over",
            "blank page"
        ]
        if any(b in q_text.lower() for b in blocklist):
            continue
            
        questions.append({
            "question_number": q_num,
            "question_text": q_text,
            "answer_text": "Answer not extracted (requires mark scheme linkage).", # Placeholder
            "topic_tag": "Uncategorized" # Placeholder
        })
        
    logger.info(f"Segmented into {len(questions)} questions.")
    return questions

def segment_ms(ms_text: str) -> Dict[str, str]:
    """
    Segments the full text of a mark scheme into answers mapped by question number.
    Combines subparts (e.g., 1(a), 1(b)) into a single consolidated answer for the question number.
    """
    if not ms_text:
        return {}
        
    logger.info("Segmenting mark scheme text into answers...")
    
    answers = {}
    
    # Split pattern: newline, maybe some whitespace, 1-2 digits, followed by . or ) or space
    split_pattern = r'\n\s*(?=\d{1,2}[\.\)\s])'
    segments = re.split(split_pattern, ms_text)
    
    for segment in segments[1:]:
        segment = segment.strip()
        if not segment:
            continue
            
        # Extract the question number and subparts
        # Standard: "1 (a) ...", "1. ...", "1) ..."
        match = re.match(r'^(\d{1,2})\s*([\.\)\s\(a-z]*)(.*)', segment, re.DOTALL)
        if match:
            q_num = match.group(1).strip()
            subpart = match.group(2).strip()
            ans_content = match.group(3).strip()
            
            # Reconstruct subpart with formatting
            full_ans = ""
            if subpart:
                # Clean up subpart: e.g. "(a)" or "a"
                sub_clean = subpart.strip().strip('.').strip(')').strip('(').strip()
                if sub_clean:
                    full_ans = f"({sub_clean}) {ans_content}"
                else:
                    full_ans = ans_content
            else:
                full_ans = ans_content
                
            if q_num in answers:
                answers[q_num] += "\n\n" + full_ans
            else:
                answers[q_num] = full_ans
                
    logger.info(f"Extracted answers for {len(answers)} question numbers.")
    return answers
