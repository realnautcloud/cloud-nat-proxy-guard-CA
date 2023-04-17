const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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
        const configPath = '/etc/wireguard/peer.conf';
        fs.writeFile(configPath, configStr, (err) => {
          if (err) {
            console.error(`Error al escribir archivo de configuración: ${err}`);
          } else {
            console.log(`Archivo de configuración creado en ${configPath}`);
          }
        });
        console.log(`Ejecutando WireGuard con la configuración proporcionada...${configPath}`);

        try {
          await exec(`sudo wg-quick up peer`);
          console.log('WireGuard iniciado correctamente');
        } 
        catch (error) {
          console.error(`Error al iniciar WireGuard: ${error}`);
        }

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


