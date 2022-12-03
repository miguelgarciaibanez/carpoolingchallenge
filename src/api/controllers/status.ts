import * as express from 'express';

export function status(req: express.Request, res: express.Response):void{
    res.status(200).send();
}