import React from 'react';
import { useMutation } from '@apollo/client/react';
import { UPGRADE_TO_PREMIUM } from '../services/auth';
import type { UpgradeData } from '../services/auth';
import './PaymentForm.css';

/**
 * PaymentForm component renders a mock payment form for upgrading a user's account to Premium.
 * 
 * Since this is a demonstration environment, the form fields are pre-filled, read-only,
 * and do not process real financial transactions. It triggers the `UPGRADE_TO_PREMIUM`
 * GraphQL mutation on submission.
 * 
 * @param props - The component props.
 * @param props.username - The current user's username, displayed as the cardholder name.
 */
export default function PaymentForm({ username }: { username: string }) {
  const [upgradeToPremium, { loading, error }] =
    useMutation<UpgradeData>(UPGRADE_TO_PREMIUM);

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upgradeToPremium({
        variables: { paymentMethodId: 'pm_card_visa' },
      });
    } catch (err) {
      console.error('Upgrade failed', err);
    }
  };

  return (
    <div className="payment-form-container">
      <h2 className="payment-form-title">Upgrade to Premium 💎</h2>

      <div className="payment-form-notice">
        <strong>Notice:</strong> This is a demonstration environment. No real
        payments are processed and your card will not be charged.
      </div>

      <form onSubmit={handleUpgrade} className="payment-form">
        <div className="payment-input-group">
          <label className="payment-label">Name on Card</label>
          <input
            type="text"
            defaultValue={username}
            readOnly
            className="payment-input"
          />
        </div>

        <div className="payment-input-group">
          <label className="payment-label">Card Number</label>
          <input
            type="text"
            defaultValue="4242 4242 4242 4242"
            readOnly
            className="payment-input card-number"
          />
        </div>

        <div className="payment-input-row">
          <div className="payment-input-group flex-1">
            <label className="payment-label">Expiry</label>
            <input
              type="text"
              defaultValue="12/28"
              readOnly
              className="payment-input"
            />
          </div>
          <div className="payment-input-group flex-1">
            <label className="payment-label">CVC</label>
            <input
              type="text"
              defaultValue="123"
              readOnly
              className="payment-input"
            />
          </div>
        </div>

        {error && <p className="payment-error">{error.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary payment-submit-btn"
        >
          {loading ? 'Processing...' : 'Pay 9,99€'}
        </button>
      </form>
    </div>
  );
}
