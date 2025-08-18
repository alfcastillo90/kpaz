module.exports = {
  name: "health",
  actions: {
    check: {
      rest: "/",
      handler(ctx) {
        return { status: "ok", timestamp: new Date() };
      }
    }
  },
  settings: {
    rest: "/api/health"
  }
};