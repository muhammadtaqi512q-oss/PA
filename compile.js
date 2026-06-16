const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// --- ROYAL CYBERPUNK PREMIUM THEME (Liquid Gold & Midnight Navy) ---
const commonStyles = `
<style>
    body {
        margin: 0; padding: 0;
        background: radial-gradient(circle at center, #0a1128 0%, #000411 100%);
        color: #fff; font-family: 'Segoe UI', Roboto, sans-serif;
        display: flex; flex-direction: column; align-items: center; min-height: 100vh;
    }
    .container {
        width: 90%; max-width: 900px; margin: 40px auto;
        background: rgba(10, 25, 47, 0.7);
        border: 2px solid #d4af37; box-shadow: 0 0 25px rgba(212, 175, 55, 0.2);
        border-radius: 16px; padding: 30px; backdrop-filter: blur(10px);
    }
    h1 {
        text-align: center; color: #d4af37; text-transform: uppercase;
        letter-spacing: 3px; font-size: 2.5rem; text-shadow: 0 0 10px rgba(212,175,55,0.5);
        margin-bottom: 30px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 15px;
    }
    .account-card {
        background: rgba(255, 255, 255, 0.03); border-left: 4px solid #00f0ff;
        margin: 12px 0; padding: 15px 20px; border-radius: 8px;
        display: flex; justify-content: space-between; align-items: center;
    }
    .name-details { font-size: 1.2rem; font-weight: 600; color: #e2e8f0; }
    .level-badge { font-size: 0.85rem; color: #00f0ff; background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 4px; margin-left: 10px; }
    .balance-amount { font-size: 1.3rem; color: #d4af37; font-weight: bold; font-family: 'Courier New', monospace; }
    .btn {
        background: linear-gradient(90deg, #d4af37 0%, #aa7c11 100%);
        color: #000; border: none; padding: 12px 30px; font-weight: bold;
        text-transform: uppercase; border-radius: 6px; cursor: pointer;
        box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); transition: 0.3s;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(212, 175, 55, 0.7); }
    .btn-center { display: block; margin: 30px auto 0 auto; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: #00f0ff; font-weight: 600; text-transform: uppercase; font-size: 0.9rem; }
    input {
        width: 100%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid #d4af37;
        color: #fff; border-radius: 6px; box-sizing: border-box; font-size: 1rem;
    }
    .modal {
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content {
        background: #0a1128; border: 2px solid #00f0ff; border-radius: 12px; padding: 30px; width: 90%; max-width: 450px;
    }
    .modal-title { color: #00f0ff; font-size: 1.5rem; margin-bottom: 20px; text-transform: uppercase; text-align: center; }
</style>
`;

const indexTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEXURA SYSTEMS CENTRAL TERMINAL</title>
    CSS_STYLE_PLACEHOLDER
</head>
<body>
    <div class="container">
        <h1>NEXURA GOLDEN CORE TERMINAL</h1>
        <div id="accounts-list"></div>
        <button class="btn btn-center" id="open-send-modal">Execute Transfer</button>
    </div>

    <div class="modal" id="auth-modal">
        <div class="modal-content">
            <div class="modal-title">Identity Verification</div>
            <div class="form-group">
                <label>Cryptographic Username</label>
                <input type="text" id="auth-user" placeholder="Enter name">
            </div>
            <div class="form-group">
                <label>Security Keyphrase</label>
                <input type="password" id="auth-pass" placeholder="Enter password">
            </div>
            <button class="btn" style="width:100%" id="btn-auth-next">Authenticate Node</button>
        </div>
    </div>

    <div class="modal" id="transfer-modal">
        <div class="modal-content">
            <div class="modal-title">Distribute Network Funds</div>
            <div class="form-group">
                <label>Target Identity Matrix</label>
                <input type="text" id="transfer-to" placeholder="Recipient name">
            </div>
            <div class="form-group">
                <label>Credits (Rs.)</label>
                <input type="number" id="transfer-amount" placeholder="Amount">
            </div>
            <button class="btn" style="width:100%;" id="btn-execute-transfer">Deploy Secure Transaction</button>
        </div>
    </div>

    <script>js_placeholder</script>
