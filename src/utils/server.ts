import express from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import bodyParser from "body-parser";
import {Express} from 'express-serve-static-core'
import {connector, summarise} from 'swagger-routes-express'
import {checkPendingJourneys} from '@carpool/api/services/journeys';
import YAML from 'yamljs'
import config from '@carpool/config' 

import * as api from '@carpool/api/controllers';

let intervalId:NodeJS.Timer;
 
export async function createServer(): Promise<Express> {
  const yamlSpecFile = './config/openapi.yml'
  const apiDefinition = YAML.load(yamlSpecFile)
  const apiSummary = summarise(apiDefinition)
  console.info(apiSummary)
 
  const server = express()
 
  // setup API validator
  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true
  }

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  server.use(OpenApiValidator.middleware(validatorOptions))
  
  // error customization, if request is invalid
  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status).json({
      error: {
        type: 'request_validation',
        message: err.message,
        errors: err.errors
      }
    })
  })
 
  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      console.log(`${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`)
    }
  })

  connect(server)

  intervalId = setInterval(()=>{checkPendingJourneys()},config.CHECKTIME);
 
  return server
}


export const closeServer=():void=>{
  clearInterval(intervalId);
}