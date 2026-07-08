# Part 11: Async - Callbacks & Promises

## 📚 Overview
JavaScript is single-threaded but handles async operations through callbacks and promises.

---

## 🎯 Key Concepts

### 1. Callbacks

```javascript
// Basic callback
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "John" };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log("Received:", data);
});

// Error-first callback pattern
function readFile(path, callback) {
  setTimeout(() => {
    if (!path) {
      callback(new Error("Path required"), null);
    } else {
      callback(null, "File contents");
    }
  }, 1000);
}

readFile("file.txt", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
});
```

### 2. Callback Hell (Problem)

```javascript
// Nested callbacks - hard to read and maintain
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      getShippingInfo(details.shippingId, (shipping) => {
        console.log(shipping);
        // More nesting...
      });
    });
  });
});
```

### 3. Promise Basics

```javascript
// Creating a promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve({ id: 1, name: "John" });
    } else {
      reject(new Error("Failed to fetch"));
    }
  }, 1000);
});

// Using a promise
promise
  .then(data => console.log("Success:", data))
  .catch(error => console.error("Error:", error))
  .finally(() => console.log("Done"));
```

### 4. Promise States

```javascript
// Pending - initial state
// Fulfilled - operation completed successfully
// Rejected - operation failed

const pending = new Promise(() => {});  // Stays pending
const fulfilled = Promise.resolve("value");
const rejected = Promise.reject(new Error("error"));

// Check state (not directly accessible)
// Use .then() and .catch() to handle states
```

### 5. Promise Chaining

```javascript
// Chain .then() calls
fetchUser(userId)
  .then(user => fetchOrders(user.id))
  .then(orders => fetchOrderDetails(orders[0].id))
  .then(details => fetchShippingInfo(details.shippingId))
  .then(shipping => console.log(shipping))
  .catch(error => console.error("Error:", error));

// Return values are wrapped in promises
Promise.resolve(1)
  .then(x => x + 1)      // Returns 2
  .then(x => x * 2)      // Returns 4
  .then(x => console.log(x));  // Logs 4
```

### 6. Promise Static Methods

```javascript
// Promise.all - wait for all (fail fast)
Promise.all([promise1, promise2, promise3])
  .then(([result1, result2, result3]) => {
    console.log("All completed");
  })
  .catch(error => console.error("One failed"));

// Promise.allSettled - wait for all (no fail fast)
Promise.allSettled([promise1, promise2])
  .then(results => {
    results.forEach(result => {
      if (result.status === "fulfilled") {
        console.log(result.value);
      } else {
        console.log(result.reason);
      }
    });
  });

// Promise.race - first to settle
Promise.race([promise1, promise2])
  .then(firstResult => console.log(firstResult));

// Promise.any - first to fulfill
Promise.any([promise1, promise2])
  .then(firstSuccess => console.log(firstSuccess))
  .catch(error => console.log("All rejected"));
```

### 7. Creating Promises

```javascript
// Wrap callback-based function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wrap fetch
function fetchJSON(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    });
}

// Promisify callback function
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}
```

### 8. Fetch API

```javascript
// Basic fetch
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// With options
fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "John" })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 💻 Practice Exercises

1. Convert callbacks to promises
2. Chain multiple async operations
3. Use Promise.all for parallel requests
4. Implement retry logic
5. Build a simple fetch wrapper

---

## ✅ Best Practices

- ✅ Always handle errors with .catch()
- ✅ Return promises in .then()
- ✅ Use Promise.all for parallel operations
- ✅ Prefer promises over callbacks
- ❌ Don't nest .then() calls
- ❌ Don't forget to return in chains

---

## 📝 Quick Reference

```javascript
// Create promise
new Promise((resolve, reject) => { })

// Use promise
promise
  .then(result => { })
  .catch(error => { })
  .finally(() => { })

// Static methods
Promise.resolve(value)
Promise.reject(error)
Promise.all([p1, p2])
Promise.race([p1, p2])
Promise.allSettled([p1, p2])
```

