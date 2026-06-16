const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// --- PREMIUM ROYAL CYBERPUNK PALETTE ---
const commonStyles = `
<style>
    body {
        margin: 0; padding: 0;
        background: radial-gradient(circle at center, #0a1128 0%, #000411 100%);
        color: #fff; font-family: 'Segoe UI', Roboto, sans-serif;
        display: flex; flex-direction: column; align-items: center; min-height: 100vh;
    }
    .nav-bar {
        width: 100%; max-width: 900px; display: flex; justify-content: space-around;
        margin-top: 20px; padding: 10px 0; background: rgba(255,255,255,0.02); border-radius: 8px;
    }
    .nav-bar a { color: #00f0ff; text-decoration: none; font-weight: bold; font-size: 1.1rem; text-transform: uppercase; }
    .nav-bar a:hover { color: #d4af37; }
    .container {
        width: 90%; max-width: 900px; margin: 30px auto;
        background: rgba(10, 25, 47, 0.7); border: 2px solid #d4af37;
        box-shadow: 0 0 25px rgba(212, 175, 55, 0.2); border-radius: 16px; padding: 30px; backdrop-filter: blur(10px);
    }
    h1 {
        text-align: center; color: #d4af37; text-transform: uppercase; letter-spacing: 3px;
        font-size: 2.2rem; text-shadow: 0 0 10px rgba(212,175,55,0.5); margin-bottom: 25px;
        border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 15px;
    }
    .account-card {
        background: rgba(255, 255, 255, 0.03); border-left: 4px solid #00f0ff;
        margin: 12px 0; padding: 15px 20px; border-radius: 8px;
        display: flex; justify-content: space-between; align-items: center;
    }
    .name-details { font-size: 1.2rem; font-weight: 600; color: #e2e8f0; }
    .level-badge { font-size: 0.85rem; color: #00f0ff; background: rgba(0,240,255,0.1); padding: 2px 8px; border-radius: 4px; margin-left: 10px; }
    .stars-badge { color: #ffdf00; margin-left: 10px; font-size: 0.95rem; }
    .balance-amount { font-size: 1.3rem; color: #d4af37; font-weight: bold; font-family: 'Courier New', monospace; }
    .btn {
        background: linear-gradient(90deg, #d4af37 0%, #aa7c11 100%); color: #000;
        border: none; padding: 12px 30px; font-weight: bold; text-transform: uppercase;
        border-radius: 6px; cursor: pointer; box-shadow: 0 0 15px rgba(212,175,55,0.4); transition: 0.3s;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(212,175,55,0.7); }
    .btn-center { display: block; margin: 20px auto 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 6px; color: #00f0ff; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; }
    input {
        width: 100%; padding: 12px; background: rgba(0,0,0,0.5); border: 1px solid #d4af37;
        color: #fff; border-radius: 6px; box-sizing: border-box; font-size: 1rem;
    }
    .modal {
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); justify-content: center; align-items: center; z-index: 1000;
    }
    .modal-content { background: #0a1128; border: 2px solid #00f0ff; border-radius: 12px; padding: 30px; width: 90%; max-width: 450px; }
    .modal-title { color: #00f0ff; font-size: 1.4rem; margin-bottom: 20px; text-transform: uppercase; text-align: center; }
</style>
`;

// --- WEB 1 TEMPLATE: BANK CORE ---
const bankTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><title>NEXURA CORE BANKING</title>
    CORE_STYLE_TAG
</head>
<body>
    <div class="nav-bar">
        <a href="./index.html">🏦 Central Bank Terminal</a>
        <a href="./domain.html">🌐 Domain Black-Market</a>
    </div>
    <div class="container">
        <h1>NEXURA GLOBAL LEDGER TERMINAL</h1>
        <div id="accounts-list"></div>
        <button class="btn btn-center" id="open-tx-modal">Send Money</button>
    </div>

    <div class="modal" id="tx-modal">
        <div class="modal-content">
            <div class="modal-title">Authorized Fund Transfer</div>
            <div class="form-group"><label>Your Identity Name</label><input type="text" id="my-name"></div>
            <div class="form-group"><label>Security Password</label><input type="password" id="my-pass"></div>
            <div class="form-group"><label>Target Account Matrix</label><input type="text" id="target-name"></div>
            <div class="form-group"><label>Amount (Rs.)</label><input type="number" id="tx-amount"></div>
            <button class="btn" style="width:100%" id="btn-run-tx">Execute Deployment</button>
        </div>
    </div>
    <script>BANK_SCRIPT_PLACEHOLDER</script>
