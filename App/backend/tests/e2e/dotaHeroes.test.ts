import { describe, it, expect } from '@jest/globals';

const API_test_url = process.env.API_URL || 'http://localhost:4000/';

/**
 * API tests for dota heroes quiz category.
 */
describe('Dota Heroes API E2E', () => {
  it('returns a list of dota heroes', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allDotaHeroes {
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
    expect(json.data.allDotaHeroes).toBeDefined();
    expect(json.data.allDotaHeroes.length).toBeGreaterThan(0);
    expect(json.data.allDotaHeroes[0]).toHaveProperty('name');
  });

  it('can fetch a specific dota hero by name', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetDotaHero($name: String!) {
            dotaHero(name: $name) {
              name
              categories
            }
          }
        `,
        variables: { name: 'anti-mage' }, // A common hero name for testing
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.dotaHero).toBeDefined();
    if (json.data.dotaHero) {
      expect(json.data.dotaHero.name).toBe('Anti-Mage');
    }
  });
});
