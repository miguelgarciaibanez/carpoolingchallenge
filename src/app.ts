import {createServer} from '@carpool/utils/server';
import config from '@carpool/config'

const port = config.PORT || 9091;

createServer()
  .then(server => {
    server.listen(port, () => {
      console.info(`Listening on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error(`Error: ${err}`)
  })