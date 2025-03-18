import { envs } from './config';
import { connectionDB } from './database';
import { router } from './router';
import { ServerClass } from './server';

//Configuración de base de datos
connectionDB( envs.CONNECTION_STRING );

//Creación y configuración del servidor
const server = new ServerClass({
  port: envs.PORT,
  routes: router
});

//Se ejecuta el servidor
server.execute();