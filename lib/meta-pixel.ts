/**
 * Utility functions for triggering Meta Pixel Events
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const event = (name: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

export const customEvent = (name: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, options);
  }
};

/**
 * Standard E-Commerce Events
 */

export const trackAddToCart = (params: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  event('AddToCart', {
    content_type: 'product',
    ...params,
  });
};

export const trackViewContent = (params: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  event('ViewContent', {
    content_type: 'product',
    ...params,
  });
};

export const trackInitiateCheckout = (params: {
  content_ids?: string[];
  num_items?: number;
  value?: number;
  currency?: string;
}) => {
  event('InitiateCheckout', params);
};

export const trackPurchase = (params: {
  content_ids?: string[];
  content_type?: string;
  value: number;
  currency: string;
  num_items?: number;
}) => {
  event('Purchase', {
    content_type: 'product',
    ...params,
  });
};

export const trackLead = (params: {
  content_name?: string;
  value?: number;
  currency?: string;
}) => {
  event('Lead', params);
};
