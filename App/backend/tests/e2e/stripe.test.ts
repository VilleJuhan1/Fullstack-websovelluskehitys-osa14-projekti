import { describe, it, expect } from '@jest/globals';

const API_test_url = process.env.API_URL || 'http://localhost:4000/';

/**
 * API tests for Stripe payment integration.
 */
describe('Stripe API E2E', () => {
  it('upgrades user to premium', async () => {
    // 1. Create a new user for this test
    const randomUsername = `stripe_test_${Date.now()}`;
    const randomEmail = `${randomUsername}@example.com`;
    const password = 'TestPassword1!';

    let res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateUser($username: String!, $password: String!, $email: String!) {
            createUser(username: $username, password: $password, email: $email) {
              username
            }
          }
        `,
        variables: { username: randomUsername, password, email: randomEmail },
      }),
    });
    await res.json();
    expect(res.status).toBe(200);

    // 2. Login to get the JWT token
    res = await fetch(API_test_url, {
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
        variables: { username: randomUsername, password },
      }),
    });
    let json = await res.json();
    expect(res.status).toBe(200);
    const token = json.data.login.value;
    expect(token).toBeDefined();

    // 3. Upgrade to premium
    res = await fetch(API_test_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation UpgradeToPremium($paymentMethodId: String!) {
            upgradeToPremium(paymentMethodId: $paymentMethodId) {
              username
              isPremiumUser
            }
          }
        `,
        variables: { paymentMethodId: 'pm_card_visa' },
      }),
    });
    json = await res.json();
    expect(res.status).toBe(200);
    expect(json.data.upgradeToPremium).toBeDefined();
    expect(json.data.upgradeToPremium.isPremiumUser).toBe(true);
    expect(json.data.upgradeToPremium.username).toBe(randomUsername);
  });

  it('fails to upgrade if not authenticated', async () => {
    const res = await fetch(API_test_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation UpgradeToPremium($paymentMethodId: String!) {
            upgradeToPremium(paymentMethodId: $paymentMethodId) {
              isPremiumUser
            }
          }
        `,
        variables: { paymentMethodId: 'pm_card_visa' },
      }),
    });
    const json = await res.json();
    expect(json.errors).toBeDefined();
    expect(json.errors[0].message).toBe('Not authenticated');
  });
});
