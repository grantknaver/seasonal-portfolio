/** Calendly link for the free 20-minute Teardown Review. */
export const TEARDOWN_BOOKING_URL =
  (import.meta.env.VITE_TEARDOWN_BOOKING_URL as string | undefined) ||
  'https://calendly.com/glkfreelance/product-clarity-first-touch-diagnostic';

export const openTeardownBooking = () =>
  window.open(TEARDOWN_BOOKING_URL, '_blank', 'noopener');
