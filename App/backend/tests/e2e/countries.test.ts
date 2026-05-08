import { describe, it, expect } from '@jest/globals';

const API_test_url = process.env.API_URL || 'http://localhost:4000/';

describe('Countries API E2E', () => {
  it('returns a list of countries', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allCountries {
              id
              name
            }
          }
        `,
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.allCountries).toBeDefined();
    expect(json.data.allCountries.length).toBeGreaterThan(0);
    expect(json.data.allCountries[0]).toHaveProperty('name');
  });

  it('can fetch a specific country by name', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetCountry($name: String!) {
            country(name: $name) {
              name
            }
          }
        `,
        variables: { name: 'Finland' },
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.country).toBeDefined();
    expect(json.data.country.name).toBe('Finland');
  });
});
