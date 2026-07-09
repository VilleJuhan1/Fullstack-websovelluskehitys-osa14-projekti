import { describe, it, expect } from '@jest/globals';

const API_test_url = process.env.API_URL || 'http://localhost:4000/';

/**
 * API tests for dota heroes quiz category.
 */
describe('Kana API E2E', () => {
  it('returns a list of kana characters', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allKana {
              id
              name
              imageUrl
            }
          }
        `,
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.allKana).toBeDefined();
    expect(json.data.allKana.length).toBeGreaterThan(0);
    expect(json.data.allKana[0]).toHaveProperty('name');
  });

  it('can fetch a specific kana by name', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetKana($name: String!) {
            kana(name: $name) {
              name
              categories
            }
          }
        `,
        variables: { name: "'a' (Hira)" }, // A common kana for testing
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.kana).toBeDefined();
    if (json.data.kana) {
      expect(json.data.kana.name).toBe("'a' (Hira)");
    }
  });
});
