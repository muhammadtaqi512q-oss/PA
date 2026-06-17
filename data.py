import json
import os

DATA_FILE = "user_data.json"

# Initial Data jo aapne manga tha
INITIAL_USERS = {
    "Muhammad TAQI": {"password": "Muhammad Taqi512", "balance": 500000, "stars": 0, "level": 1},
    "OLIVIA": {"password": "OLIVIA786", "balance": 200000, "stars": 0, "level": 1},
    "JACK": {"password": "JACK", "balance": 500000, "stars": 0, "level": 1},
    "THUNDER": {"password": "THUNDER", "balance": 700000, "stars": 0, "level": 1},
    "WILLIAM": {"password": "WILLIAM", "balance": 500000, "stars": 0, "level": 1},
    "ELIZBETH": {"password": "ELIZBETH", "balance": 800000, "stars": 0, "level": 1},
    "ZIRA": {"password": "ZIRA", "balance": 1000000, "stars": 0, "level": 1},
    "LYRA HEAD MANAGER OF NEXURA": {"password": "LYRA", "balance": 3500000, "stars": 0, "level": 1},
    "AHMED": {"password": "AHMED", "balance": 50000, "stars": 0, "level": 1},
    "OWNER": {"password": "OWNERMASTEROKDONE", "balance": 10000000, "stars": 0, "level": 1}
}

def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump(INITIAL_USERS, f, indent=4)
        return INITIAL_USERS
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)
