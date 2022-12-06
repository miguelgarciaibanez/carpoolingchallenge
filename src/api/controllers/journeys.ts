import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import {setJourney, dropOffJourney, locateJourney} from '@carpool/api/services/journeys';
import { writeJsonResponse } from '@carpool/utils/express';

export function journey(req: express.Request, res: express.Response):void{
    try {
        let resSetJourney: boolean = setJourney(req.body);
        if (resSetJourney) {
            writeJsonResponse(res, StatusCodes.OK,'');
        } else {
            writeJsonResponse(res, StatusCodes.BAD_REQUEST, 'Bad Request');
        }
    } catch (error) {
        console.log('Error setting journey');
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, 'Bad Request');
    }
}

export function dropoff(req: express.Request, res: express.Response):void{
    try {
        if (!req.body.ID){
            writeJsonResponse(res, StatusCodes.BAD_REQUEST, 'Bad Request');
        }
        const resDropOff: StatusCodes = dropOffJourney(req.body.ID);
        writeJsonResponse(res, resDropOff,'');
    } catch (error) {
        console.log('Error dropoff journey');
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, 'Bad Request');
    }
    res.status(200).send();
}

export function locate(req: express.Request, res: express.Response):void{
    try {
        if (!req.body.ID){
            writeJsonResponse(res, StatusCodes.BAD_REQUEST, 'Bad Request');
        }
        const resLocate = locateJourney(req.body.ID);
        writeJsonResponse(res, resLocate.statusCode, resLocate.statusCode === StatusCodes.OK ? resLocate.car : '');
    } catch (error) {
        
    }
    res.status(200).send();
}