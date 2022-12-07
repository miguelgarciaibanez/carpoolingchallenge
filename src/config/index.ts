import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables from 'dotenv-parse-variables';
 
const env = dotenvExtended.load({
  path: process.env.ENV_FILE || "",
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true
})

const parsedEnv = dotenvParseVariables(env)

interface Config {
    allowedSeats: number,
    PORT: number,
    CHECKTIME: number,
    /*
    privateKeyFile: string,
    privateKeyPassphrase: string,
    publicKeyFile: string,
    morganLogger: boolean,
    morganBodyLogger: boolean,
    exmplDevLogger: boolean,
    loggerLevel: LogLevel,
    mongo: {
      url: string,
      useCreateIndex: boolean,
      autoIndex: boolean
    },
    localCacheTtl: number,
    */
  }

  const config: Config = {
    /*
    privateKeyFile: parsedEnv.PRIVATE_KEY_FILE as string,
    privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE as string,
    publicKeyFile: parsedEnv.PUBLIC_KEY_FILE as string,
    morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
    morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
    exmplDevLogger: parsedEnv.EXMPL_DEV_LOGGER as boolean,
    loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
    mongo: {
      url: parsedEnv.MONGO_URL as string,
      useCreateIndex: parsedEnv.MONGO_CREATE_INDEX as boolean,
      autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean
    },
    localCacheTtl: parsedEnv.LOCAL_CACHE_TTL as number,
    */
    allowedSeats: parsedEnv.MAX_SEATS_AVALIABLE as number,
    PORT: parsedEnv.PORT as number,
    CHECKTIME: parsedEnv.CHECKTIME as number
  }

export default config