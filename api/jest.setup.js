let server;

beforeAll(() => {
  server = app.listen(3000);
});

afterAll((done) => {
  server.close(done);
});
