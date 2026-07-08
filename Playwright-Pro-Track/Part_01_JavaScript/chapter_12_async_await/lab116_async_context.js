/**
 * Lab 116: Async Context and this
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing context in async functions:
 * 
 * - this binding in async methods
 * - Arrow functions preserve this
 * - bind() with async functions
 * - Class methods and async
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle this in async methods
 * 2. Use arrow functions correctly
 * 3. Bind context properly
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Solution 1: this in Async Methods
console.log("--- this in Async Methods ---");

const obj = {
    name: "MyObject",
    
    async greet() {
        await delay(50);
        console.log(`Hello from ${this.name}`);
    }
};

obj.greet();

// Solution 2: Lost this Context
console.log("\n--- Lost this Context ---");

const obj2 = {
    name: "Object2",
    
    async greet() {
        await delay(50);
        console.log(`Hello from ${this?.name || "undefined"}`);
    }
};

// This works
obj2.greet();

// This loses context
const greetFn = obj2.greet;
// greetFn(); // Would log "undefined"

// Solution 3: Arrow Functions Preserve this
console.log("\n--- Arrow Functions ---");

const obj3 = {
    name: "Object3",
    
    // Arrow function preserves this from enclosing scope
    greet: async () => {
        await delay(50);
        // Note: this refers to enclosing scope, not obj3
        console.log("Arrow function this:", typeof this);
    },
    
    // Regular method with arrow callback
    async process() {
        const items = [1, 2, 3];
        
        // Arrow preserves this
        await Promise.all(items.map(async (item) => {
            await delay(20);
            console.log(`${this.name} processing ${item}`);
        }));
    }
};

obj3.greet();
obj3.process();

// Solution 4: Binding Async Methods
console.log("\n--- Binding Methods ---");

class Service {
    constructor(name) {
        this.name = name;
        // Bind in constructor
        this.boundMethod = this.asyncMethod.bind(this);
    }
    
    async asyncMethod() {
        await delay(50);
        console.log(`Service: ${this.name}`);
    }
}

const service = new Service("MyService");
const method = service.boundMethod;
method(); // Works because it's bound

// Solution 5: Class Fields (Auto-bound)
console.log("\n--- Class Fields ---");

class ModernService {
    name = "ModernService";
    
    // Arrow function as class field - auto-bound
    asyncMethod = async () => {
        await delay(50);
        console.log(`Modern: ${this.name}`);
    };
}

const modern = new ModernService();
const modernMethod = modern.asyncMethod;
modernMethod(); // Works!

// Solution 6: Callback Context
console.log("\n--- Callback Context ---");

class DataFetcher {
    constructor() {
        this.data = [];
    }
    
    async fetchAll(urls) {
        // Using arrow function to preserve this
        const results = await Promise.all(
            urls.map(async (url) => {
                const data = await delay(30, { url, content: "data" });
                this.data.push(data); // this works
                return data;
            })
        );
        
        return results;
    }
}

const fetcher = new DataFetcher();
fetcher.fetchAll(["url1", "url2"]).then(() => {
    console.log("Fetched data:", fetcher.data);
});

// Solution 7: Event Handler Context
console.log("\n--- Event Handler Context ---");

class Button {
    constructor(label) {
        this.label = label;
    }
    
    // Arrow function for event handlers
    handleClick = async (event) => {
        await delay(50);
        console.log(`Button ${this.label} clicked`);
    };
}

const button = new Button("Submit");
// Simulating event
button.handleClick({ type: "click" });

// Solution 8: Async in forEach
console.log("\n--- Async in forEach ---");

class Processor {
    constructor() {
        this.results = [];
    }
    
    async processItems(items) {
        // forEach doesn't wait for async
        // items.forEach(async (item) => { ... }); // BAD
        
        // Use for...of instead
        for (const item of items) {
            await delay(20);
            this.results.push(item * 2);
        }
        
        console.log("Processed:", this.results);
    }
}

const processor = new Processor();
processor.processItems([1, 2, 3]);

// Solution 9: Preserving Context in Callbacks
console.log("\n--- Preserving Context ---");

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async request(endpoint) {
        await delay(50);
        return { url: `${this.baseUrl}${endpoint}` };
    }
    
    // Method that passes callback
    async withRetry(endpoint, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                // this.request preserves context
                return await this.request(endpoint);
            } catch (error) {
                if (i === retries - 1) throw error;
            }
        }
    }
}

const client = new ApiClient("https://api.example.com");
client.withRetry("/users").then(result => console.log("API result:", result));

// Solution 10: Async Factory Pattern
console.log("\n--- Async Factory ---");

class Database {
    constructor() {
        this.connected = false;
    }
    
    async connect() {
        await delay(50);
        this.connected = true;
        console.log("Database connected");
    }
    
    // Static async factory
    static async create() {
        const db = new Database();
        await db.connect();
        return db;
    }
}

Database.create().then(db => {
    console.log("DB connected:", db.connected);
});