</body>
</html>
`;

function getBankJS(rawDatabase) {
    return `
    (function() {
        if(!localStorage.getItem('nexura_bank_matrix')) {
            localStorage.setItem('nexura_bank_matrix', JSON.stringify(${JSON.stringify(rawDatabase)}));
        }

        let db = JSON.parse(localStorage.getItem('nexura_bank_matrix'));
        let activeUser = null;

        function render() {
            const out = document.getElementById('accounts-list');
            out.innerHTML = '';
            db.forEach(u => {
                out.innerHTML += \`
                    <div class="account-card">
                        <div class="name-details">\${u.username} <span class="level-badge">LVL \${u.level}</span></div>
                        <div class="balance-amount">Rs. \${u.balance.toLocaleString()}</div>
                    </div>
                \`;
            });
        }

        document.getElementById('open-send-modal').onclick = () => { document.getElementById('auth-modal').style.display='flex'; };

        document.getElementById('btn-auth-next').onclick = () => {
            const uVal = document.getElementById('auth-user').value.trim();
            const pVal = document.getElementById('auth-pass').value.trim();
            const found = db.find(x => x.username.toLowerCase() === uVal.toLowerCase() && x.password === pVal);
            if(found) {
                activeUser = found;
                document.getElementById('auth-modal').style.display='none';
                document.getElementById('transfer-modal').style.display='flex';
            } else {
                alert("ACCESS DENIED: Credentials mismatch.");
            }
        };

        document.getElementById('btn-execute-transfer').onclick = () => {
            const target = document.getElementById('transfer-to').value.trim();
            const amt = parseInt(document.getElementById('transfer-amount').value);

            if(!target || isNaN(amt) || amt <= 0) return;

            const sIdx = db.findIndex(x => x.username.toLowerCase() === activeUser.username.toLowerCase());
            const rIdx = db.findIndex(x => x.username.toLowerCase() === target.toLowerCase());

            if(rIdx === -1) { alert("Target node missing in matrix."); return; }
            if(db[sIdx].balance < amt) { alert("Insufficient network credits!"); return; }

            db[sIdx].balance -= amt;
            db[rIdx].balance += amt;
            db[sIdx].txCount = (db[sIdx].txCount || 0) + 1;

            localStorage.setItem('nexura_bank_matrix', JSON.stringify(db));
            
            alert("LOCAL CRYPTO MATRIX SUCCESSFUL! Downloading data.json block stream. Commit this file to your PA repo to auto-compile sequential Readmes.");
            
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "data.json");
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();

            document.getElementById('transfer-modal').style.display='none';
            render();
        };

        render();
    })();
    `;
}

// --- AUTOMATION ENGINE: COMPILE AND GENERATE CASCADE SEQUENTIAL MARKDOWNS ---
try {
    const dataPath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataPath)) {
        console.error("Critical Matrix Error: data.json target missing.");
        process.exit(1);
    }
    
    const dbMatrix = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

    // 1. Build and Obfuscate Web GUI Application
    const rawJS = getBankJS(dbMatrix);
    const securedJS = JavaScriptObfuscator.obfuscate(rawJS, { compact: true, controlFlowFlattening: true }).getObfuscatedCode();
    
    let finalHtml = indexTemplate.replace('CSS_STYLE_PLACEHOLDER', commonStyles);
    finalHtml = finalHtml.replace('js_placeholder', securedJS);
    
    fs.writeFileSync(path.join(distPath, 'index.html'), finalHtml);
    console.log("GUI Core Web Terminal compiled successfully.");

    // 2. Build Infinite Cascading Sequential Markdown Files (MT.md, MT1.md, MT2.md...)
    dbMatrix.forEach(user => {
        const safeName = user.username.replace(/\s+/g, '_');
        const currentTxIndex = user.txCount || 0;
        
        const mdContent = `# NEXURA CORE SECURITY INDEX FOR NODE: ${user.username.toUpperCase()}
---
- **Account Identity Node:** ${user.username}
- **Available Crypto Net Worth:** Rs. ${user.balance.toLocaleString()}
- **Node System Authority:** Level ${user.level}
- **Validation Ratings Matrix:** ${'⭐'.repeat(user.stars || 0) || 'None'}
- **Sequential Block Sequence Index:** Iteration-${currentTxIndex}
- **Security Check Status:** ONLINE / SECURE

*Automated validation manifest locked by Nexura Architecture Systems Runtime Engine.*
`;

        // Pehli Base Identity File Generate karein (e.g., Muhammad_TAQI.md)
        fs.writeFileSync(path.join(distPath, `${safeName}.md`), mdContent);
        
        // Loop lagakar index 1 se lekar current transaction count tak saari files output folder mein banana
        for (let i = 1; i <= currentTxIndex; i++) {
            fs.writeFileSync(path.join(distPath, `${safeName}${i}.md`), mdContent);
        }
        
        if (currentTxIndex === 0) {
            fs.writeFileSync(path.join(distPath, `${safeName}1.md`), mdContent);
        }
    });

    console.log("All infinite sequential markdown records compiled safely into dist folder!");
} catch (error) {
    console.error("Compilation sequence broke: ", error);
    process.exit(1);
}
