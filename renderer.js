// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// Dans le processus de rendu (page web).

// Network interfaces
const prompt = require('electron-prompt');
const http = require("http")

let ip = "";
let port = ":443"


prompt({
    title: 'Insert the client ID',
    label: "Client ID (It's on the other window's name)",
    icon : 'assets/imgs/nohitcombologo.jpg',
    value: '0.0',
    height : 200,
    inputAttrs: {
        type: 'text'
    },
    type: 'input'
})
    .then((r) => {

        if (r === null) {
            console.log('user cancelled');
        } else {
            ip = "http://192.168." + r + port
            console.log(ip)
            http.get(ip+"?connection=Success", res => {
                setTimeout(() => {}, 500);
            })
        }
    })
    .catch(console.error);

// Print the result

const mappingAxis = ['Wheel', 'Accelerator', 'Brake', 'Unknown', 'Unknown', 'Clutch', 'Unknown', 'Unknown', 'Unknown', 'D_pad']
let buttonMapping = []

let configLoaded = false;

window.addEventListener('gamepadconnected', (event) => {
    const update = () => {
        for (const gamepad of navigator.getGamepads()) {
            if (!gamepad) continue;

            if(gamepad.id.includes('G920')){
                document.getElementById("device").innerText= gamepad.id
                if(configLoaded === false){
                    http.get(ip+"?device="+gamepad.id, res => {
                        setTimeout(() => {}, 500);
                    })

                    buttonMapping = [
                        "A",
                        "B",
                        "X",
                        "Y",
                        "V_Plus",
                        "V_Minus",
                        "START",
                        "SELECT",
                        "RSB",
                        "LSB",
                        "HOME",
                        "R",
                        "6th_Gear",
                        "5th_Gear",
                        "4th_Gear",
                        "3rd_Gear",
                        "2nd_Gear",
                        "1st_Gear"
                    ]
                    configLoaded = true
                    console.log("Config Loaded for : " +gamepad.id)
                }
                for (const [index, axis] of gamepad.axes.entries()) {
                    if(mappingAxis[index] !== 'Unknown'){
                        http.get(ip+"?"+ mappingAxis[index] + '=' + axis, res => {
                            setTimeout(() => {}, 500);
                        })
                    }
                }
                for (const [index, button] of gamepad.buttons.entries()) {
                    http.get(ip+"?"+ buttonMapping[index] + '=' + button.value, res => {
                        setTimeout(() => {}, 500);
                    })
                }
            }
            if(gamepad.id.includes('G29')){
                if(configLoaded === false){
                    http.get(ip+"?device="+gamepad.id, res => {
                        setTimeout(() => {}, 500);
                    })

                    buttonMapping = [
                        "⨯",
                        "□",
                        "○",
                        "△",
                        "V+",
                        "V-",
                        "R2",
                        "L2",
                        "SHARE",
                        "OPTION",
                        "R3",
                        "L3",
                        "6th Gear",
                        "5th Gear",
                        "4th Gear",
                        "3rd Gear",
                        "2nd Gear",
                        "1st Gear",
                        "",
                        "Plus",
                        "Minus",
                        "Mol.Droite",
                        "Mol.Gauche"
                    ]
                    configLoaded = true
                    console.log("Config Loaded for : " +gamepad.id)
                }
                for (const [index, axis] of gamepad.axes.entries()) {
                    if(mappingAxis[index] !== 'Unknown'){
                        http.get(ip+"?"+ mappingAxis[index] + '=' + axis, res => {
                            setTimeout(() => {}, 500);
                        })
                    }
                }
                for (const [index, button] of gamepad.buttons.entries()) {
                    http.get(ip+"?"+ buttonMapping[index] + '=' + button.value ? 'on' : 'off', res => {
                        setTimeout(() => {}, 500);
                    })
                }
            }
        }
        requestAnimationFrame(update);
    };
    update();
})

