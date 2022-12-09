import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer } from '@carpool/utils/server';

let server: Express;

beforeAll(async()=>{
    server = await createServer()
})

describe('GET status',()=>{
    it ('should return 200', async()=>{
        const result = await request(server).get('/status');
        expect(result.status).toEqual(200);
    })
})