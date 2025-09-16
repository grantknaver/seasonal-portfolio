import fetchFactory from 'fetch-retry';

export const fetchRetry = fetchFactory(fetch, {
  retries: 3,
  retryDelay: (attempt) => 400 * attempt, // 400ms, 800ms, 1200ms
  retryOn: (attempt, error, response) => {
    if (attempt >= 3) return false;
    if (error) return true;
    if (!response) return true;

    // don't retry on these statuses
    if ([400, 401, 403, 429].includes(response.status)) return false;

    // retry on 408 or 5xx
    return response.status === 408 || response.status >= 500;
  },
});
