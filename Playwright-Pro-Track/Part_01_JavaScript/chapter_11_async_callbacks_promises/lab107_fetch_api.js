/**
 * Lab 107: Fetch API
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The Fetch API provides a modern way to make HTTP requests.
 * 
 * Key features:
 * - Promise-based
 * - Supports various HTTP methods
 * - Handles headers and body
 * - Works with JSON, FormData, etc.
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Make GET and POST requests
 * 2. Handle responses and errors
 * 3. Work with headers and body
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: These examples work in browser or Node.js 18+

// Solution 1: Basic GET Request
console.log("--- Basic GET ---");

/*
fetch("https://api.example.com/data")
    .then(response => response.json())
    .then(data => console.log("Data:", data))
    .catch(error => console.error("Error:", error));
*/

// Simulated fetch for demonstration
function simulatedFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (url.includes("error")) {
                reject(new Error("Network error"));
            } else {
                resolve({
                    ok: true,
                    status: 200,
                    statusText: "OK",
                    headers: new Map([["content-type", "application/json"]]),
                    json: () => Promise.resolve({ url, method: options.method || "GET" }),
                    text: () => Promise.resolve(JSON.stringify({ url }))
                });
            }
        }, 50);
    });
}

simulatedFetch("https://api.example.com/users")
    .then(response => response.json())
    .then(data => console.log("GET result:", data));

// Solution 2: Checking Response Status
console.log("\n--- Response Status ---");

function fetchWithCheck(url) {
    return simulatedFetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

fetchWithCheck("https://api.example.com/data")
    .then(data => console.log("Checked:", data))
    .catch(error => console.log("Error:", error.message));

// Solution 3: POST Request
console.log("\n--- POST Request ---");

/*
fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "John",
        email: "john@example.com"
    })
})
.then(response => response.json())
.then(data => console.log("Created:", data));
*/

simulatedFetch("https://api.example.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "John" })
})
.then(response => response.json())
.then(data => console.log("POST result:", data));

// Solution 4: Request Headers
console.log("\n--- Request Headers ---");

/*
fetch("https://api.example.com/protected", {
    headers: {
        "Authorization": "Bearer token123",
        "Accept": "application/json",
        "X-Custom-Header": "value"
    }
});
*/

// Solution 5: Handling Different Response Types
console.log("\n--- Response Types ---");

/*
// JSON
fetch(url).then(r => r.json());

// Text
fetch(url).then(r => r.text());

// Blob (binary)
fetch(url).then(r => r.blob());

// ArrayBuffer
fetch(url).then(r => r.arrayBuffer());

// FormData
fetch(url).then(r => r.formData());
*/

// Solution 6: Fetch Wrapper
console.log("\n--- Fetch Wrapper ---");

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            }
        };
        
        if (options.body && typeof options.body === "object") {
            config.body = JSON.stringify(options.body);
        }
        
        const response = await simulatedFetch(url, config);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return response.json();
    }
    
    get(endpoint) {
        return this.request(endpoint);
    }
    
    post(endpoint, data) {
        return this.request(endpoint, { method: "POST", body: data });
    }
    
    put(endpoint, data) {
        return this.request(endpoint, { method: "PUT", body: data });
    }
    
    delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
    }
}

const api = new ApiClient("https://api.example.com");
api.get("/users").then(data => console.log("API GET:", data));
api.post("/users", { name: "Jane" }).then(data => console.log("API POST:", data));

// Solution 7: Abort Controller
console.log("\n--- Abort Controller ---");

/*
const controller = new AbortController();

fetch("https://api.example.com/data", {
    signal: controller.signal
})
.then(response => response.json())
.catch(error => {
    if (error.name === "AbortError") {
        console.log("Request was aborted");
    }
});

// Cancel the request
controller.abort();
*/

// Solution 8: Timeout with Fetch
console.log("\n--- Fetch Timeout ---");

function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return simulatedFetch(url, {
        ...options,
        signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
}

fetchWithTimeout("https://api.example.com/data", {}, 1000)
    .then(response => response.json())
    .then(data => console.log("With timeout:", data))
    .catch(error => console.log("Timeout error:", error.message));

// Solution 9: Retry Logic
console.log("\n--- Retry Logic ---");

async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await simulatedFetch(url, options);
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retry ${i + 1}/${retries}`);
            await new Promise(r => setTimeout(r, 100 * (i + 1)));
        }
    }
}

fetchWithRetry("https://api.example.com/data")
    .then(r => r.json())
    .then(data => console.log("With retry:", data));

