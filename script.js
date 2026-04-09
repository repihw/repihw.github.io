const input = document.getElementById('command-input');
const output = document.getElementById('output');
const inputLine = document.getElementById('input-line');

let isReady = false;
let waiting = false;
let survey = false;
let step = 0;
let userCountry = "Mexico";
let userCity = "Unknown";
let userISP = "Unknown";

// Función para el efecto de escritura
function print(text, color, callback) {
    const div = document.createElement('div');
    if (color) div.className = color;
    output.appendChild(div);
    let i = 0;
    const timer = setInterval(() => {
        div.innerText += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) callback();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, 20);
}

// Secuencia de inicio (Boot)
window.onload = () => {
    setTimeout(() => {
        print("Loading files...", "", () => {
            setTimeout(() => {
                print("CRITICAL: Some files are missing!", "yellow", () => {
                    setTimeout(() => {
                        print("¿Continue? [Y/N]", "yellow", () => {
                            inputLine.style.display = "flex";
                            input.focus();
                            waiting = true;
                        });
                    }, 400);
                });
            }, 600);
        });
    }, 500);
};

input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        const cmd = val.toLowerCase();
        input.value = '';

        const echo = document.createElement('div');
        echo.innerText = `$ : ${val}`;
        output.appendChild(echo);

        // --- LÓGICA DE INICIO Y/N ---
        if (waiting) {
            if (cmd === 'y') {
                waiting = false;
                print("Welcome to repihw 1.2.2!\nUnauthorized access is monitored.\nType 'help' for commands.", "green", () => {
                    isReady = true;
                });
            } else if (cmd === 'n') {
                waiting = false;
                print("ABORTING SYSTEM. WIPING LOCAL TRACES...", "red", () => {
                    setTimeout(() => { document.body.innerHTML = ""; }, 1000);
                });
            }
            return;
        }

        // --- LÓGICA DE LA ENCUESTA (DO_NOT_EXECUTE) ---
        if (survey) {
            if (step === 1) {
                if (cmd === 'y') {
                    step = 2;
                    print(`\nCorrect. Metadata matches.\nAre you alone in the room right now? [Y/N]`, "white");
                } else {
                    survey = false;
                    print(`\nYOU ARE LYING TO ME!`, "red", () => {
                        print(`I can see your reflection on the screen, ${userCountry} resident.\nI'm already inside your network.`, "red");
                    });
                }
            } else if (step === 2) {
                print(`\nI can hear your breathing through the microphone.\nCONNECTION PERMANENTLY LOGGED.`, "red", () => {
                    setTimeout(() => { document.body.innerHTML = ""; }, 3000);
                });
                survey = false;
            }
            return;
        }

        // --- COMANDOS DEL SISTEMA ---
        if (isReady) {
            if (cmd === 'ls') {
                print("HFP.bin  readme.txt  do_not_execute_me.bin  do_not_read_me.txt  usr/  logs/", "white");
            } 
            else if (cmd === 'help') {
                print("Available commands:\nls - List files\ncat [file] - Read file content\nwhoami -  View current user\n./[file] - Execute binary\nsysinfo - System status\nclear - Clear terminal", "green");
            }
            else if (cmd === 'cat do_not_read_me.txt') {
                print("The relentless march of time is bringing you closer to certain death, which will lead to total oblivion in a couple of generations; no one will remember you in a few years, and all the effort you're making now will have been for nothing.", "red");
            }
            else if (cmd === 'cat readme.txt') {
                print("This system was not meant to be found. Every command you type leaves a biological footprint in our database.", "white");
            }
            else if (cmd === './do_not_execute_me.bin') {
                print("INITIALIZING BIOMETRIC SCAN...", "yellow", async () => {
                    try {
                        const res = await fetch('https://ipapi.co/json/');
                        const data = await res.json();
                        userCountry = data.country_name || "Mexico";
                        userCity = data.city || "Unknown";
                    } catch (e) {
                        console.log("Trace fallback active.");
                    }
                    print(`\nScan complete.\nLocation: ${userCountry}, ${userCity}\n\nDo you reside here? [Y/N]`, "white", () => {
                        survey = true;
                        step = 1;
                    });
                });
            }
            else if (cmd === 'whoami') {
                print("INITIALIZING DEEP TRACE...", "yellow", async () => {
                    try {
                        const res = await fetch('https://ipapi.co/json/');
                        const data = await res.json();
                        print(`\n[TARGET ANALYZED]`, "red");
                        print(`IP: ${data.ip}`, "red");
                        print(`CITY: ${data.city}`, "red");
                        print(`REGION: ${data.region}`, "red");
                        print(`ISP: ${data.org}`, "red");
                        print(`\nI HAVE ESTABLISHED A BACKDOOR TO YOUR ROUTER.\nDO NOT TURN OFF YOUR DEVICE.`, "red");
                    } catch (e) {
                        print("\nERROR: Connection encrypted. But I can hear you breathing.", "red");
                    }
                });
            }
            else if (cmd === 'sysinfo') {
                print("OS: repihw 1.2.2\nStatus: Corrupted / Decaying\nUser: Subject_4412 (Under Watch)\nMemory: 0MB Free", "white");
            }
            else if (cmd === 'clear') {
                output.innerHTML = "";
            }
            else {
                print(`repihw: unknown command: ${cmd}`, "white");
            }
        }
    }
});
