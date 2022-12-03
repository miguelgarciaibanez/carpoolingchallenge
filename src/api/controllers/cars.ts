import * as express from 'express';
import { writeJsonResponse } from '../../utils/express';

export function cars(req: express.Request, res:express.Response):void {
    writeJsonResponse(res,200,'');
}