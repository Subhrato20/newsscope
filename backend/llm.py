from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

class LLM:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.model = "gpt-4.1"
        self.user_data_path = Path("/Users/subhratosom/NYC/newsscope/data/user_data.json")
        self.user_data = self._load_user_data()
        
    def _load_user_data(self):
        try:
            with open(self.user_data_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading user data: {e}")
            return []
            
    def _get_portfolio_summary(self, user_id=None):
        """Tool 2: Summarize user portfolio"""
        try:
            user = next((u for u in self.user_data if u["userid"] == user_id), self.user_data[0])
            portfolio = user["portfolio"]
            
            # Calculate total value and percentages
            total_shares = sum(portfolio.values())
            portfolio_summary = {
                "user_name": user["user_name"],
                "total_shares": total_shares,
                "holdings": [
                    {
                        "symbol": symbol,
                        "shares": shares,
                        "percentage": (shares / total_shares) * 100
                    }
                    for symbol, shares in portfolio.items()
                ]
            }
            return portfolio_summary
        except Exception as e:
            return {"error": f"Error summarizing portfolio: {str(e)}"}
            
    def _get_market_research(self, symbols):
        """Tool 1: Deep market research"""
        try:
            # Here you would typically integrate with a market data API
            # For now, we'll return a placeholder response
            research = {}
            for symbol in symbols:
                research[symbol] = {
                    "current_price": "Placeholder price",
                    "market_cap": "Placeholder market cap",
                    "pe_ratio": "Placeholder PE ratio",
                    "dividend_yield": "Placeholder dividend yield",
                    "recent_news": ["Placeholder news 1", "Placeholder news 2"]
                }
            return research
        except Exception as e:
            return {"error": f"Error getting market research: {str(e)}"}
        
    def get_chat_response(self, messages, use_web_search=False, tool_choice=None):
        try:
            tools = []
            if use_web_search:
                tools.append({"type": "web_search_preview"})
                
            # Add custom tools
            tools.extend([
                {
                    "type": "function",
                    "name": "get_market_research",
                    "description": "Get deep market research for specified stock symbols",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "symbols": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "List of stock symbols to research"
                            }
                        },
                        "required": ["symbols"],
                        "additionalProperties": False
                    }
                },
                {
                    "type": "function",
                    "name": "get_portfolio_summary",
                    "description": "Get a summary of the user's investment portfolio",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "User ID to get portfolio for (optional)"
                            }
                        },
                        "required": [],
                        "additionalProperties": False
                    }
                }
            ])
                
            response = self.client.responses.create(
                model=self.model,
                input=messages,
                tools=tools,
                temperature=0.7,
                max_tokens=150
            )
            
            # Handle tool calls
            if response.output:
                for item in response.output:
                    if item.type == "function_call":
                        if item.name == "get_market_research":
                            args = json.loads(item.arguments)
                            research = self._get_market_research(args["symbols"])
                            return {"text": json.dumps(research, indent=2), "annotations": []}
                        elif item.name == "get_portfolio_summary":
                            args = json.loads(item.arguments)
                            summary = self._get_portfolio_summary(args.get("user_id"))
                            return {"text": json.dumps(summary, indent=2), "annotations": []}
                    elif item.type == "web_search_call":
                        continue
                    elif item.type == "message":
                        return {
                            "text": item.content[0].text,
                            "annotations": item.content[0].annotations if hasattr(item.content[0], 'annotations') else []
                        }
            
            # For non-tool responses
            return {"text": response.output_text, "annotations": []}
            
        except Exception as e:
            return {"text": f"Error: {str(e)}", "annotations": []} 
