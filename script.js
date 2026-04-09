const input = document.getElementById('command-input');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

// --- DATOS DEL SISTEMA ---
const systemFiles = {
    "manifest.txt": { type: 'text', content: "SYSTEM_MANIFESTv1.2.2\nAUTH: [REDACTED]\nSTATUS: DECAY" },
    "usr": { type: 'dir', content: ["personal", "notes"] },
    "logs": { type: 'dir', content: ["system.log", "network.log"] },
    "bin": { type: 'dir', content: ["whoami", "ls", "cat", "echo"] }
};

let currentDir = systemFiles;

// --- CONFIGURACIÓN DE ANIMACIÓN ---
const typeSpeed = 25; // ms por caracter

function typeText(targetElement, text, className) {
    let i = 0;
    const interval = setInterval(() => {
        targetElement.innerText += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, typeSpeed);
    if (className) targetElement.classList.add(className);
}

// --- SECUENCIA DE BOOT (Como en la captura) ---
function runBootSequence() {
    const lines = [
        { text: "Loading files...", class: "white" },
        { text: "Some files are missing!", class: "yellow" },
        { text: "¿Continue? [Y/N]", class: "yellow" }
    ];

    let lineIndex = 0;
    function typeNextLine() {
        if (lineIndex < lines.length) {
            const newLine = document.createElement('div');
            output.appendChild(newLine);
            typeText(newLine, lines[lineIndex].text, lines[lineIndex].class);
            lineIndex++;
            
            // Espera a que termine la animación antes de la siguiente línea
            setTimeout(typeNextLine, (lines[lineIndex-1].text.length * typeSpeed) + 300);
        } else {
            // Cuando termina la secuencia, mostramos el prompt para el primer 'Y'
            document.getElementById('input-line').style.display = 'flex';
        }
    }
    
    // Ocultamos el input durante el boot
    document.getElementById('input-line').style.display = 'none';
    typeNextLine();
}

// --- LÓGICA DE COMANDOS (20+) ---
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fullCommand = input.value.trim();
        input.value = ''; // Limpiamos el input

        // Si es el primer comando ('Y')
        if (fullCommand.toUpperCase() === 'Y' && output.innerText.includes('Continue?')) {
            const newLineY = document.createElement('div');
            newLineY.innerText = "$ : Y";
            output.appendChild(newLineY);
            
            setTimeout(() => {
                const welcomeLine = document.createElement('div');
                output.appendChild(welcomeLine);
                typeText(welcomeLine, "Welcome to repihw 1.2.2!\nType \"help\" for a list of commands", "green");
            }, 500);
            return;
        }

        // Lógica de comandos normal
        const commandLine = document.createElement('div');
        commandLine.innerText = `$ : ${fullCommand}`;
        output.appendChild(commandLine);

        const command = fullCommand.toLowerCase();
        const responseLine = document.createElement('div');
        output.appendChild(responseLine);

        // --- SISTEMA DE COMANDOS ---
        let responseText = "";
        let responseClass = "";

        if (command === 'help') {
            responseText = `Available Commands:
help, ls, cat, whoami, pwd,
cd, clear, echo, date, uname,
history, sysinfo, network, logs, ps,
scan, recover, decrypt, destroy, [CLASSIFIED]`;
        } else if (command === 'ls') {
            const fileList = Object.keys(currentDir).join('   ');
            responseText = fileList;
        } else if (command === 'whoami') {
            responseClass = "red";
            responseText = `IDENTIDAD LOCALIZADA: (Obteniendo IP local...)\nESTADO: OBSERVADO.\nTus coordenadas están siendo transmitidas.`;
            // Puedes añadir aquí el fetch de la IP real local, pero dijiste que solo simule, así que esto está bien.
        } else if (command.startsWith('cat ')) {
            const filename = fullCommand.split(' ')[1];
            if (filename && currentDir[filename] && currentDir[filename].type === 'text') {
                responseText = currentDir[filename].content;
            } else {
                responseText = `ERROR: No se puede leer '${filename}' (acceso denegado)`;
            }
        } else if (command === 'pwd') {
            responseText = "/usr/personal/core_decay";
        } else if (command.startsWith('echo ')) {
            responseText = fullCommand.substring(5);
        } else if (command === 'clear') {
            output.innerHTML = "";
            return;
        } else if (command === 'date') {
            responseText = new Date().toLocaleString() + "\n(El tiempo se acaba)";
        } else if (command === 'uname') {
            responseText = "repihw 1.2.2-core-decay [CLASSIFIED]";
        } else if (command === 'sysinfo') {
            responseText = `OS: repihw 1.2.2\nUptime: ${Math.floor(Math.random()*100)} hours\nMemory: 99% (Corrupted)\nStorage: 0.1KB free`;
        } else if (command === 'network') {
            responseClass = "yellow";
            responseText = `[NETWORK STATUS]\nLocal connections: 1 (ACTIVA)\nInbound Packets: ERROR\nOutbound Packets: TRANSMITIENDO DATOS PERSONALES...`;
        } else if (command === 'logs') {
            responseText = `12:31 - System decay detected.\n12:32 - Integrity check failed.\n12:33 - External viewer confirmed.\n12:34 - USER LOCALIZED.`;
        } else if (command === 'ps') {
            responseText = `PID | COMMAND | STATUS\n1   | core      | DECAY\n25  | watcher   | ACTIVO\n133 | tracking  | TRANSMITIENDO`;
        } else if (command === 'scan') {
            responseText = "Escaneando archivos corruptos... (5%)\n(Esto tardará)\nERROR CRÍTICO: El sistema está escuchando.";
        } else if (command === 'recover') {
            responseText = "Intento de recuperación fallido. Los datos están marcados para destrucción biológica.";
        } else if (command === 'decrypt') {
            responseText = "ERROR: Clave de descifrado requerida: [CLASSIFIED]";
        } else if (command === 'destroy') {
            responseText = "CONFIRME DESTRUCCIÓN: [Y/N]\n(AVISO: Esto incluye los metadatos de su red)";
        } else if (command === '[classified]') {
            responseClass = "red";
            responseText = "ERROR: Tu nivel de acceso no es suficiente. Ellos ya saben que intentaste entrar aquí.";
        } else if (command === 'history') {
            responseText = "$: help\n$: whoami\n$: cat manifest.txt\n$: cat notes/DECAY.log";
        } else if (command === 'cd notes' || command === 'cd ..') {
             responseText = "ERROR: No puedes cambiar de directorio. Estás atrapado en este nodo.";
        } else if (command === '') {
            responseText = "";
        } else {
            responseText = `repihw: command not found: ${command}. ¿Es tu fin?`;
        }

        // Aplicamos la animación de escritura
        typeText(responseLine, responseText, responseClass);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

// Iniciamos la secuencia de booteo al cargar
window.onload = runBootSequence;
