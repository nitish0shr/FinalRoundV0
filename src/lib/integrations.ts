import Stripe from 'stripe';
import { Resend } from 'resend';

// Stripe Initialization (lazy)
let _stripe: Stripe | null = null;
export function getStripe() {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set');
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-11-17.clover',
            typescript: true,
        });
    }
    return _stripe;
}

// Backward compatible export
export const stripe = new Proxy({} as Stripe, {
    get(target, prop) {
        return (getStripe() as any)[prop];
    }
});

// Resend Initialization (lazy)
let _resend: Resend | null = null;
export function getResend() {
    if (!_resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set');
        }
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

// Backward compatible export
export const resend = new Proxy({} as Resend, {
    get(target, prop) {
        return (getResend() as any)[prop];
    }
});

// Daily.co Helper
export const daily = {
    createRoom: async (options: { privacy?: 'public' | 'private', properties?: any } = {}) => {
        const apiKey = process.env.DAILY_API_KEY;
        if (!apiKey) throw new Error('DAILY_API_KEY is not set');

        const response = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                privacy: options.privacy || 'private',
                properties: {
                    enable_chat: true,
                    enable_recording: 'cloud',
                    ...options.properties,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create Daily room: ${response.statusText}`);
        }

        return response.json();
    }
};
