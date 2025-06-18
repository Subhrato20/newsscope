from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from tools import deep_market_research, summarize_user_portfolio

load_dotenv()

class LLM:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.model = "gpt-4o"

        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "summarize_user_portfolio",
                    "description": "Summarize the user's portfolio in plain English.",
                    "parameters": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "deep_market_research",
                    "description": "Conduct deep market research on a given stock or topic, and offer personalized buy/hold/sell suggestions based on the user's portfolio.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "topic": {
                                "type": "string",
                                "description": "The stock symbol or investment topic to research, e.g., TSLA or AI stocks"
                            }
                        },
                        "required": ["topic"]
                    }
                }
            }
        ]

        self.tool_functions = {
            "summarize_user_portfolio": summarize_user_portfolio,
            "deep_market_research": deep_market_research
        }

    def get_chat_response(self, messages, temperature=0.7, max_tokens=800):
        try:
            # First LLM call (with tool suggestions enabled)
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                tools=self.tools,
                tool_choice="auto"
            )

            choice = response.choices[0]

            # Check if LLM is invoking a tool
            if choice.finish_reason == "tool_calls":
                tool_call = choice.message.tool_calls[0]
                tool_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)

                # Run the actual tool function
                tool_result = self.tool_functions[tool_name](**arguments)

                # Add tool result to messages and re-query LLM for final answer
                followup_response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages + [
                        {"role": "assistant", "tool_calls": [tool_call]},
                        {"role": "tool", "tool_call_id": tool_call.id, "content": tool_result}
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens
                )

                return followup_response.choices[0].message.content

            # If no tool used, return the first reply directly
            return choice.message.content

        except Exception as e:
            return f"Error: {str(e)}"
