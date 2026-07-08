// Generated with Gemini 3.5 Flash (High)
import { userResolvers } from '../../src/schema/resolvers/userResolvers';
import { authResolvers } from '../../src/schema/resolvers/authResolvers';
import { countryResolvers } from '../../src/schema/resolvers/countryResolvers';
import { dotaHeroResolvers } from '../../src/schema/resolvers/dotaHeroResolvers';
import { pokemonResolvers } from '../../src/schema/resolvers/pokemonResolvers';
import { scoreResolvers } from '../../src/schema/resolvers/scoreResolvers';
import { sequelize, User, Country, DotaHero, Pokemon, Score } from '../../src/db';
import { stripe } from '../../src/utils/stripe';
import Stripe from 'stripe';

const mockTranslations = {
  common: 'mock',
  official: 'mock',
  fin: 'mock',
  swe: 'mock',
};

describe('Resolvers Integration Tests', () => {
  let createdUser: User | null = null;
  const username = `integration_test_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'TestPassword1!';

  beforeAll(async () => {
    // Insert some mock data if not present (although seeded db should have them)
    await Country.findOrCreate({
      where: { name: 'Finland' },
      defaults: {
        name: 'Finland',
        translations: mockTranslations,
        categories: ['geography'],
        imageUrl: 'https://example.com/finland.png',
      },
    });

    await DotaHero.findOrCreate({
      where: { name: 'Axe' },
      defaults: {
        name: 'Axe',
        translations: mockTranslations,
        categories: ['strength'],
        imageUrl: 'https://example.com/axe.png',
      },
    });

    await Pokemon.findOrCreate({
      where: { name: 'Pikachu' },
      defaults: {
        name: 'Pikachu',
        translations: mockTranslations,
        categories: ['electric'],
        imageUrl: 'https://example.com/pikachu.png',
      },
    });
  });

  afterAll(async () => {
    // Clean up created user if any
    if (createdUser) {
      await Score.destroy({ where: { userId: createdUser.id } });
      await User.destroy({ where: { id: createdUser.id } });
    }
    // Close the database connection pool so Jest doesn't hang
    await sequelize.close();
  });

  describe('authResolvers', () => {
    it('creates a new user successfully with password validation', async () => {
      const user = await authResolvers.Mutation.createUser(
        {},
        { username, email, password }
      );
      createdUser = user;

      expect(user).toBeDefined();
      expect(user.username).toBe(username);
      expect(user.email).toBe(email);
      expect(user.isPremiumUser).toBe(false);
    });

    it('fails to create a user with duplicate username', async () => {
      await expect(
        authResolvers.Mutation.createUser(
          {},
          { username, email: `other_${email}`, password }
        )
      ).rejects.toThrow('Username already taken');
    });

    it('logs in successfully and returns JWT token', async () => {
      const loginResult = await authResolvers.Mutation.login(
        {},
        { username, password }
      );

      expect(loginResult).toBeDefined();
      expect(loginResult.value).toBeDefined();
      expect(typeof loginResult.value).toBe('string');
      expect(loginResult.expiresAt).toBeGreaterThan(Date.now());
    });

    it('fails to login with invalid password', async () => {
      await expect(
        authResolvers.Mutation.login(
          {},
          { username, password: 'WrongPassword1!' }
        )
      ).rejects.toThrow('Invalid username or password');
    });
  });

  describe('userResolvers', () => {
    it('fetches a list of all users', async () => {
      const users = await userResolvers.Query.allUsers();
      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThan(0);
      const found = users.find((u) => u.username === username);
      expect(found).toBeDefined();
    });

    it('fetches a specific user by username', async () => {
      const user = await userResolvers.Query.user({}, { username });
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
    });

    it('resolves me for authenticated user', () => {
      const me = userResolvers.Query.me({}, {}, { currentUser: createdUser });
      expect(me).toBeDefined();
      expect(me?.username).toBe(username);
    });

    it('returns null for me when unauthenticated', () => {
      const me = userResolvers.Query.me({}, {}, { currentUser: null });
      expect(me).toBeNull();
    });

    it('upgrades user to premium', async () => {
      const spy = jest.spyOn(stripe.paymentIntents, 'create').mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded',
      } as unknown as Stripe.Response<Stripe.PaymentIntent>);

      const context = { currentUser: createdUser };
      const updatedUser = await userResolvers.Mutation.upgradeToPremium(
        {},
        { paymentMethodId: 'pm_card_visa' },
        context
      );

      expect(updatedUser.isPremiumUser).toBe(true);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('fails to upgrade if unauthenticated', async () => {
      await expect(
        userResolvers.Mutation.upgradeToPremium(
          {},
          { paymentMethodId: 'pm_card_visa' },
          { currentUser: null }
        )
      ).rejects.toThrow('Not authenticated');
    });
  });

  describe('countryResolvers', () => {
    it('fetches all countries', async () => {
      const countries = await countryResolvers.Query.allCountries();
      expect(countries).toBeDefined();
      expect(countries.length).toBeGreaterThan(0);
      expect(countries[0].name).toBeDefined();
    });

    it('fetches country by name (case-insensitive)', async () => {
      const country = await countryResolvers.Query.country({}, { name: 'finland' });
      expect(country).toBeDefined();
      expect(country?.name.toLowerCase()).toBe('finland');
    });

    it('returns null for non-existing country name', async () => {
      const country = await countryResolvers.Query.country({}, { name: 'Atlantis' });
      expect(country).toBeNull();
    });
  });

  describe('dotaHeroResolvers', () => {
    it('fetches all dota heroes', async () => {
      const heroes = await dotaHeroResolvers.Query.allDotaHeroes();
      expect(heroes).toBeDefined();
      expect(heroes.length).toBeGreaterThan(0);
    });

    it('fetches dota hero by name (case-insensitive)', async () => {
      const hero = await dotaHeroResolvers.Query.dotaHero({}, { name: 'axe' });
      expect(hero).toBeDefined();
      expect(hero?.name.toLowerCase()).toBe('axe');
    });
  });

  describe('pokemonResolvers', () => {
    it('fetches all pokemon', async () => {
      const pokemons = await pokemonResolvers.Query.allPokemon();
      expect(pokemons).toBeDefined();
      expect(pokemons.length).toBeGreaterThan(0);
    });

    it('fetches pokemon by name (case-insensitive)', async () => {
      const pokemon = await pokemonResolvers.Query.pokemon({}, { name: 'pikachu' });
      expect(pokemon).toBeDefined();
      expect(pokemon?.name.toLowerCase()).toBe('pikachu');
    });
  });

  describe('scoreResolvers', () => {
    it('updates user score streak', async () => {
      const context = { currentUser: createdUser };
      const score = await scoreResolvers.Mutation.updateStreakScore(
        {},
        { category: 'pokemon', streak: 12 },
        context
      );

      expect(score).toBeDefined();
      expect(score.userId).toBe(createdUser?.id);
      expect(score.category).toBe('pokemon');
      expect(score.highestStreak).toBe(12);
    });

    it('updates only if new streak is higher', async () => {
      const context = { currentUser: createdUser };
      // Try updating with lower score (10)
      let score = await scoreResolvers.Mutation.updateStreakScore(
        {},
        { category: 'pokemon', streak: 10 },
        context
      );
      expect(score.highestStreak).toBe(12);

      // Try updating with higher score (15)
      score = await scoreResolvers.Mutation.updateStreakScore(
        {},
        { category: 'pokemon', streak: 15 },
        context
      );
      expect(score.highestStreak).toBe(15);
    });

    it('fails updating score if unauthenticated', async () => {
      await expect(
        scoreResolvers.Mutation.updateStreakScore(
          {},
          { category: 'pokemon', streak: 10 },
          { currentUser: null }
        )
      ).rejects.toThrow('Authentication required');
    });

    it('fetches top scores', async () => {
      const topScores = await scoreResolvers.Query.topScores(
        {},
        { category: 'pokemon', limit: 5 }
      );
      expect(topScores).toBeDefined();
      expect(topScores.length).toBeGreaterThan(0);
      expect(topScores[0].highestStreak).toBeGreaterThanOrEqual(15);
    });
  });
});
