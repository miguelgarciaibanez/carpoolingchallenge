import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer, closeServer } from '@carpool/utils/server';
import { StatusCodes } from 'http-status-codes';
import * as JourneysService from '@carpool/api/services/journeys';

let server: Express;

beforeAll(async()=>{
    server = await createServer();
})

afterAll(()=>{
    closeServer();
});


describe('JOURNEYS controller',()=>{
    describe('Journey function',()=>{
        it('Should return BAD request due to exception', async()=>{
            jest.spyOn(JourneysService,'setJourney').mockImplementation(()=>{
                throw new Error();
            });;
            const result = await request(server)
                                .post('/journey')
                                .send({id:1, people:1})
                                .set('Accept', 'application/json');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return BAD request because it comes from function', async()=>{
            jest.spyOn(JourneysService,'setJourney').mockReturnValueOnce(StatusCodes.BAD_REQUEST);
            const result = await request(server)
                                .post('/journey')
                                .send({id:1, people:1})
                                .set('Accept', 'application/json');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return ok',async()=>{
            jest.spyOn(JourneysService,'setJourney').mockReturnValueOnce(StatusCodes.OK);
            const result = await request(server)
            .post('/journey')
            .send({id:1, people:1})
            .set('Accept', 'application/json');
            expect(result.status).toEqual(StatusCodes.OK);
        })
    });

    describe('DropOff function', ()=>{
        it('Should return BAD request if no ID is sent', async()=>{
            const result = await request(server)
                                .post('/dropoff')
                                .send('ID=')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return BAD request due to exception', async()=>{
            jest.spyOn(JourneysService,'dropOffJourney').mockImplementation(()=>{
                throw new Error();
            });;
            const result = await request(server)
                                .post('/dropoff')
                                .send('ID=1')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return BAD request because it comes from function', async()=>{
            jest.spyOn(JourneysService,'dropOffJourney').mockReturnValueOnce(StatusCodes.BAD_REQUEST);
            const result = await request(server)
                                .post('/dropoff')
                                .send('ID=1')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return ok',async()=>{
            jest.spyOn(JourneysService,'dropOffJourney').mockReturnValueOnce(StatusCodes.OK);
            const result = await request(server)
                                .post('/dropoff')
                                .send('ID=1')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.OK);
        })
    });
    
    describe('LOCATE',()=>{
        it('Should return BAD request if no ID is sent', async()=>{
            const result = await request(server)
                                .post('/locate')
                                .send('ID=')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return BAD request due to exception', async()=>{
            jest.spyOn(JourneysService,'locateJourney').mockImplementation(()=>{
                throw new Error();
            });;
            const result = await request(server)
                                .post('/locate')
                                .send('ID=1')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return BAD request because it comes from function', async()=>{
            jest.spyOn(JourneysService,'locateJourney').mockReturnValueOnce({statusCode:StatusCodes.BAD_REQUEST, car:null});
            const result = await request(server)
                                .post('/locate')
                                .send('ID=1')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.BAD_REQUEST);
        });

        it('Should return ok',async()=>{
            jest.spyOn(JourneysService,'locateJourney').mockReturnValueOnce({statusCode:StatusCodes.OK, car:{id:1, seats:1}});
            const result = await request(server)
                                .post('/locate')
                                .send('ID=1')
                                .set('Accept', 'x-www-form-urlencoded');
            expect(result.status).toEqual(StatusCodes.OK);
            expect(result.body).toMatchObject({id:1, seats:1});
        })
    })
})
