module.exports = {
  name: "health",
  actions: {
    check(ctx) {
      return { status: "ok", timestamp: new Date() };
    },
  },
};