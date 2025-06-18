import json

def get_user_portfolio():
    path = "/Users/subhratosom/NYC/newsscope/data/user_data.json"
    try:
        with open(path, "r") as f:
            data = json.load(f)
        if not data or not isinstance(data, list):
            return None, {}
        user = data[0]
        name = user.get("user_name", "User")
        portfolio = user.get("portfolio", {})
        return name, portfolio
    except:
        return None, {}

def summarize_user_portfolio():
    name, portfolio = get_user_portfolio()

    if not name or not portfolio:
        return "No portfolio data available or user data could not be read."

    summary = f"{name} holds the following assets in their portfolio:\n"
    for ticker, quantity in portfolio.items():
        summary += f"- {ticker}: {quantity} shares\n"

    return summary.strip()

def deep_market_research(topic):
    name, portfolio = get_user_portfolio()
    topic_upper = topic.upper()

    matched = None
    if topic_upper in portfolio:
        matched = topic_upper

    analysis = f"Market analysis for '{topic}':\n"

    if matched:
        qty = portfolio[matched]
        analysis += f"{name} currently holds {qty} shares of {matched}.\n"
        suggestion = "hold" if qty >= 10 else "consider buying more"
        analysis += f"Based on recent trends, you may want to **{suggestion}** {matched}.\n"
    else:
        analysis += f"{name} does not currently hold any direct investments in '{topic_upper}'.\n"
        analysis += "If you're interested, you might want to research entry points and risk levels before buying.\n"

    analysis += "\nNote: This is a simulated recommendation. Always consult a financial advisor before making investment decisions."
    return analysis
