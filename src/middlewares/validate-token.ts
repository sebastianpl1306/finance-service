import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../config';
import { AuthenticationRoles, InfoTokenSave, InfoTokenWithRequest } from '../interfaces';

export const validateJWT = (request: any, response: Response, next: NextFunction) => {
  const token = request.header('x-token');
  if (!token) {
    return response.status(401).json({
      ok: 'false',
      msg: 'No hay token en la petición'
    })
  }

  try {
    const { uid, role }: InfoTokenWithRequest = jwt.verify(
      token,
      envs.SECRET_JWT
    ) as InfoTokenWithRequest;

    const tokenInfo: InfoTokenSave = { uid, role }
    request.body.tokenInfo = tokenInfo;
  } catch (error) {
    return response.status(401).json({
      ok: 'false',
      msg: 'Token invalido!'
    })
  }

  next();
}

export const validateJWTAdmin = (request: any, response: Response, next: NextFunction) => {
  const token = request.header('x-token');
  if (!token) {
    return response.status(401).json({
      ok: 'false',
      msg: 'No hay token en la petición'
    })
  }

  try {
    const { uid, role }: InfoTokenWithRequest = jwt.verify(
      token,
      envs.SECRET_JWT
    ) as InfoTokenWithRequest;

    if (role !== AuthenticationRoles.ADMIN) {
      return response.status(401).json({
        ok: 'false',
        msg: 'Unauthorized'
      })
    }

    const tokenInfo: InfoTokenSave = {
      uid,
      role
    }
    request.body.tokenInfo = tokenInfo;
  } catch (error) {
    console.log(error);
    return response.status(401).json({
      ok: 'false',
      msg: 'Token invalido!'
    })
  }

  next();
}

export const validateJWTCustomer = (request: any, response: Response, next: NextFunction) => {
  const token = request.header('x-token');
  if (!token) {
    return response.status(401).json({
      ok: 'false',
      msg: 'No hay token en la petición'
    })
  }

  try {
    const { uid, role }: InfoTokenWithRequest = jwt.verify(
      token,
      envs.SECRET_JWT
    ) as InfoTokenWithRequest;

    if (role !== AuthenticationRoles.CUSTOMER) {
      return response.status(401).json({
        ok: 'false',
        msg: 'Unauthorized'
      })
    }

    const tokenInfo: InfoTokenSave = {
      uid,
      role
    }
    request.body.tokenInfo = tokenInfo;
  } catch (error) {
    return response.status(401).json({
      ok: 'false',
      msg: 'Token invalido!'
    })
  }

  next();
}