# Part 12: Async/Await

## 📚 Overview
Async/await is syntactic sugar over promises, making async code look and behave like synchronous code.

---

## 🎯 Key Concepts

### 1. Async Functions

```javascript
// Async function declaration
async function fetchData() {
  return "data";  // Automatically wrapped in Promise
}

// Async function expression
const fetchData = async function() {
  return "data";
};

// Async arrow function
const fetchData = async () => {
  return "data";
};

// Async method
const obj = {
  async getData() {
    return "data";
  }
};

// All return promises
fetchData().then(data => console.log(data));
```

### 2. Await Keyword

```javascript
async function getUser() {
  // await pauses execution until promise resolves
  const response = await fetch("/api/user");
  const user = await response.json();
  return user;
}

// Equivalent with promises
function getUser() {
  return fetch("/api/user")
    .then(response => response.json());
}

// await can only be used inside async functions
// (or at top level in modules)
```

### 3. Error Handling

```javascript
// Try/catch
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;  // Re-throw if needed
  } finally {
    console.log("Cleanup");
  }
}

// Or handle at call site
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 4. Sequential vs Parallel

```javascript
// Sequential - one after another (slower)
async function sequential() {
  const user = await fetchUser();      // Wait
  const orders = await fetchOrders();  // Then wait
  const products = await fetchProducts(); // Then wait
  return { user, orders, products };
}

// Parallel - all at once (faster)
async function parallel() {
  const [user, orders, products] = await Promise.all([
    fetchUser(),
    fetchOrders(),
    fetchProducts()
  ]);
  return { user, orders, products };
}

// Start parallel, await later
async function parallelStart() {
  const userPromise = fetchUser();
  const ordersPromise = fetchOrders();
  
  // Do other work...
  
  const user = await userPromise;
  const orders = await ordersPromise;
}
```

### 5. Loops with Async

```javascript
// Sequential processing
async function processSequential(items) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }
  return results;
}

// Parallel processing
async function processParallel(items) {
  const results = await Promise.all(
    items.map(item => processItem(item))
  );
  return results;
}

// forEach doesn't work with await!
// DON'T DO THIS:
items.forEach(async (item) => {
  await processItem(item);  // Won't wait!
});
```

### 6. Real-World Patterns

```javascript
// Fetch with timeout
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Retry logic
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * Math.pow(2, i));  // Exponential backoff
    }
  }
}

// Rate limiting
async function rateLimitedFetch(urls, concurrency = 3) {
  const results = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(url => fetch(url).then(r => r.json()))
    );
    results.push(...batchResults);
  }
  return results;
}
```

### 7. Async Iteration

```javascript
// Async generator
async function* asyncGenerator() {
  yield await fetchData(1);
  yield await fetchData(2);
  yield await fetchData(3);
}

// for await...of
async function processStream() {
  for await (const data of asyncGenerator()) {
    console.log(data);
  }
}

// Async iterator
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let i = 0;
    return {
      async next() {
        if (i < 3) {
          const value = await fetchData(i++);
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
};
```

### 8. Common Mistakes

```javascript
// ❌ Forgetting await
async function bad() {
  const data = fetch("/api");  // Returns promise, not data!
  console.log(data);  // Promise { <pending> }
}

// ✅ Using await
async function good() {
  const response = await fetch("/api");
  const data = await response.json();
  console.log(data);
}

// ❌ Unnecessary async
async function unnecessary() {
  return await somePromise;  // Just return somePromise
}

// ✅ Just return the promise
function better() {
  return somePromise;
}

// ❌ Not handling errors
async function noErrorHandling() {
  const data = await riskyOperation();  // Might throw!
}
```

---

## 💻 Practice Exercises

1. Convert promise chains to async/await
2. Implement parallel data fetching
3. Build retry mechanism
4. Create rate-limited API calls
5. Handle multiple error scenarios

---

## ✅ Best Practices

- ✅ Use try/catch for error handling
- ✅ Use Promise.all for parallel operations
- ✅ Use for...of for sequential async loops
- ✅ Always await or return promises
- ❌ Don't use forEach with async
- ❌ Don't forget error handling

---

## 📝 Quick Reference

```javascript
// Async function
async function fn() {
  const result = await promise;
  return result;
}

// Error handling
try {
  await riskyOperation();
} catch (error) {
  handleError(error);
}

// Parallel
const [a, b] = await Promise.all([p1, p2]);

// Sequential loop
for (const item of items) {
  await processItem(item);
}
```