</body>
</html>
`;

// --- WEB 2 TEMPLATE: DOMAIN SYSTEM ---
const domainTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><title>NEXURA DOMAIN ACQUISITION</title>
    CORE_STYLE_TAG
</head>
<body>
    <div class="nav-bar">
        <a href="./index.html">🏦 Central Bank Terminal</a>
        <a href="./domain.html">🌐 Domain Black-Market</a>
    </div>
    <div class="container">
        <h1>NEXURA NOT-VALID DOMAIN EXCHANGE</h1>
        <div class="form-group"><label>Your Identity Name</label><input type="text" id="dom-user"></div>
        <div class="form-group"><label>Target Domain Name</label><input type="text" id="dom-name"></div>
        <div class="form-group"><label>Calculated Access Password</label><input type="text" id="dom-pass" placeholder="Username cipher + Domain cipher"></div>
        <div class="form-group"><label>Payout Destination Account Name</label><input type="text" id="payout-acc" placeholder="Name to receive Rs. 10,000"></div>
        <button class="btn btn-center" id="btn-sell-domain">Sell Domain & Mine Stars</button>
    </div>
    <script>DOMAIN_SCRIPT_PLACEHOLDER</script>
</body>
</html>
`;

function getBankEngineJS(db) {
    return `
    (function() {
        if(!localStorage.getItem('nexura_pa_ledger')) {
            localStorage.setItem('nexura_pa_ledger', JSON.stringify(${JSON.stringify(db)}));
        }
        let data = JSON.parse(localStorage.getItem('nexura_pa_ledger'));

        function ui() {
            const el = document.getElementById('accounts-list');
            if(!el) return;
            el.innerHTML = '';
            data.forEach(u => {
                el.innerHTML += \`
                    <div class="account-card">
                        <div class="name-details">\${u.username} 
                            <span class="level-badge">LVL \${u.level}</span>
                            <span class="stars-badge">\${'⭐'.repeat(u.stars || 0)}</span>
                        </div>
                        <div class="balance-amount">Rs. \${u.balance.toLocaleString()}</div>
                    </div>
                \`;
            });
        }

        const m = document.getElementById('tx-modal');
        if(document.getElementById('open-tx-modal')) {
            document.getElementById('open-tx-modal').onclick = () => m.style.display='flex';
        }

        if(document.getElementById('btn-run-tx')) {
            document.getElementById('btn-run-tx').onclick = () => {
                const sender = document.getElementById('my-name').value.trim();
                const pass = document.getElementById('my-pass').value;
                const rec = document.getElementById('target-name').value.trim();
                const amt = parseInt(document.getElementById('tx-amount').value);

                const sIdx = data.findIndex(x => x.username.toLowerCase() === sender.toLowerCase() && x.password === pass);
                const rIdx = data.findIndex(x => x.username.toLowerCase() === rec.toLowerCase());

                if(sIdx === -1) { alert("AUTHENTICATION CRASH: Invalid credentials."); return; }
                if(rIdx === -1) { alert("ERROR: Target account map not found."); return; }
                if(data[sIdx].balance < amt) { alert("TRANSACTION VOID: Insufficient funds. Balance lower than requested payload."); return; }

                data[sIdx].balance -= amt;
                data[rIdx].balance += amt;
                data[sIdx].txCount = (data[sIdx].txCount || 0) + 1;

                localStorage.setItem('nexura_pa_ledger', JSON.stringify(data));
                m.style.display='none';
                ui();
                triggerSync(data);
            };
        }

        function triggerSync(latestData) {
            alert("MATRIX VERIFIED! Downloading updated data block ledger file. Commit this to repository main root to process infinite markdown streams.");
            const s = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(latestData, null, 2));
            const a = document.createElement('a');
            a.setAttribute("href", s); a.setAttribute("download", "data.json");
            document.body.appendChild(a); a.click(); a.remove();
        }

        ui();
    })();
    `;
}

