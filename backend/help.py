import re

def parse_sentiment_score(summary_text):
    """
    Parse sentiment score from the last line of a summary.
    Expected format: "Sentiment Score: NUMBER"
    """
    try:
        # Split by lines and get the last line
        lines = summary_text.strip().split('\n')
        last_line = lines[-1].strip()
        
        # Use regex to extract the number after "Sentiment Score:"
        match = re.search(r'Sentiment Score:\s*([+-]?\d+(?:\.\d+)?)', last_line)
        if match:
            return float(match.group(1))
        else:
            return None
    except Exception as e:
        print(f"Error parsing sentiment score: {e}")
        return None