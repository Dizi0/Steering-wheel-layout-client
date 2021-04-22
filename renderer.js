// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// Dans le processus de rendu (page web).

// Network interfaces
let port = ":8080"
let fulladdr = ""
let address,
    ifaces = require('os').networkInterfaces();
for (const dev in ifaces) {
    ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
}
shortaddress = address.replace("192.168.", "");
fulladdr = "http://"+ address + port
// Print the result
console.log(fulladdr)

const http = require("http")
document.getElementById('localip').innerText += " " +  shortaddress
document.getElementById('id').innerText += " " +  shortaddress

http.get(fulladdr+"?connection=Success", res => {
    setTimeout(() => {}, 500);
})

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
                    http.get(fulladdr+"?device="+gamepad.id, res => {
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
                        http.get(fulladdr+"?"+ mappingAxis[index] + '=' + axis, res => {
                            setTimeout(() => {}, 500);
                        })
                    }
                }
                for (const [index, button] of gamepad.buttons.entries()) {
                    http.get(fulladdr+"?"+ buttonMapping[index] + '=' + button.value, res => {
                        setTimeout(() => {}, 500);
                    })
                }
            }
            if(gamepad.id.includes('G29')){
                if(configLoaded === false){
                    http.get(fulladdr+"?device="+gamepad.id, res => {
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
                        http.get(fulladdr+"?"+ mappingAxis[index] + '=' + axis, res => {
                            setTimeout(() => {}, 500);
                        })
                    }
                }
                for (const [index, button] of gamepad.buttons.entries()) {
                    http.get(fulladdr+"?"+ buttonMapping[index] + '=' + button.value ? 'on' : 'off', res => {
                        setTimeout(() => {}, 500);
                    })
                }
            }
        }
        requestAnimationFrame(update);
    };
    update();
})

