test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.version).toBeDefined();
  expect(responseBody.max_connections).toBeDefined();
  expect(responseBody.opened_connections).toBeDefined();

  console.log(responseBody.version);
  console.log(responseBody.max_connections);
  console.log(responseBody.opened_connections);

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(expect.any(String));
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(responseBody.version).toEqual(expect.any(String));
  expect(responseBody.version).toEqual("16.0");
  expect(responseBody.version).toMatch(/^\d+\.\d+$/);
  expect(responseBody.max_connections).toEqual(expect.any(Number));
  expect(responseBody.max_connections).toEqual(100);
  expect(responseBody.max_connections).toBeGreaterThan(0);
  expect(responseBody.opened_connections).toEqual(expect.any(Number));
  expect(responseBody.opened_connections).toEqual(1);
  expect(responseBody.opened_connections).toBeGreaterThanOrEqual(0);
});
