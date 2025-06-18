import json

def convert_jsonl_to_json():
    """
    Convert articles.jsonl to articles.json
    """
    articles = []
    
    # Read the JSONL file
    with open('articles.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:  # Skip empty lines
                try:
                    article = json.loads(line)
                    articles.append(article)
                except json.JSONDecodeError as e:
                    print(f"Error parsing line: {e}")
                    continue
    
    # Write to JSON file
    with open('articles.json', 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully converted {len(articles)} articles from JSONL to JSON")
    print("Output saved to articles.json")

if __name__ == "__main__":
    convert_jsonl_to_json() 