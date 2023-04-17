require = require('esm')(module /*, options*/);

const execa = require('execa');

const core = require('@actions/core');
const github = require('@actions/github');



const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

//async function runCommand(command) {
//  const { stdout, stderr } = await exec(command, {stdio: "inherit"});
//  console.log('stdout:', stdout);
//  console.error('stderr:', stderr);
//}


async function runCommand(command) {
  try {
    const { stdout, stderr, exitCode } = await execa.command(command);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
    if (exitCode === 0) {
      console.log('WireGuard se ha iniciado correctamente');
    } else {
      console.error(`WireGuard no se ha iniciado correctamente. Código de salida: ${exitCode}`);
    }
  } catch (error) {
    console.error(`Error al ejecutar el comando: ${error}`);
  }
}

async function run() {
    try {
      const taskParam = core.getInput('action');
      const peerParam = core.getInput('peer');
      
      if (taskParam === 'start') {
        
        console.log('Descargando e instalando WireGuard...');
        await runCommand('sudo apt-get update && sudo apt-get install -y wireguard');
        console.log('WireGuard instalado.');

        console.log('Decodificando y escribiendo configuración...');
        const configStr = Buffer.from(peerParam, 'base64').toString();
        console.log(configStr)
        const configPath = path.join(process.env.RUNNER_TEMP, 'peer.conf');
        fs.writeFileSync(configPath, configStr);
        console.log(`Ejecutando WireGuard con la configuración proporcionada...${configPath}`);

        try {
          console.log(`sudo wg-quick up ${configPath}`);
          await runCommand(`sudo wg-quick up ${configPath}`);
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


