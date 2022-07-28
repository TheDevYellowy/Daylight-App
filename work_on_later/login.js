const fs = require('fs');
const { userInfo } = require('node:os');
const { sep } = require('path');
const axios = require('axios').default;

window.addEventListener('DOMContentLoaded', async () => {
    const userAcc = userInfo().username;
    var x = [];
    var y = []
    var tokens = {};
    
    // Regex
    var token = /[A-Za-z\d]{24}\.[\w]{6}\.[\w]{27}/;
    var mfaToken = /mfa\.[w-]{84}/;

    // location
    let location;
    switch(process.platform) {
        case 'win32':
            location = `C:${sep}Users${sep}${userAcc}${sep}AppData${sep}Roaming`;
            break;
        case 'linux':
            location = `${sep}home${sep}${userAcc}${sep}.config`;
            break;
    }

    const getSortedFiles = (dir) => {
        var temp = [];
        dir.forEach(async d => {
            d += `${sep}Local Storage${sep}leveldb`;
            var exists = fs.existsSync(d);
            if(!exists) return null;

            let files = await fs.promises.readdir(d);
            files.forEach(f => {
                if(f.endsWith('.ldb')) {
                    temp.push(`${d}${sep}${f}`);
                } else if (f.endsWith('.log')) {
                    temp.push(`${d}${sep}${f}`);
                }else return;
            });
        });

        return temp;
    }

    var paths = [
        `${location}${sep}discord`,
        `${location}${sep}discordptb`,
        `${location}${sep}discordcanary`,
    ];

    x = getSortedFiles(paths);

    
    x.forEach(async f => {
        fs.readFile(f, function(err, data) {
            if(err) return console.error(err);
            data = data.toString();

            if(token.test(data)) {
                let z = token.exec(data)[0];
                // if(token.test(z)) if (!y.includes(z)) y.push(z);
                if(token.test(z)) if (y.indexOf(z) === -1) y.push(z);
            } else if(mfaToken.test(data)) {
                let z = mfaToken.exec(data)[0];
                // if(mfaToken.test(z)) if (!y.includes(z)) y.push(z)
                if(mfaToken.test(z)) if (y.indexOf(z) === -1) y.push(z);
            }
        });
    });

    y.forEach(async t => {
        await axios.get('https://discord.com/api/v7/users/@me', {
            headers: {
                "Content-Type": "application/json",
                "authorization": t,
            }
        }).then(async (res) => {
            const data = res.data;
            tokens[data.username] = t;


            const table = document.getElementById('accounts');
            const tr = document.createElement('tr');
            const username = document.createElement('td');
            username.innerText = `${data.username}#${data.descriminator}`;
            const button = tr.appendChild(document.createElement('button'));
            button.id = `${data.username}`;
            button.innerText = 'Login'
            table.appendChild(tr);

            document.getElementById(data.username).addEventListener('click', (ev) => {
                alert(ev.srcElement.id);
            })
        }).catch(e => {
            if(e.toString().includes('401')) return;
            else console.error(e);
        })
    })
});