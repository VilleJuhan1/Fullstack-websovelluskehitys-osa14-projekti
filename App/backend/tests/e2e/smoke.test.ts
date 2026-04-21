const API_test_url = process.env.API_URL || 'http://localhost:4000/graphql';

test('basic query returns 200 and json data', async () => {
  const res = await fetch(API_test_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { __typename }`,
    }),
  });

  const json = await res.json();

  expect(res.status).toBe(200);
  expect(json.data).toBeDefined();
});