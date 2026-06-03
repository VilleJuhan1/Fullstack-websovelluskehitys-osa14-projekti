import { test, expect } from '@playwright/test';

test.describe('Quiz Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept GraphQL requests to mock data
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        const postData = request.postDataJSON();
        const operationName = postData?.operationName;

        if (operationName === 'GetMe') {
          await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                me: null, // Default to logged-out
              },
            }),
          });
          return;
        }

        if (operationName === 'GetAllData') {
          // Provide exactly 4 items to satisfy the "minimum 4 items" check in the frontend
          await route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                allCountries: [
                  {
                    id: '1',
                    name: 'Finland',
                    capital: 'Helsinki',
                    imageUrl: '/flags/fi.svg',
                    categories: ['europe'],
                  },
                  {
                    id: '2',
                    name: 'Sweden',
                    capital: 'Stockholm',
                    imageUrl: '/flags/se.svg',
                    categories: ['europe'],
                  },
                  {
                    id: '3',
                    name: 'Norway',
                    capital: 'Oslo',
                    imageUrl: '/flags/no.svg',
                    categories: ['europe'],
                  },
                  {
                    id: '4',
                    name: 'Denmark',
                    capital: 'Copenhagen',
                    imageUrl: '/flags/dk.svg',
                    categories: ['europe'],
                  },
                ],
                allPokemon: [],
              },
            }),
          });
          return;
        }
      }
      await route.continue();
    });
  });

  test('homepage renders welcome text and navigation links', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Quiz Platform');
    await expect(page.locator('text=Countries')).toBeVisible();
    await expect(page.locator('text=Pokémon')).toBeVisible();

    // Verify socials bar is visible and contains social links
    const footer = page.locator('footer.bottom-bar');
    await expect(footer).toBeVisible();
    await expect(footer.locator('img[alt="LinkedIn"]')).toBeVisible();
    await expect(footer.locator('img[alt="GitHub"]')).toBeVisible();
  });

  test('navigation to quiz works and loads questions', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Countries');

    // Verify redirection to /quiz/countries
    await expect(page).toHaveURL(/\/quiz\/countries/);

    // Check that we see the category header and question prompt
    await expect(page.locator('h1')).toContainText('COUNTRIES QUIZ');
    await expect(page.locator('text=Which one is:')).toBeVisible();

    // Verify that the 2x2 grid renders exactly 4 option buttons
    const options = page.locator('.grid-2x2 button');
    await expect(options).toHaveCount(4);

    // Initial score text should say "Make a guess!"
    await expect(page.locator('.streak-score-container')).toContainText(
      'Make a guess!'
    );

    // Click the first option
    await options.first().click();

    // Verify score element updates (attempts will increase, triggering a state change)
    await expect(page.locator('.streak-score-container')).not.toContainText(
      'Make a guess!'
    );
  });

  test('settings dropdown opens and shows login link', async ({ page }) => {
    await page.goto('/');

    // The Settings dropdown toggle button
    const toggleBtn = page.locator('.settings-toggle-btn');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();

    // Verify dropdown is visible and contains "Login"
    const loginLink = page.locator('text=Login');
    await expect(loginLink).toBeVisible();

    // Click login link and verify route transition
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
