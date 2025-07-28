import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { App } from '../../domain/app';
import { ControllerExceptionFilter } from './controllerException.filter';

@UseFilters(new ControllerExceptionFilter())
@Injectable()
export class GenericControler {
  public getURLFromRequest(req: Request): string {
    return `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
  }

  public getStringListFromStringArrayAPIInput(input): string[] {
    if (input) {
      const isString = typeof input === 'string' || input instanceof String;
      if (isString) {
        return [input as string];
      } else {
        return input;
      }
    }
    return [];
  }

  checkCronAPIProtectedEndpoint(request: Request) {
    const authorization = request.headers['authorization'] as string;
    if (!authorization) {
      throw new UnauthorizedException('CRON API KEY manquante');
    }
    if (!authorization.endsWith(App.getCronAPIKey())) {
      throw new ForbiddenException('CRON API KEY incorrecte');
    }
  }
}
