import * as express from 'express';

export function journey(req: express.Request, res: express.Response):void{
    res.status(200).send();
}

export function dropoff(req: express.Request, res: express.Response):void{
    res.status(200).send();
}

export function locate(req: express.Request, res: express.Response):void{
    res.status(200).send();
}