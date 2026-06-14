import { User } from '../../db/models/User';

// Resolvers for user queries
export const userResolvers = {
  Query: {
    allUsers: async (): Promise<User[]> => {
      return User.findAll({
        attributes: ['id', 'username', 'isActive'],
      });
    },

    user: async (
      _: unknown,
      { username }: { username: string }
    ): Promise<User | null> => {
      return User.findOne({ where: { username } });
    },

    me: (
      _root: unknown,
      _args: unknown,
      context: { currentUser?: User | null }
    ): User | null => {
      return context.currentUser || null;
    },
  },
  User: {
    scores: async (user: User) => {
      return user.getScores();
    },
  },
  Mutation: {
    upgradeToPremium: async (
      _root: unknown,
      { paymentMethodId }: { paymentMethodId: string },
      context: { currentUser?: User | null }
    ): Promise<User> => {
      if (!context.currentUser) {
        throw new Error('Not authenticated');
      }

      // Import stripe dynamically or at the top of the file
      const { stripe } = await import('../../utils/stripe.js');

      try {
        // Simulate real-world network/processing delay (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create a mock charge/payment intent with Stripe
        await stripe.paymentIntents.create({
          amount: 999, // $9.99
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          }
        });

        // Upgrade the user in the database
        context.currentUser.isPremiumUser = true;
        await context.currentUser.save();

        return context.currentUser;
      } catch (error) {
        console.error('Payment failed:', error);
        throw new Error('Payment processing failed', { cause: error });
      }
    },
  },
};
