import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import {setJourney, dropOffJourney, locateJourney, setPendingJourneysToMemory} from '@carpool/api/services/journeys';
import { writeJsonResponse } from '@carpool/utils/express';

export async function journey(req: express.Request, res: express.Response):Promise<void>{
    try {
        let resSetJourney: StatusCodes = await setJourney(req.body);
        writeJsonResponse(res, resSetJourney,'');
    } catch (error) {
        console.log('Error setting journey');
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
    }
}

export function dropoff(req: express.Request, res: express.Response):void{
    try {
        if (!req.body.ID || req.body.ID===''){
            writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
        }
        const resDropOff: StatusCodes = dropOffJourney(req.body.ID);
        writeJsonResponse(res, resDropOff,'');
    } catch (error) {
        console.log('Error dropoff journey');
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
    }
}

export function locate(req: express.Request, res: express.Response):void{
    try {
        if (!req.body.ID){
            writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
        }
        const resLocate = locateJourney(req.body.ID);
        writeJsonResponse(res, resLocate.statusCode, resLocate.statusCode === StatusCodes.OK ? resLocate.car : '');
    } catch (error) {
        console.log('Error locate journey');
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
    }
}


export async function setPendingJourneys(req: express.Request, res: express.Response):Promise<void>{
    try {
        let resSetJourney: StatusCodes = await setPendingJourneysToMemory(req.body);
        writeJsonResponse(res, resSetJourney,'');
    } catch (error) {
        console.log('Error setting pending journeys:', error);
        writeJsonResponse(res, StatusCodes.BAD_REQUEST, '');
    }
}