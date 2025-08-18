const { ServiceBroker } = require("moleculer");

describe("Servicio health", () => {
  const broker = new ServiceBroker({
    nodeID: "test-node-health",
    logger: false
  });

  beforeAll(() => broker.createService(require("../services/health.service")));
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it("debe responder con status ok", async () => {
    const res = await broker.call("health.check");
    expect(res).toHaveProperty("status", "ok");
    expect(res).toHaveProperty("timestamp");
  });
});