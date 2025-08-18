const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");

module.exports = {
  name: "books",
  mixins: [DbService],
  adapter: new MongoAdapter("mongodb://mongodb:27017/kpaz"),
  collection: "books",
  actions: {
    // Aquí irán las acciones para los endpoints requeridos
  },
};