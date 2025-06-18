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

asyncio.run(main())
