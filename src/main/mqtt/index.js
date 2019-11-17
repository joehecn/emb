
import acceptClient from './acceptClient.js'
import retainClient from './retainClient.js'
import testingClients from './testingClients.js'

const closeMqtt = () => {
  retainClient.closeRetainClient()
  acceptClient.closeAcceptClient()
  testingClients.closeTClients()
}

export default closeMqtt