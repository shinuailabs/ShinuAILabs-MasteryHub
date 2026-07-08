/**
 * Lab 182: Optional Properties
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Optional interface properties:
 * 
 * - Optional property syntax
 * - Handling undefined
 * - Default values
 * - Nullish coalescing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Define optional properties
 * 2. Handle optional values safely
 * 3. Use default values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Optional Properties
console.log("--- Basic Optional Properties ---");

interface User {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    age?: number;
}

const user1: User = {
    id: 1,
    name: "John"
};

const user2: User = {
    id: 2,
    name: "Jane",
    email: "jane@example.com",
    age: 25
};

console.log("User 1:", user1);
console.log("User 2:", user2);

// Solution 2: Checking Optional Properties
console.log("\n--- Checking Optional Properties ---");

function printUserEmail(user: User): void {
    // Check if property exists
    if (user.email) {
        console.log("Email:", user.email);
    } else {
        console.log("No email provided");
    }
}

printUserEmail(user1);
printUserEmail(user2);

// Solution 3: Nullish Coalescing
console.log("\n--- Nullish Coalescing ---");

function getUserAge(user: User): number {
    // Use ?? for default value
    return user.age ?? 0;
}

function getUserEmail(user: User): string {
    return user.email ?? "No email";
}

console.log("User 1 age:", getUserAge(user1));
console.log("User 2 age:", getUserAge(user2));
console.log("User 1 email:", getUserEmail(user1));

// Solution 4: Optional Chaining
console.log("\n--- Optional Chaining ---");

interface Company {
    name: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
    };
}

const company1: Company = { name: "Tech Corp" };
const company2: Company = {
    name: "Big Corp",
    address: {
        city: "New York",
        country: "USA"
    }
};

// Safe access with ?.
console.log("Company 1 city:", company1.address?.city ?? "Unknown");
console.log("Company 2 city:", company2.address?.city ?? "Unknown");

// Solution 5: Default Values in Functions
console.log("\n--- Default Values ---");

interface Config {
    host?: string;
    port?: number;
    ssl?: boolean;
}

function createConnection(config: Config = {}): void {
    const host = config.host ?? "localhost";
    const port = config.port ?? 3000;
    const ssl = config.ssl ?? false;
    
    console.log(`Connecting to ${ssl ? "https" : "http"}://${host}:${port}`);
}

createConnection();
createConnection({ host: "example.com" });
createConnection({ host: "secure.com", port: 443, ssl: true });

// Solution 6: Destructuring with Defaults
console.log("\n--- Destructuring with Defaults ---");

interface Options {
    width?: number;
    height?: number;
    color?: string;
}

function createBox({ width = 100, height = 100, color = "black" }: Options = {}): void {
    console.log(`Box: ${width}x${height}, color: ${color}`);
}

createBox();
createBox({ width: 200 });
createBox({ width: 300, height: 150, color: "red" });

// Solution 7: Required vs Optional
console.log("\n--- Required vs Optional ---");

// Make all optional with Partial
type PartialUser = Partial<User>;

// Make all required with Required
type RequiredUser = Required<User>;

const partialUser: PartialUser = { name: "John" };
// const requiredUser: RequiredUser = { id: 1, name: "John" }; // Error: missing properties

console.log("Partial user:", partialUser);

// Solution 8: Optional in Nested Objects
console.log("\n--- Nested Optional ---");

interface Profile {
    user: User;
    settings?: {
        theme?: "light" | "dark";
        notifications?: boolean;
        language?: string;
    };
}

const profile: Profile = {
    user: { id: 1, name: "John" }
};

// Safe nested access
const theme = profile.settings?.theme ?? "light";
const notifications = profile.settings?.notifications ?? true;

console.log("Theme:", theme);
console.log("Notifications:", notifications);

// Solution 9: Optional Methods
console.log("\n--- Optional Methods ---");

interface Logger {
    log(message: string): void;
    warn?(message: string): void;
    error?(message: string): void;
}

const simpleLogger: Logger = {
    log(message) {
        console.log(`[LOG] ${message}`);
    }
};

const fullLogger: Logger = {
    log(message) { console.log(`[LOG] ${message}`); },
    warn(message) { console.log(`[WARN] ${message}`); },
    error(message) { console.log(`[ERROR] ${message}`); }
};

simpleLogger.log("Simple message");
fullLogger.warn?.("Warning message");

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface ApiRequest {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

function makeRequest(request: ApiRequest): void {
    const {
        url,
        method = "GET",
        headers = {},
        body,
        timeout = 5000
    } = request;
    
    console.log(`${method} ${url}`);
    console.log("Headers:", Object.keys(headers).length);
    console.log("Timeout:", timeout);
}

makeRequest({ url: "/api/users" });
makeRequest({
    url: "/api/users",
    method: "POST",
    body: { name: "John" },
    headers: { "Content-Type": "application/json" }
});

