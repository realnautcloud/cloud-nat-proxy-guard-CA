/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 916:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 48:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(916);
const github = __nccwpck_require__(48);

const fs = __nccwpck_require__(147);
const path = __nccwpck_require__(17);
const { exec } = __nccwpck_require__(81);

async function run() {
    try {
      const taskParam = core.getInput('action');
      const peerParam = core.getInput('peer');
      
      if (taskParam === 'start') {
        
        console.log('Descargando e instalando WireGuard...');
        await exec('sudo apt-get update && sudo apt-get install -y wireguard');
        console.log('WireGuard instalado.');

        console.log('Decodificando y escribiendo configuración...');
        const configStr = Buffer.from(peerParam, 'base64').toString();
        console.log(configStr)
        const configPath = path.join(process.env.RUNNER_TEMP, 'peer.conf');
        fs.writeFileSync(configPath, configStr);
        console.log('Ejecutando WireGuard con la configuración proporcionada...');
        await exec(`sudo wg-quick up ${configPath}`);
        console.log('WireGuard iniciado.');

      } else if (taskParam === 'stop') {
        
        console.log('Deteniendo WireGuard...');
        await exec('sudo wg-quick down');
        console.log('WireGuard detenido.');

      } else {
        console.log(`Tarea no válida: ${taskParam}`);
      }
      
    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();



})();

module.exports = __webpack_exports__;
/******/ })()
;