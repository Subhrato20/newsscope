from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import pathway as pw
from pathway import debug
import os
import asyncio
import json
import re
from llm import LLM
from search import news_api_call, response_to_articles
from summarize import summarize_article
from help import parse_sentiment_score

class Article(pw.Schema):
    title: str
    description: str
    url: str
    markdown: str
    metadata: dict
    links: list[str]

load_dotenv()

app = Flask(__name__)
CORS(app)
llm = LLM()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to NewsScope API"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        response = llm.get_chat_response(messages)
        return jsonify({"response": response})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/news', methods=['POST'])
def news():
    try:
        print("News API called: " + str(request.json))

        data = request.json
        stock_name = data.get('stock_name', '')
        
        if not stock_name:
            return jsonify({"error": "No stock name provided"}), 400

        # Search for news articles related to the stock
        response = asyncio.run(news_api_call(stock_name))
        articles = asyncio.run(response_to_articles(response))
        
        # Summarize the articles and extract sentiment scores
        summarized_articles = []
        sentiment_scores = []
        
        for article in articles:
            summary = summarize_article(article)
            sentiment_score = parse_sentiment_score(summary)
            
            summarized_articles.append(summary)
            sentiment_scores.append(sentiment_score)

        # Update the RAG
        # with open("articles.jsonl", "w", encoding="utf-8") as f:
        #     for record in response["data"]:
        #         f.write(json.dumps(record) + "\n")
                
        # articles = pw.io.jsonlines.read(
        #     "articles.jsonl",
        #     schema=Article,
        #     mode="streaming" 
        # )

        # Calculate average sentiment score
        valid_scores = [score for score in sentiment_scores if score is not None]
        total_sentiment = sum(valid_scores) / len(valid_scores) if valid_scores else 0

        return jsonify({
            "stock_name": stock_name,
            "articles": articles,
            "summarized_articles": summarized_articles,
            "sentiment_scores": sentiment_scores,
            "average_sentiment": total_sentiment
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
