const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = {
  name: "users",
  mixins: [DbService],
  adapter: new MongoAdapter("mongodb://localhost:27017/kpaz"),
  collection: "users",
  actions: {
    async register(ctx) {
      const { email, password } = ctx.params;
      if (!email || !password) throw new Error("Email y contraseña requeridos");
      const exists = await this.adapter.findOne({ email });
      if (exists) throw new Error("El usuario ya existe");
      const hash = await bcrypt.hash(password, 10);
      const user = await this.adapter.insert({ email, password: hash });
      return { _id: user._id, email: user.email };
    },
    async login(ctx) {
      const { email, password } = ctx.params;
      if (!email || !password) throw new Error("Email y contraseña requeridos");
      const user = await this.adapter.findOne({ email });
      if (!user) throw new Error("Usuario o contraseña incorrectos");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Usuario o contraseña incorrectos");
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
      return { token };
    },
    async me(ctx) {
      if (!ctx.meta.user) throw new Error("No autenticado");
      return { id: ctx.meta.user.id, email: ctx.meta.user.email };
    }
  },
  settings: {
    rest: "/api/users"
  }
};