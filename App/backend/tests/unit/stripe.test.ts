import { stripe } from '../../src/utils/stripe';
interface StripeWithApi {
  _api: {
    version: string;
    host: string;
    protocol: string;
  };
}

describe('Stripe Utility Unit Tests', () => {
  it('should initialize stripe with apiVersion', () => {
    expect(stripe).toBeDefined();
    expect((stripe as unknown as StripeWithApi)._api.version).toBe(
      '2026-06-24.dahlia'
    );
  });

  it('should resolve base configurations', () => {
    // Check if configuration matches stripe constructor
    expect((stripe as unknown as StripeWithApi)._api.host).toBeDefined();
    expect((stripe as unknown as StripeWithApi)._api.protocol).toBeDefined();
  });
});
