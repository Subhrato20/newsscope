import json
import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import Dict, Tuple

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_user_portfolio() -> Tuple[str, Dict[str, int]]:
    path = "/Users/rolandyang/Documents/GitHub/newsscope/frontend/public/data/user_data.json"
    try:
        with open(path, "r") as f:
            data = json.load(f)
        if not data or not isinstance(data, list):
            return "User", {}
        user = data[0]
        return user.get("user_name", "User"), user.get("portfolio", {})
    except:
        return "User", {}

def summarize_user_portfolio() -> str:
    name, portfolio = get_user_portfolio()
    if not portfolio:
        return f"{name} has no portfolio data available."
    summary = f"{name} holds the following assets in their portfolio:\n"
    for ticker, qty in portfolio.items():
        summary += f"- {ticker}: {qty} shares\n"
    return summary.strip()

def deep_market_research(topic: str) -> str:
    """
    1) Runs a web search on the topic,
    2) Asks GPT-4o to respond with *only* one of: Buy, Hold, or Sell.
    """
    # 1) Web search for context
    ws = client.responses.create(
        model="gpt-4.1",
        tools=[{"type": "web_search_preview"}],
        input=f"Latest market news and analysis on {topic.upper()}"
    ).output_text

    # 2) Distill to a single stance
    stance = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a financial expert. "
                    "Based on the following market analysis, respond with exactly one word: "
                    "Buy, Hold, or Sell."
                )
            },
            {"role": "user", "content": ws}
        ],
        temperature=0
    ).choices[0].message.content.strip()

    # Ensure formatting
    stance = stance.capitalize()
    if stance not in {"Buy", "Hold", "Sell"}:
        # Fallback if GPT deviates
        stance = "Hold"
    return stance
