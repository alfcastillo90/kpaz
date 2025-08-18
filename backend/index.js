const { ServiceBroker } = require("moleculer");
const path = require("path");

const broker = new ServiceBroker({
  config: require("./moleculer.config")
});

// Cargar todos los servicios de la carpeta services
broker.loadServices(path.join(__dirname, "services"));

// Iniciar el broker
broker.start();