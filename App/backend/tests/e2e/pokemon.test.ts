import { describe, it, expect } from '@jest/globals';

const API_test_url = process.env.API_URL || 'http://localhost:4000/';

/**
 * API tests for pokemon quiz category.
 */
describe('Pokemon API E2E', () => {
  it('returns a list of pokemon', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allPokemon {
              id
              name
            }
          }
        `,
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.allPokemon).toBeDefined();
    expect(json.data.allPokemon.length).toBeGreaterThan(0);
    expect(json.data.allPokemon[0]).toHaveProperty('name');
  });

  it('can fetch a specific pokemon by name', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetPokemon($name: String!) {
            pokemon(name: $name) {
              name
              categories
            }
          }
        `,
        variables: { name: 'pikachu' },
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.pokemon).toBeDefined();
    expect(json.data.pokemon.name).toBe('pikachu');
  });
});
