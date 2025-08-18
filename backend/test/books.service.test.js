const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");

const broker = new ServiceBroker({
  nodeID: "test-node",
  logger: false
});

describe("Servicio books", () => {
  beforeAll(async () => {
    broker.createService(require("../services/books.service"));
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  it("debe buscar libros en OpenLibrary", async () => {
    const res = await broker.call("books.search", { q: "harry potter" });
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
    expect(res[0]).toHaveProperty("title");
  });

  let bookId;
  it("debe guardar un libro en la biblioteca", async () => {
    const libro = {
      openLibraryId: "OL123M",
      title: "Test Book",
      author: "Test Author",
      year: 2024,
      coverBase64: "dGVzdA==",
      review: "Muy buen libro",
      rating: 5
    };
    const res = await broker.call("books.save", libro);
    expect(res).toHaveProperty("_id");
    bookId = res._id;
  });

  it("debe listar libros guardados", async () => {
    const res = await broker.call("books.list");
    expect(Array.isArray(res)).toBe(true);
    expect(res.find(b => b.title === "Test Book")).toBeTruthy();
  });

  it("debe actualizar un libro", async () => {
    const res = await broker.call("books.update", { id: bookId, review: "Actualizado", rating: 4 });
    expect(res).toHaveProperty("success", true);
  });

  it("debe eliminar un libro", async () => {
    const res = await broker.call("books.delete", { id: bookId });
    expect(res).toHaveProperty("success", true);
  });
});