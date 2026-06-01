import { describe, it, expect } from '@jest/globals';

const API_test_url = process.env.API_URL || 'http://localhost:4000/';

interface GraphQLUser {
  username: string;
  isActive: boolean;
}

interface GraphQLScore {
  category: string;
  highestStreak: number;
}

describe('Auth and User API E2E', () => {
  it('can login with test_admin_user', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              value
            }
          }
        `,
        variables: {
          username: 'test_admin_user',
          password: 'testpassword3',
        },
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.login.value).toBeDefined();
  });

  it('returns a list of users', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            allUsers {
              username
              isActive
            }
          }
        `,
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.allUsers).toBeDefined();
    expect(json.data.allUsers.length).toBeGreaterThan(0);
    expect(
      json.data.allUsers.find(
         (u: GraphQLUser) => u.username === 'test_admin_user'
      )
    ).toBeDefined();
  });

  it('can fetch a user profile with their scores', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetUser($username: String!) {
            user(username: $username) {
              username
              email
              scores {
                category
                highestStreak
              }
            }
          }
        `,
        variables: { username: 'test_premium_user' },
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.user.username).toBe('test_premium_user');
    expect(json.data.user.scores).toBeDefined();
    expect(json.data.user.scores.length).toBeGreaterThan(0);
    expect(json.data.user.scores[0]).toHaveProperty('category');
  });

  it('can fetch the top scores leaderboard', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetTopScores($category: String) {
            topScores(category: $category, limit: 5) {
              category
              highestStreak
            }
          }
        `,
        variables: { category: 'pokemon' },
      }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.topScores).toBeDefined();
    expect(json.data.topScores.length).toBeGreaterThan(0);
    // Verify all returned scores match the requested category
    json.data.topScores.forEach((score: GraphQLScore) => {
      expect(score.category).toBe('pokemon');
    });
  });

  it('fails login with wrong password', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              value
            }
          }
        `,
        variables: {
          username: 'test_admin_user',
          password: 'wrongpassword',
        },
      }),
    });

    const json = await res.json();
    expect(json.errors).toBeDefined();
    expect(json.errors[0].message).toBe('Invalid username or password');
  });
});
