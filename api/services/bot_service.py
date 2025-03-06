from api.services.data_store import data_store

def get_bot_response_fallback(message: str) -> str:
    message = message.lower()
    
    # Get current metrics for context-aware responses
    metrics = data_store.get_factory_metrics()
    status = data_store.get_factory_status()
    batch_quality = data_store.get_batch_quality()
    energy_metrics = data_store.get_energy_metrics()
    
    # Check for production related queries
    if any(word in message for word in ["production", "output", "units"]):
        return f"Current production is at {metrics['production']:.2f} units. This is " + \
               ("above" if metrics['production'] > 600 else "below") + \
               " our target of 600 units. Efficiency is at {metrics['efficiency']:.2f}%."
    
    # Check for efficiency related queries
    elif any(word in message for word in ["efficiency", "performance"]):
        return f"Factory efficiency is currently at {metrics['efficiency']:.2f}%. " + \
               ("This is good!" if metrics['efficiency'] > 55 else "We should aim to improve this.") + \
               f" Our profit margin is {metrics['profitMargin']:.2f}%."
    
    # Check for downtime related queries
    elif any(word in message for word in ["downtime", "maintenance", "repair"]):
        return f"Current downtime is {metrics['downtime']:.2f} hours. " + \
               f"Some machines may require maintenance soon based on their age."
    
    # Check for status related queries
    elif any(word in message for word in ["status", "condition", "state"]):
        operational_count = sum(1 for line in status if line["status"] == "operational")
        warning_count = sum(1 for line in status if line["status"] == "warning")
        down_count = sum(1 for line in status if line["status"] == "down")
        
        return f"Currently, {operational_count} production lines are operational, " + \
               f"{warning_count} lines are showing warnings, and " + \
               f"{down_count} lines are down. Overall factory status is " + \
               ("good." if operational_count >= 3 else "concerning.")
    
    # Check for quality related queries
    elif any(word in message for word in ["quality", "batch quality", "pass rate"]):
        return f"The average batch quality pass rate is {batch_quality['average']:.2f}%. " + \
               f"Our best batch had a {batch_quality['max']:.2f}% pass rate, while our worst " + \
               f"had a {batch_quality['min']:.2f}% pass rate."
    
    # Check for energy related queries
    elif any(word in message for word in ["energy", "consumption", "emissions"]):
        return f"Average energy consumption is {energy_metrics['consumption']:.2f} kWh with an " + \
               f"efficiency rating of {energy_metrics['efficiency']:.2f}. " + \
               f"CO2 emissions average {energy_metrics['emissions']:.2f} kg."
    
    # Help command
    elif any(word in message for word in ["help", "assist", "command", "what can you"]):
        return "I can provide information about production rates, efficiency, downtime, line status, " + \
               "batch quality, and energy consumption. You can ask questions like 'What's our current production?', " + \
               "'How's our efficiency?', 'Any downtime issues?', 'What's the status of our lines?', " + \
               "'How's our batch quality?', or 'What's our energy consumption?'"
    
    # Default response
    else:
        return "I'm not sure I understand. You can ask about production, efficiency, downtime, status, " + \
               "batch quality, or energy consumption. Type 'help' for more information."

