import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import {resetApp} from '@carpool/api/services/cars';
import { writeJsonResponse } from '@carpool/utils/express';

export function cars(req: express.Request, res:express.Response):void {
    try {
        let resReset: boolean = resetApp(req.body);
        if (resReset){
            writeJsonResponse(res,StatusCodes.OK,'');
        }
        else {
            writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
        }
    } catch (error) {
        console.log('Error resetting app');
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
    }
    
}