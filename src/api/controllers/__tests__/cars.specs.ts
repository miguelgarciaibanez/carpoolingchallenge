import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer, closeServer } from '@carpool/utils/server';
import { StatusCodes } from 'http-status-codes';
import * as CarsService from '@carpool/api/services/cars';

let server: Express;

beforeAll(async()=>{
    server = await createServer();
})

afterAll(()=>{
    closeServer();
});

describe('CARS controller',()=>{
    it ('should return 200', async()=>{
        const data=[
            {
              "id": 1,
              "seats": 3
            },
            {
              "id": 2,
              "seats": 3
            },
            {
              "id": 3,
              "seats": 2
            },
            {
              "id": 4,
              "seats": 3
            },
            {
              "id": 5,
              "seats": 5
            }
          ];
        jest.spyOn(CarsService,'resetApp').mockReturnValueOnce(true);
        const result = await request(server)
                                .put('/cars')
                                .send(data)
                                .set('Accept', 'application/json');
        expect(result.status).toEqual(StatusCodes.OK);
    });
    
    it ('should return BAD REQUEST', async()=>{
        const data=[
            {
              "id": 1,
              "seats": 3
            },
            {
              "id": 2,
              "seats": 3
            },
            {
              "id": 3,
              "seats": 2
            },
            {
              "id": 4,
              "seats": 3
            },
            {
              "id": 5,
              "seats": 5
            }
          ];
        jest.spyOn(CarsService,'resetApp').mockReturnValueOnce(false);
        const result = await request(server)
                                .put('/cars')
                                .send(data)
                                .set('Accept', 'application/json');
        expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
    });
    

    it ('should return BAD REQUEST due to exception', async()=>{
        const data=[
            {
              "id": 1,
              "seats": 3
            },
            {
              "id": 2,
              "seats": 3
            },
            {
              "id": 3,
              "seats": 2
            },
            {
              "id": 4,
              "seats": 3
            },
            {
              "id": 5,
              "seats": 5
            }
          ];
        jest.spyOn(CarsService,'resetApp').mockImplementation(()=>{
            throw new Error();
        });
        const result = await request(server)
                                .put('/cars')
                                .send(data)
                                .set('Accept', 'application/json');
        expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
    });
})