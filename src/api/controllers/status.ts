import * as express from 'express';
import { writeJsonResponse  } from '@carpool/utils/express';

export function status(req: express.Request, res: express.Response):void{
    writeJsonResponse(res,200,'');
}