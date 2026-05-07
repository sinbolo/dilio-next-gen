export function rateLimit({
  interval,
  uniqueTokenPerInterval = 500,
}: {
  interval: number;
  uniqueTokenPerInterval?: number;
}) {
  const tokenCache = new Map();
  let lastClearTime = Date.now();

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        // Clear cache periodically based on interval
        if (Date.now() - lastClearTime > interval) {
          tokenCache.clear();
          lastClearTime = Date.now();
        }

        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage > limit;
        
        if (isRateLimited) {
          reject("Rate limit exceeded");
        } else {
          resolve();
        }
      }),
  };
}
