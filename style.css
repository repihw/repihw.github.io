@font-face {
    font-family: 'TerminalPixel';
    src: url('https://db.onlinewebfonts.com/t/2c4b57a53f06484fb12d5d886981442c.woff2') format('woff2');
}

body {
    background-color: #000000;
    color: #ffffff;
    font-family: 'TerminalPixel', 'Courier New', monospace;
    font-size: 1.2rem;
    margin: 0;
    padding: 20px;
    overflow-x: hidden;
    -webkit-font-smoothing: none;
}

/* Efecto de línea de escaneo vieja */
.scanline {
    width: 100%; height: 2px;
    background: rgba(255, 255, 255, 0.05);
    position: fixed; top: 0; left: 0;
    z-index: 10; pointer-events: none;
    animation: scan 4s linear infinite;
}

@keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
}

#output div { margin-bottom: 8px; white-space: pre-wrap; line-height: 1.4; }
.yellow { color: #ffff00; }
.green { color: #00ff00; }
.red { color: #ff0000; text-shadow: 0 0 8px #ff0000; }
.blue { color: #00ccff; }

#input-line { display: flex; align-items: center; margin-top: 10px; }
.prompt { color: #ffffff; margin-right: 10px; }
#command-input {
    background: transparent; border: none; color: #ffffff;
    font-family: 'TerminalPixel', monospace; font-size: 1.2rem;
    outline: none; flex-grow: 1;
}

/* Animación de parpadeo de error */
.glitch { animation: glitch-anim 0.2s infinite; }
@keyframes glitch-anim {
    0% { transform: translate(0); }
    50% { transform: translate(-2px, 1px); color: #ff0000; }
    100% { transform: translate(2px, -1px); }
}
