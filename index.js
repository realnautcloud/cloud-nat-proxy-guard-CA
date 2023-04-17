const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function run() {
    try {
      const task = core.getInput('peer');
      const config = core.getInput('config');
      
      if (task === 'install') {
        
        console.log('Descargando e instalando WireGuard...');
        await exec('sudo apt-get update && sudo apt-get install -y wireguard');
        console.log('WireGuard instalado.');

      } else if (task === 'start') {

        console.log('Decodificando y escribiendo configuración...');
        const configStr = Buffer.from(config, 'base64').toString();
        const configPath = path.join(process.env.RUNNER_TEMP, 'peer.conf');
        fs.writeFileSync(configPath, configStr);
        console.log('Ejecutando WireGuard con la configuración proporcionada...');
        await exec(`sudo wg-quick up ${configPath}`);
        console.log('WireGuard iniciado.');

      } else if (task === 'stop') {
        
        console.log('Deteniendo WireGuard...');
        await exec('sudo wg-quick down');
        console.log('WireGuard detenido.');

      } else {
        console.log(`Tarea no válida: ${task}`);
      }
      
    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();


