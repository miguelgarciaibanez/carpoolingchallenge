import express from 'express'
//import {OpenApiValidator} from 'express-openapi-validator' // if version 3.*
import * as OpenApiValidator from 'express-openapi-validator'
import bodyParser from "body-parser";
import {Express} from 'express-serve-static-core'
import {connector, summarise} from 'swagger-routes-express'
import YAML from 'yamljs'
 
import * as api from '../api/controllers'
 
export async function createServer(): Promise<Express> {
  const yamlSpecFile = './config/openapi.yml'
  const apiDefinition = YAML.load(yamlSpecFile)
  const apiSummary = summarise(apiDefinition)
  console.info(apiSummary)
 
  const server = express()
  //server.use(cors);
 
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
 
  return server
}