test("DELETE resquest to api/v1/migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "delete",
  });
  expect(response.status).toBe(405);
});
