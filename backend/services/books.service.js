const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");
const axios = require("axios");

const LAST_SEARCHES_LIMIT = 5;

module.exports = {
  name: "books",
  mixins: [DbService],
  adapter: new MongoAdapter("mongodb://localhost:27017/kpaz"),
  collection: "books",
  actions: {
    // 1. Buscar libros en OpenLibrary
    async search(ctx) {
      const q = ctx.params.q;
      if (!q) throw new Error("Falta el parámetro de búsqueda 'q'");
      // Guardar búsqueda
      ctx.call("books.addSearch", { q });
      // Buscar en OpenLibrary
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}`;
      const { data } = await axios.get(url);
      let results = (data.docs || []).slice(0, 10).map(doc => ({
        openLibraryId: doc.key,
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(", ") : "",
        year: doc.first_publish_year,
        coverId: doc.cover_i,
        coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null
      }));
      // Revisar si algún libro ya está en la biblioteca
      const ids = results.map(r => r.openLibraryId);
      const savedBooks = await this.adapter.find({
        query: { openLibraryId: { $in: ids } },
        fields: ["openLibraryId", "coverBase64"]
      });
      results = results.map(r => {
        const saved = savedBooks.find(b => b.openLibraryId === r.openLibraryId);
        if (saved && saved.coverBase64) {
          r.coverUrl = `/api/books/library/front-cover/${saved.openLibraryId}`;
        }
        return r;
      });
      return results;
    },
    // 2. Guardar búsqueda
    addSearch: {
      params: { q: "string" },
      async handler(ctx) {
        if (!this.lastSearches) this.lastSearches = [];
        this.lastSearches.unshift(ctx.params.q);
        this.lastSearches = this.lastSearches.slice(0, LAST_SEARCHES_LIMIT);
      }
    },
    // 3. Últimas búsquedas
    lastSearch: {
      async handler() {
        return this.lastSearches || [];
      }
    },
    // 4. Guardar libro en la biblioteca
    async save(ctx) {
      const { openLibraryId, title, author, year, coverBase64, review, rating } = ctx.params;
      if (!openLibraryId || !title) throw new Error("Faltan datos obligatorios");
      const doc = {
        openLibraryId,
        title,
        author,
        year,
        coverBase64,
        review,
        rating
      };
      const res = await this.adapter.insert(doc);
      return res;
    },
    // 5. Obtener libro por ID
    async getOne(ctx) {
      const { id } = ctx.params;
      if (!id) throw new Error("Falta el id");
      return this.adapter.findById(id);
    },
    // 6. Actualizar libro
    async update(ctx) {
      const { id, review, rating } = ctx.params;
      if (!id) throw new Error("Falta el id");
      const update = {};
      if (review !== undefined) update.review = review;
      if (rating !== undefined) update.rating = rating;
      await this.adapter.updateById(id, { $set: update });
      return { success: true };
    },
    // 7. Eliminar libro
    async delete(ctx) {
      const { id } = ctx.params;
      if (!id) throw new Error("Falta el id");
      await this.adapter.removeById(id);
      return { success: true };
    },
    // 8. Listar libros con filtros
    async list(ctx) {
      const { title, author, minRating, maxRating, excludeNoReview, sort } = ctx.params || {};
      const query = {};
      if (title) query.title = { $regex: title, $options: "i" };
      if (author) query.author = { $regex: author, $options: "i" };
      if (minRating) query.rating = { ...query.rating, $gte: Number(minRating) };
      if (maxRating) query.rating = { ...query.rating, $lte: Number(maxRating) };
      if (excludeNoReview) query.review = { $ne: null, $ne: "" };
      let sortObj = {};
      if (sort === "rating_asc") sortObj.rating = 1;
      if (sort === "rating_desc") sortObj.rating = -1;
      return this.adapter.find({ query, sort: sortObj });
    },
    // 9. Obtener portada en base64
    async frontCover(ctx) {
      const { id } = ctx.params;
      if (!id) throw new Error("Falta el id");
      const book = await this.adapter.findOne({ openLibraryId: id });
      if (!book || !book.coverBase64) throw new Error("No se encontró la portada");
      return { coverBase64: book.coverBase64 };
    }
  },
  // Exponer rutas REST personalizadas
  settings: {
    rest: "/api/books"
  }
};