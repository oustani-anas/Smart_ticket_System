

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('--- INCOMING REQUEST ---');
    // console.log(`[${req.method}] ${req.originalUrl}`);
    
    // // THIS IS THE MOST IMPORTANT PART
    // console.log('Headers arriving at NestJS:');
    // console.log(req.headers);
    // console.log('------------------------');
    
    next();
  }
}