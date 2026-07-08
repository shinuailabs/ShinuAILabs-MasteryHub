/**
 * Lab 1377: Async/Await Interview Questions
 *
 * CONCEPT:
 * Async/await is syntactic sugar over Promises, making asynchronous code
 * look synchronous. This is CRITICAL for SDET interviews as Playwright
 * is entirely async-based.
 *
 * BULLET POINTS:
 * - async functions always return a Promise
 * - await pauses execution until Promise resolves
 * - Error handling with try/catch
 * - Parallel execution with Promise.all()
 * - Sequential vs concurrent execution
 *
 * INTERVIEW FREQUENCY: ⭐⭐⭐⭐⭐ (Asked in 90% of interviews)
 */

// ============================================
// INTERVIEW QUESTION 1: What is async/await?
// ============================================

/**
 * Q: Explain async/await and how it differs from Promises.
 *
 * A: async/await is syntactic sugar over Promises:
 *    - async keyword makes a function return a Promise
 *    - await pauses execution until Promise resolves
 *    - Makes async code look synchronous (easier to read)
 *    - Error handling uses try/catch instead of .catch()
 */

// Promise-based (old way)
function fetchUserPromise(id: number): Promise<{ name: string }> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => { throw error; });
}

// Async/await (modern way)
async function fetchUserAsync(id: number): Promise<{ name: string }> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
}

// ============================================
// INTERVIEW QUESTION 2: Error Handling
// ============================================

/**
 * Q: How do you handle errors in async/await?
 *
 * A: Use try/catch blocks. You can also use .catch() on the
 *    returned Promise or create a wrapper function.
 */

// Method 1: try/catch
async function fetchWithTryCatch(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // Re-throw or handle
  }
}

// Method 2: Wrapper function (Go-style)
async function safeAsync<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error as Error];
  }
}

// Usage
async function example() {
  const [data, error] = await safeAsync(fetch('/api/data'));
  if (error) {
    console.error('Failed:', error);
    return;
  }
  console.log('Success:', data);
}

// ============================================
// INTERVIEW QUESTION 3: Sequential vs Parallel
// ============================================

/**
 * Q: What's the difference between sequential and parallel async execution?
 *
 * A: Sequential: Each await waits for the previous one (slower)
 *    Parallel: All Promises start at once, await all together (faster)
 */

// ❌ SLOW: Sequential execution (one after another)
async function sequentialFetch() {
  const user = await fetch('/api/user');      // Wait 1s
  const posts = await fetch('/api/posts');    // Wait 1s
  const comments = await fetch('/api/comments'); // Wait 1s
  // Total: ~3 seconds
}

// ✅ FAST: Parallel execution (all at once)
async function parallelFetch() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/comments'),
  ]);
  // Total: ~1 second (longest request)
}

// ============================================
// INTERVIEW QUESTION 4: Promise.all vs Promise.allSettled
// ============================================

/**
 * Q: What's the difference between Promise.all and Promise.allSettled?
 *
 * A: Promise.all: Fails fast if ANY promise rejects
 *    Promise.allSettled: Waits for ALL promises, returns status of each
 */

async function demonstratePromiseMethods() {
  const promises = [
    Promise.resolve('success'),
    Promise.reject('error'),
    Promise.resolve('another success'),
  ];

  // Promise.all - throws on first rejection
  try {
    await Promise.all(promises);
  } catch (e) {
    console.log('Promise.all failed:', e); // 'error'
  }

  // Promise.allSettled - returns all results
  const results = await Promise.allSettled(promises);
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 'success' },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 'another success' }
  // ]
}

// ============================================
// INTERVIEW QUESTION 5: Common Mistakes
// ============================================

/**
 * Q: What are common async/await mistakes?
 */

// ❌ MISTAKE 1: Forgetting await
async function mistake1() {
  const data = fetch('/api/data'); // Returns Promise, not data!
  console.log(data); // Promise { <pending> }
}

// ❌ MISTAKE 2: await in forEach (doesn't work as expected)
async function mistake2(urls: string[]) {
  urls.forEach(async (url) => {
    await fetch(url); // These run in parallel, not sequential!
  });
}

// ✅ CORRECT: Use for...of for sequential
async function correct2(urls: string[]) {
  for (const url of urls) {
    await fetch(url); // Sequential
  }
}

// ✅ CORRECT: Use Promise.all for parallel
async function correct2Parallel(urls: string[]) {
  await Promise.all(urls.map(url => fetch(url))); // Parallel
}

// ============================================
// INTERVIEW QUESTION 6: Playwright-Specific
// ============================================

/**
 * Q: How does async/await apply to Playwright?
 *
 * A: ALL Playwright operations are async. You must await them.
 */

import { test, expect } from '@playwright/test';

test('async/await in Playwright', async ({ page }) => {
  // Every Playwright action is async
  await page.goto('https://example.com');
  await page.getByRole('button').click();
  await expect(page.getByText('Success')).toBeVisible();

  // Parallel actions (when independent)
  const [response] = await Promise.all([
    page.waitForResponse('/api/data'),
    page.getByRole('button', { name: 'Load' }).click(),
  ]);
});

/**
 * EXERCISE:
 * 1. Convert a callback-based function to async/await
 * 2. Implement retry logic with async/await
 * 3. Create a rate limiter using async/await
 * 4. Handle multiple API calls with proper error handling
 */

/**
 * CODING CHALLENGE:
 * Implement a function that fetches data from multiple URLs
 * with a concurrency limit (e.g., max 3 at a time).
 */

async function fetchWithConcurrency<T>(
  urls: string[],
  maxConcurrent: number = 3
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const url of urls) {
    const promise = fetch(url)
      .then(r => r.json())
      .then(data => { results.push(data); });

    executing.push(promise);

    if (executing.length >= maxConcurrent) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * LEARNING:
 * - async/await makes async code readable
 * - Always handle errors with try/catch
 * - Use Promise.all for parallel execution
 * - Avoid common mistakes (forEach, forgetting await)
 *
 * ONE LINER:
 * "async/await: Write async code that reads like sync code."
 */

export { fetchUserAsync, safeAsync, fetchWithConcurrency };
