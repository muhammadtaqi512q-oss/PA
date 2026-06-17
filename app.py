from flask import Flask, render_template, request, redirect, flash
from data import load_data, save_data

app = Flask(__name__)
app.secret_key = "super_secret_key_for_nexura"

# Web 2 ke liye password calculate karne ka logic (a=1, b=2... z=26)
def calculate_char_sum(text):
    text = text.lower()
    total = 0
    for char in text:
        if 'a' <= char <= 'z':
            total += (ord(char) - ord('a') + 1)
    return total

def get_domain_password(username, domain):
    sum_user = calculate_char_sum(username)
    sum_domain = calculate_char_sum(domain)
    return f"{sum_user},{sum_domain}"

@app.route('/')
def index():
    users = load_data()
    return render_template('index.html', users=users)

# --- WEB 1: SEND MONEY ---
@app.route('/send_money', methods=['POST'])
def send_money():
    users = load_data()
    sender = request.form.get('sender_name')
    password = request.form.get('password')
    receiver = request.form.get('receiver_name')
    try:
        amount = int(request.form.get('amount'))
    except ValueError:
        flash("Error: Invalid Amount!", "error")
        return redirect('/')

    # Validations
    if sender not in users or users[sender]['password'] != password:
        flash("Error: Invalid Sender Name or Password!", "error")
    elif receiver not in users:
        flash("Error: Receiver User does not exist!", "error")
    elif users[sender]['balance'] < amount:
        flash(f"Error: Insufficient funds! You only have Rs. {users[sender]['balance']:,}", "error")
    elif amount <= 0:
        flash("Error: Amount must be greater than 0!", "error")
    else:
        # Transfer process
        users[sender]['balance'] -= amount
        users[receiver]['balance'] += amount
        save_data(users)
        flash(f"Success: Rs. {amount:,} successfully transferred from {sender} to {receiver}!", "success")

    return redirect('/')

# --- WEB 2: SELL DOMAIN ---
@app.route('/sell_domain', methods=['POST'])
def sell_domain():
    users = load_data()
    username = request.form.get('domain_user')
    domain = request.form.get('domain_name')
    provided_password = request.form.get('domain_password')
    target_account = request.form.get('target_account')

    # Auto-generate dynamic password
    correct_password = get_domain_password(username, domain)

    if provided_password != correct_password:
        flash(f"Error: Invalid Domain Password! Expected format for '{username}' & '{domain}' is '{correct_password}'", "error")
    elif target_account not in users:
        flash("Error: Target account for money transfer does not exist!", "error")
    else:
        # Transfer 10,000 to the target account
        users[target_account]['balance'] += 10000
        
        # Add star and update level
        users[target_account]['stars'] += 1
        if users[target_account]['stars'] >= 5:
            if users[target_account]['level'] < 10:
                users[target_account]['level'] += 1
                users[target_account]['stars'] = 0 # Reset stars after level up
                flash(f"Level Up! {target_account} reached Level {users[target_account]['level']}!", "success")
        
        save_data(users)
        flash(f"Success: Domain '{domain}' sold! Rs. 10,000 & 1 Star added to {target_account}!", "success")

    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
