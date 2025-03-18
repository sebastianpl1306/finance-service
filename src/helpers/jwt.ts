import { sign } from 'jsonwebtoken';
import { envs } from '../config';
import { AuthenticationRoles, InfoTokenSave } from '../interfaces';

export const generateJWT = ( uid: string, role: AuthenticationRoles ) => {
  return new Promise( (resolve, reject) => {
    const payload: InfoTokenSave = { uid, role };
    sign( payload, envs.SECRET_JWT, {
      expiresIn: '12h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('No se pudo generar el token');
      }

      resolve( token );
    });
  })
}