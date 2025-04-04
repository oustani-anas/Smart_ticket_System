// this file for WEBHOOK payment by STRIPE

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    req['rawBody'] = req.body;
    next();
  }
}