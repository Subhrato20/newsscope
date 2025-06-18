import asyncio
import json
from firecrawl import AsyncFirecrawlApp, ScrapeOptions
import pathway as pw
from pathway import debug

class Article(pw.Schema):
    title: str
    description: str
    url: str
    markdown: str
    metadata: dict
    links: list[str]

async def news_api_call(stock_name, limit=5):
    try:
        app = AsyncFirecrawlApp(api_key='fc-0d3f25709bd14df9924bad5a307be023')
        query = f"Most recent news about {stock_name} stock"
        
        response = await app.search(
            query=query,
            limit=limit,
            scrape_options=ScrapeOptions(formats=['markdown', 'links'])
        )
        
        return response
        
    except Exception as e:
        print(f"Error searching for news about {stock_name}: {str(e)}")
        return []

async def response_to_articles(response):
    articles = []
    if response and "data" in response:
        for record in response["data"]:
            article = {
                "title": record.get("title", ""),
                "description": record.get("description", ""),
                "url": record.get("url", ""),
                "markdown": record.get("markdown", ""),
                "metadata": record.get("metadata", {}),
                "links": record.get("links", [])
            }
            articles.append(article)
    
    return articles

async def main():
    app = AsyncFirecrawlApp(api_key='fc-0d3f25709bd14df9924bad5a307be023')
    response = await app.search(
        query='Most recent news about AAPL stocks.',
        limit=2,
        scrape_options=ScrapeOptions(formats=['markdown', 'links'])
    )
    print(response)
    
    with open("articles.jsonl", "w", encoding="utf-8") as f:
        for record in response["data"]:
            f.write(json.dumps(record) + "\n")
    
    articles = pw.io.jsonlines.read(
        "articles.jsonl",
        schema=Article,
        mode="streaming" 
    )

    pw.debug.compute_and_print_update_stream(articles)
    pw.run()

if __name__ == "__main__":
    asyncio.run(main())
