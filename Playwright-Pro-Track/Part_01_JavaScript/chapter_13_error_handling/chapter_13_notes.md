# Part 13: Error Handling

## 📚 Overview
Proper error handling makes applications robust and debuggable. JavaScript provides try/catch and Error objects.

---

## 🎯 Key Concepts

### 1. Try/Catch/Finally

```javascript
try {
  // Code that might throw
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  // Handle the error
  console.error("Error:", error.message);
} finally {
  // Always runs (cleanup)
  console.log("Cleanup complete");
}

// Catch is optional with finally
try {
  doSomething();
} finally {
  cleanup();
}
```

### 2. Error Object

```javascript
// Error properties
const error = new Error("Something went wrong");
error.name;     // "Error"
error.message;  // "Something went wrong"
error.stack;    // Stack trace

// Built-in error types
new Error("Generic error");
new TypeError("Type mismatch");
new ReferenceError("Variable not defined");
new SyntaxError("Invalid syntax");
new RangeError("Value out of range");
new URIError("Invalid URI");

// Throwing errors
throw new Error("Something went wrong");
throw new TypeError("Expected a string");
```

### 3. Custom Errors

```javascript
// Custom error class
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

// Using custom errors
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError("Email required", "email");
  }
  if (!user.name) {
    throw new ValidationError("Name required", "name");
  }
}

// Catching specific errors
try {
  validateUser({});
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Field ${error.field}: ${error.message}`);
  } else {
    throw error;  // Re-throw unknown errors
  }
}
```

### 4. Error Handling Patterns

```javascript
// Guard clauses
function processUser(user) {
  if (!user) throw new Error("User required");
  if (!user.id) throw new Error("User ID required");
  // Process user...
}

// Default values
function greet(name = "Guest") {
  console.log(`Hello, ${name}`);
}

// Optional chaining
const city = user?.address?.city ?? "Unknown";

// Nullish coalescing
const value = input ?? defaultValue;

// Error boundaries (conceptual)
function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
```

### 5. Async Error Handling

```javascript
// With promises
fetchData()
  .then(data => processData(data))
  .catch(error => {
    console.error("Error:", error);
  });

// With async/await
async function getData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;  // Re-throw or return default
  }
}

// Global unhandled rejection handler
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled rejection:", event.reason);
  event.preventDefault();
});
```

### 6. Validation

```javascript
// Input validation
function validateEmail(email) {
  if (typeof email !== "string") {
    throw new TypeError("Email must be a string");
  }
  if (!email.includes("@")) {
    throw new ValidationError("Invalid email format");
  }
  return true;
}

// Schema validation
function validateUser(user) {
  const errors = [];
  
  if (!user.name || user.name.length < 2) {
    errors.push({ field: "name", message: "Name too short" });
  }
  if (!user.email || !user.email.includes("@")) {
    errors.push({ field: "email", message: "Invalid email" });
  }
  if (!user.age || user.age < 0 || user.age > 150) {
    errors.push({ field: "age", message: "Invalid age" });
  }
  
  if (errors.length > 0) {
    const error = new ValidationError("Validation failed");
    error.errors = errors;
    throw error;
  }
  
  return true;
}
```

### 7. Logging and Debugging

```javascript
// Console methods
console.log("Info message");
console.warn("Warning message");
console.error("Error message");
console.table([{ a: 1 }, { a: 2 }]);
console.group("Group");
console.log("Grouped message");
console.groupEnd();
console.time("timer");
// ... code ...
console.timeEnd("timer");

// Error logging service
function logError(error, context = {}) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  };
  
  // Send to logging service
  fetch("/api/logs", {
    method: "POST",
    body: JSON.stringify(errorData)
  }).catch(console.error);
}
```

### 8. Graceful Degradation

```javascript
// Feature detection
if (typeof localStorage !== "undefined") {
  localStorage.setItem("key", "value");
} else {
  // Fallback to cookies or memory
}

// Try multiple approaches
async function getData() {
  try {
    return await fetchFromAPI();
  } catch {
    try {
      return await fetchFromCache();
    } catch {
      return getDefaultData();
    }
  }
}

// Circuit breaker pattern
class CircuitBreaker {
  constructor(threshold = 5) {
    this.failures = 0;
    this.threshold = threshold;
    this.isOpen = false;
  }
  
  async execute(fn) {
    if (this.isOpen) {
      throw new Error("Circuit is open");
    }
    try {
      const result = await fn();
      this.failures = 0;
      return result;
    } catch (error) {
      this.failures++;
      if (this.failures >= this.threshold) {
        this.isOpen = true;
      }
      throw error;
    }
  }
}
```

---

## 💻 Practice Exercises

1. Create custom error classes
2. Implement input validation
3. Build error logging system
4. Handle async errors properly
5. Implement graceful degradation

---

## ✅ Best Practices

- ✅ Use specific error types
- ✅ Always catch async errors
- ✅ Log errors with context
- ✅ Fail fast, fail gracefully
- ❌ Don't swallow errors silently
- ❌ Don't catch errors you can't handle

---

## 📝 Quick Reference

```javascript
// Try/catch
try { } catch (e) { } finally { }

// Throw
throw new Error("message")

// Custom error
class MyError extends Error { }

// Async error handling
try {
  await asyncFn();
} catch (e) { }

// Check error type
if (e instanceof TypeError) { }
```

