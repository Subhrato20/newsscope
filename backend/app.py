from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from llm import LLM

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

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
