import asyncio
import json
from firecrawl import AsyncFirecrawlApp, ScrapeOptions

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

asyncio.run(main())
