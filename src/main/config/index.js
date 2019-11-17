// fusquare-server.cloud-building.tech:3000
// fusquare-hardwaremqtt.cloud-building.tech:1883
// fusquare-appmqtt.cloud-building.tech:1884
// fusquare-websocket.cloud-building.tech:8083

const isDevelopment = process.env.NODE_ENV !== 'production'

let suffix = 'tech'

if (isDevelopment) {
  suffix = 'fun'
}

const WHERE_URL = {
  hardware: `mqtt://fusquare-hardwaremqtt.cloud-building.${suffix}:1883`,
  app: `mqtt://fusquare-appmqtt.cloud-building.${suffix}:1884`
}

const config = {
  API_BASC_URL: `http://fusquare-server.cloud-building.${suffix}:3000`,
  WHERE_URL
}

export default config
