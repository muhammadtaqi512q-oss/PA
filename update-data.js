const fs = require('fs');
const path = require('path');

// Load data.json
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const payload = JSON.parse(fs.readFileSync('payload.json', 'utf8'));

function saveData() {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

function findUser(name) {
  return data.find(u => u.name === name);
}

function getNextTxNumber(receiverName) {
  const dir = 'transactions';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const files = fs.readdirSync(dir).filter(f => f.startsWith(receiverName) && f.endsWith('.md'));
  if (files.length === 0) return 1;
  const numbers = files.map(f => {
    const match = f.match(new RegExp(`^${receiverName}(\\d+)\\.md$`));
    return match ? parseInt(match[1]) : 0;
  });
  return Math.max(...numbers) + 1;
}

if (payload.action === 'sendMoney') {
  const sender = findUser(payload.sender);
  const receiver = findUser(payload.receiver);
  if (!sender) throw new Error(`Sender ${payload.sender} not found`);
  if (!receiver) throw new Error(`Receiver ${payload.receiver} not found`);
  if (sender.balance < payload.amount) throw new Error('Insufficient balance');

  sender.balance -= payload.amount;
  receiver.balance += payload.amount;
  saveData();
  console.log(`Transferred ${payload.amount} from ${sender.name} to ${receiver.name}`);
}

else if (payload.action === 'sellDomain') {
  const receiver = findUser(payload.receiver);
  if (!receiver) throw new Error(`Receiver account ${payload.receiver} not found`);

  // Transfer 10,000 to receiver (money generated)
  receiver.balance += 10000;

  // Star system for receiver
  if (!receiver.stars) receiver.stars = 0;
  if (!receiver.level) receiver.level = 0;
  receiver.stars += 1;
  if (receiver.stars >= 5) {
    receiver.level = Math.min(10, receiver.level + 1);
    receiver.stars = 0;
  }

  // Create transaction markdown file (optional)
  const dir = 'transactions';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const txNum = getNextTxNumber(receiver.name);
  const fileName = `${receiver.name}${txNum}.md`;
  const txContent = `# Transaction #${txNum} for ${receiver.name}
- **Domain:** ${payload.domain}
- **Sold by:** ${payload.sellerName}
- **Amount:** Rs. 10,000
- **New Balance:** Rs. ${receiver.balance}
- **Stars:** ${receiver.stars} | **Level:** ${receiver.level}
- **Date:** ${new Date().toISOString()}
`;
  fs.writeFileSync(path.join(dir, fileName), txContent);
  console.log(`Transaction file created: ${fileName}`);

  saveData();
  console.log(`Domain sale successful. 10,000 transferred to ${receiver.name}.`);
}
