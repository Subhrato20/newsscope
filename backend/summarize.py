import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# Load API key
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def load_articles(file_path="articles.json"):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error reading input file: {e}")
        return []

def summarize_article(article):
    title = article.get("title", "").strip()
    description = article.get("description", "").strip()
    markdown = article.get("markdown", "").strip()

    # Combine text input
    content = "\n\n".join([
        f"Title: {title}" if title else "",
        f"Description: {description}" if description else "",
        markdown
    ]).strip()

    if not content:
        return "⚠️ No content to summarize."

    messages = [
        {
            "role": "system",
            "content": (
                "You are a financial news summarizer. Given one article, return a 1–2 sentence summary capturing the key financial development. "
                "Keep it concise and in a neutral tone. Focus on company names, deals, stock movements, or product updates."
                "Give a numerical sentiment score reflecting the likely impact on the stock price, from -100 to 100, -100 being bad and 100 being good."
            )
        },
        {
            "role": "user",
            "content": content
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=messages,
            temperature=0.3,
            max_tokens=100
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"❌ OpenAI API error: {e}"

if __name__ == "__main__":
    print("📥 Loading input data...")
    articles = load_articles("articles.json")

    print(f"🧾 Found {len(articles)} articles.\n")

    for i, article in enumerate(articles, 1):
        print(f"📰 Article {i}: {article.get('title', 'Untitled')}")
        summary = summarize_article(article)
        print(f"🧠 Summary: {summary}\n{'-'*60}")
