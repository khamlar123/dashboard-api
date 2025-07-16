import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export function logger(req: Request, res: Response, next: NextFunction) {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)} ${res.status}\n`;
  next();
}
