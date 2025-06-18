import openai
import json
import numpy as np
import os

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def get_relevant_articles(query, top_k=3, articles_path="articles.jsonl"):
    with open(articles_path, "r", encoding="utf-8") as f:
        articles = [json.loads(line) for line in f]

    # New API for query embedding
    response = client.embeddings.create(
        input=query,
        model="text-embedding-ada-002"
    )
    query_embedding = response.data[0].embedding

    scored_articles = []
    for article in articles:
        article_text = article.get("markdown", "")
        # New API for article embedding
        response = client.embeddings.create(
            input=article_text,
            model="text-embedding-ada-002"
        )
        article_embedding = response.data[0].embedding

        score = cosine_similarity(query_embedding, article_embedding)
        scored_articles.append((score, article))

    scored_articles.sort(reverse=True, key=lambda x: x[0])
    return [article for score, article in scored_articles[:top_k]]