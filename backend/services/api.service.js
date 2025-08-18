const ApiGateway = require("moleculer-web");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = {
  name: "api",
  mixins: [ApiGateway],
  settings: {
    port: 3000,
    routes: [
      {
        path: "/api",
        authentication: true,
        authorization: true,
        aliases: {
          // Health (público)
          "GET health": "health.check",
          // Users (público)
          "POST users/register": "users.register",
          "POST users/login": "users.login",
          "GET users/me": "users.me",
          // Books (protegido)
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
        },
        // Solo proteger endpoints de libros
        whitelist: [
          "health.*",
          "users.register",
          "users.login",
          "users.me",
          "books.*"
        ]
      }
    ]
  },
  methods: {
    async authenticate(ctx, route, req) {
      // Endpoints públicos
      if (
        req.$endpoint.action.name.startsWith("health") ||
        req.$endpoint.action.name.startsWith("users.register") ||
        req.$endpoint.action.name.startsWith("users.login")
      ) {
        return Promise.resolve();
      }
      const auth = req.headers["authorization"];
      if (auth && auth.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
          ctx.meta.user = decoded;
          return Promise.resolve(decoded);
        } catch (err) {
          return Promise.reject(new ApiGateway.Errors.UnAuthorizedError("INVALID_TOKEN"));
        }
      }
      return Promise.reject(new ApiGateway.Errors.UnAuthorizedError("NO_TOKEN"));
    }
  }
};