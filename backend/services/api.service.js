const ApiGateway = require("moleculer-web");

module.exports = {
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: 3000,
    routes: [
      {
        path: "/api",
        aliases: {
          // Health
          "GET health": "health.check",
          // Books
          "GET books/search": "books.search",
          "GET books/last-search": "books.lastSearch",
          "POST books/my-library": "books.save",
          "GET books/my-library/:id": "books.getOne",
          "PUT books/my-library/:id": "books.update",
          "DELETE books/my-library/:id": "books.delete",
          "GET books/my-library": "books.list",
          "GET books/library/front-cover/:id": "books.frontCover"
        },
        mappingPolicy: "restrict",
        bodyParsers: {
          json: true,
          urlencoded: { extended: true }
        }
      }
    ]
  }
};