function getDomainEngineJS(db) {
    return `
    (function() {
        if(!localStorage.getItem('nexura_pa_ledger')) {
            localStorage.setItem('nexura_pa_ledger', JSON.stringify(${JSON.stringify(db)}));
        }
        let data = JSON.parse(localStorage.getItem('nexura_pa_ledger'));

        function generateCipher(str) {
            let out = "";
            let cleaned = str.toLowerCase().replace(/[^a-z]/g, '');
            for(let i=0; i<cleaned.length; i++) {
                out += (cleaned.charCodeAt(i) - 96).toString();
            }
            return out;
        }

        document.getElementById('btn-sell-domain').onclick = () => {
            const user = document.getElementById('dom-user').value.trim();
            const dom = document.getElementById('dom-name').value.trim();
            const pass = document.getElementById('dom-pass').value.trim();
            const payoutName = document.getElementById('payout-acc').value.trim();

            if(!user || !dom || !pass || !payoutName) { alert("Please complete all parameters."); return; }

            let userCipher = generateCipher(user);
            let domCipher = generateCipher(dom);
            let computedKey = userCipher + domCipher;

            if(pass !== computedKey) {
                alert("CIPHER SYSTEM REJECTED: Invalid password hash. Computed expected output key was: " + computedKey);
                return;
            }

            let pIdx = data.findIndex(x => x.username.toLowerCase() === payoutName.toLowerCase());
            if(pIdx === -1) { alert("Error: Target payout matrix profile does not exist."); return; }

            data[pIdx].balance += 10000;
            data[pIdx].stars = (data[pIdx].stars || 0) + 1;
            
            if(data[pIdx].stars >= 5) {
                data[pIdx].level += 1;
                data[pIdx].stars = 0;
                alert("CONGRATULATIONS! Level upgraded to Level " + data[pIdx].level);
            }

            data[pIdx].txCount = (data[pIdx].txCount || 0) + 1;
            localStorage.setItem('nexura_pa_ledger', JSON.stringify(data));

            alert("DOMAIN ACQUIRED! Rs. 10,000 sent to " + payoutName + ". Star cluster matrix upgraded! Downloading sequence build manifest...");
            
            const s = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const a = document.createElement('a');
            a.setAttribute("href", s); a.setAttribute("download", "data.json");
            document.body.appendChild(a); a.click(); a.remove();
        };
    })();
    `;
}

// --- COMPILE SCHEMATICS EXECUTION ---
try {
    const dataPath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataPath)) {
        console.error("Ledger component not found.");
        process.exit(1);
    }

    const currentLedger = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

    // 1. WEB 1 Build (index.html - Bank Interface)
    const rawBankJS = getBankEngineJS(currentLedger);
    const lockedBankJS = JavaScriptObfuscator.obfuscate(rawBankJS, { compact: true, controlFlowFlattening: true }).getObfuscatedCode();
    let bankHtml = bankTemplate.replace('CORE_STYLE_TAG', commonStyles).replace('BANK_SCRIPT_PLACEHOLDER', lockedBankJS);
    fs.writeFileSync(path.join(distPath, 'index.html'), bankHtml);

    // 2. WEB 2 Build (domain.html - Domain Market System)
    const rawDomJS = getDomainEngineJS(currentLedger);
    const lockedDomJS = JavaScriptObfuscator.obfuscate(rawDomJS, { compact: true, controlFlowFlattening: true }).getObfuscatedCode();
    let domHtml = domainTemplate.replace('CORE_STYLE_TAG', commonStyles).replace('DOMAIN_SCRIPT_PLACEHOLDER', lockedDomJS);
    fs.writeFileSync(path.join(distPath, 'domain.html'), domHtml);

    console.log("Both Applications compiled into live state cleanly.");

    // 3. INFINITE CASCADING SEQUENTIAL MARKDOWN COMPILER MAPS
    currentLedger.forEach(user => {
        const cleanName = user.username.replace(/\s+/g, '_');
        const count = user.txCount || 0;

        const mdFormat = `# NEXURA CORE SECURITY INDEX NODE FOR: ${user.username.toUpperCase()}
---
- **Account Label Identity:** ${user.username}
- **Current Crypto Net Worth Matrix:** Rs. ${user.balance.toLocaleString()}
- **Account Node Clearance Level:** Level ${user.level}
- **Network Validation Stars Matrix:** ${'⭐'.repeat(user.stars) || 'None'}
- **Current Transaction Sequence Index:** Sequence-${count}
- **Status Clearance:** ONLINE / VERIFIED / SECURE

*Document compiled dynamically inside the PA Network Infrastructure Architecture Engine.*
`;

        // Always create base structure map file
        fs.writeFileSync(path.join(distPath, `${cleanName}.md`), mdFormat);

        // Run continuous structural generation loops (OLIVIA1.md, OLIVIA2.md... without wiping history)
        for (let i = 1; i <= count; i++) {
            fs.writeFileSync(path.join(distPath, `${cleanName}${i}.md`), mdFormat);
        }

        if (count === 0) {
            fs.writeFileSync(path.join(distPath, `${cleanName}1.md`), mdFormat);
        }
    });

    console.log("Cascading infinite sequence markdown tracking structures compiled perfectly!");
} catch (err) {
    console.error("System Error encountered during compile block runtime: ", err);
    process.exit(1);
}
