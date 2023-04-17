const core = require('@actions/core');
const github = require('@actions/github');

const { exec } = require('@actions/exec');



const fs = require('fs');
const path = require('path');
//const { exec } = require('child_process');


async function run() {
    try {
      const taskParam = core.getInput('action');
      const peerParam = core.getInput('peer');

      console.log('Decodificando y escribiendo configuración...');
      const configStr = Buffer.from(peerParam, 'base64').toString();
      console.log(configStr)
      const configPath = path.join(process.env.RUNNER_TEMP, 'peer.conf');
      
      if (taskParam === 'start') {
        
        console.log('Descargando e instalando WireGuard...');
        await exec('sudo apt-get update');
        await exec('sudo apt-get install -y openresolv');
        await exec('sudo apt-get install -y resolvconf');
        await exec('sudo apt-get install -y wireguard');
        console.log('WireGuard instalado.')

        
        fs.writeFileSync(configPath, configStr);
        console.log(`Ejecutando WireGuard con la configuración proporcionada...${configPath}`);

        try {
          console.log(`sudo wg-quick up ${configPath}`);
          await exec(`sudo wg-quick up ${configPath}`);
          console.log('WireGuard iniciado correctamente');
        } 
        catch (error) {
          console.error(`Error al iniciar WireGuard: ${error}`);
        }

      } else if (taskParam === 'stop') {
        
        console.log('Deteniendo WireGuard...');
        await exec(`sudo wg-quick down ${configPath}`);
        console.log('WireGuard detenido.');

      } else {
        console.log(`Tarea no válida: ${taskParam}`);
      }
      
    } catch (error) {
      core.setFailed(error.message);
    }
  }
  
  run();


