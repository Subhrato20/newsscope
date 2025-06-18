from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class LLM:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.model = "gpt-4"
        
    def get_chat_response(self, messages, temperature=0.7, max_tokens=150):
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}" 
