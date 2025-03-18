import { Request } from 'express';
import { AuthenticationRoles } from './User.interface';

export interface InfoTokenSave {
  uid: string;
  role: AuthenticationRoles;
}

export interface InfoTokenWithRequest extends Request, InfoTokenSave {}