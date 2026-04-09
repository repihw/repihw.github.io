const input = document.getElementById('command-input');
const output = document.getElementById('output');
const inputLine = document.getElementById('input-line');

let isSystemReady = false; 
let waitingForChoice = false;
let isSurveyActive = false;
let surveyStep = 0;
let userCountry = "Unknown";
let cmdHistory = [];

function typeText(target, text, className, callback) {
    let i = 0;
    const div = document.createElement('div');
    if (className) div.className = className;
    target.appendChild(div);

    const interval = setInterval(() => {
        div.innerText += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, 25);
}

function boot() {
    // Pequeño delay inicial para que no se sienta instantáneo
    setTimeout(() => {
        typeText(output, "Loading files...", "white", () => {
            setTimeout(() => {
                typeText(output, "CRITICAL: Some files are missing!", "yellow", () => {
                    setTimeout(() => {
                        typeText(output, "Proceed with recovery? [Y/N]", "yellow", () => {
                            inputLine.style.display = "flex";
                            input.focus();
                            waitingForChoice = true;
                        });
                    }, 500);
                });
            }, 800);
        });
    }, 500);
}

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const fullCommand = input.value.trim();
        const cmd = fullCommand.toLowerCase();
        input.value = '';

        if (fullCommand !== "") cmdHistory.push(fullCommand);

        const echo = document.createElement('div');
        echo.innerText = `$ : ${fullCommand}`;
        output.appendChild(echo);

        if (waitingForChoice) {
            if (cmd === 'y') {
                waitingForChoice = false;
                typeText(output, "Welcome to repihw 1.2.2!\nMonitoring initialized.\nType \"help\" for unauthorized commands.", "green", () => {
                    isSystemReady = true;
                });
            } else if (cmd === 'n') {
                waitingForChoice = false;
                typeText(output, "SYSTEM ABORTED. WIPING LOCAL TRACES...", "red", () => {
                    setTimeout(() => { document.body.innerHTML = ""; }, 1000);
                });
            }
            return;
        }

        if (isSurveyActive) {
            if (surveyStep === 1) {
                if (cmd === 'y') {
                    surveyStep = 2;
                    typeText(output, `\nCorrect. Metadata matches.\nNext: Are you alone in the room right now? [Y/N]`, "white");
                } else {
                    isSurveyActive = false;
                    typeText(output, `\nYOU ARE LYING TO ME!`, "red glitch", () => {
                        setTimeout(() => {
                            typeText(output, `I can see your reflection, ${userCountry} citizen.\nDon't look back.`, "red");
                        }, 1000);
                    });
                }
            } else if (surveyStep === 2) {
                typeText(output, `\nI can hear your breathing through the microphone.\n\nCONNECTION PERMANENTLY LOGGED.`, "red", () => {
                    setTimeout(() => { document.body.innerHTML = ""; }, 3000);
                });
                isSurveyActive = false;
            }
            return;
        }

        if (isSystemReady) {
            if (cmd === 'ls') {
                typeText(output, "HFP.bin   readme.txt   do_not_execute_me.bin   do_not_read_me.txt   logs/   usr/", "white");
            } 
            else if (cmd === 'help') {
                typeText(output, "Commands: ls, cat, whoami, clear, sysinfo, scan, history, ./[file]", "blue");
            }
            else if (cmd === 'cat do_not_read_me.txt') {
                typeText(output, "The relentless march of time is bringing you closer to certain death, which will lead to total oblivion in a couple of generations; no one will remember you in a few years, and all the effort you're making now will have been for nothing.", "red");
            }
            else if (cmd === './do_not_execute_me.bin') {
                typeText(output, "INITIALIZING BIOMETRIC SCAN...", "yellow", async () => {
                    try {
                        const res = await fetch('https://ipapi.co/json/');
                        const data = await res.json();
                        userCountry = data.country_name;
                        typeText(output, `\nScan complete.\nLocation: ${userCountry}\n\nDo you reside in ${userCountry}? [Y/N]`, "white", () => {
                            isSurveyActive = true;
                            surveyStep = 1;
                        });
                    } catch {
                        typeText(output, "ERROR: Proxy detected. I'll find you anyway.", "red");
                    }
                });
            }
            else if (cmd === 'whoami') {
                typeText(output, "TRACE ROUTE STARTING...", "yellow", async () => {
                    try {
                        const res = await fetch('https://api.ipify.org?format=json');
                        const data = await res.json();
                        typeText(output, `\n[TARGET FOUND]\nIP: ${data.ip}\nYour data is now mine.\nI am watching you.`, "red glitch");
                    } catch {
                        typeText(output, "ERROR: Trace failed. But I'm already in your system.", "red");
                    }
                });
            }
            else if (cmd === 'clear') { output.innerHTML = ""; }
            else if (cmd === 'sysinfo') { typeText(output, "OS: repihw 1.2.2\nCPU: Brainwaves Detected\nStatus: DEPRESSION_ALV", "white"); }
            else if (cmd === 'history') { typeText(output, "Commands recorded:\n" + cmdHistory.join('\n'), "white"); }
            else { typeText(output, `repihw: unknown command: ${cmd}`, "white"); }
        }
    }
});

window.onload = boot;
