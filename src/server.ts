import express, { Router } from 'express';
import { Server as ServerHttp, createServer } from 'http';
import cors from 'cors';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class ServerClass {
  // Aplicación de express
  public readonly app = express()

  //Puerto
  private readonly port: number;

  //Instancia del servidor
  private readonly server: ServerHttp;

  //Rutas para los endpoints
  private readonly routes: Router;

  constructor (options: Options) {
    const { port, routes } = options;

    //Se configura la información según las configuraciones enviadas al crear la instancia de la clase
    this.port = port;
    this.routes = routes;
    this.server = createServer( this.app );
  }

  /**
  * Configuración de middlewares, rutas y cors.
  */
  private Configure () {
    this.app.use('/api/membership/webhook', express.raw({ type: 'application/json' }));

    //* Middlewares
    this.app.use( express.json() );
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    //CORS
    this.app.use(cors());

    //* Routes
    this.app.use( this.routes );
  }

  /**
   * Configura las rutas del servidor
   * @param router Router principal
   */
  public setRoutes ( router: Router ) {
    this.app.use(router);
  }

  /**
   * Función para ejecutar las configuraciones necesarias para el servidor
   */
  execute () {
    //Configuraciones iniciales
    this.Configure();

    //Inicializar servidor
    this.server.listen( this.port, () => {
      console.log(`[INFO] Server running in port ${this.port}`);
    })
  }
}