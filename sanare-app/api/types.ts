import { Request } from 'express';

export interface KeycloakRequest extends Request {
  kauth?: any;
}
