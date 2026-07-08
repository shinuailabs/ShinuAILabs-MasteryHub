/**
 * Lab 195: Static Members
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Static class members:
 *
 * - Static properties
 * - Static methods
 * - Static blocks
 * - Singleton pattern
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create static members
 * 2. Use static methods
 * 3. Implement singleton
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Static Properties
console.log("--- Static Properties ---");

class Counter {
    static count: number = 0;
    static readonly MAX_COUNT: number = 100;

    constructor() {
        Counter.count++;
    }
}

new Counter();
new Counter();
new Counter();

console.log("Count:", Counter.count);
console.log("Max:", Counter.MAX_COUNT);

// Solution 2: Static Methods
console.log("\n--- Static Methods ---");

class MathUtils {
    static PI: number = 3.14159;

    static add(a: number, b: number): number {
        return a + b;
    }

    static multiply(a: number, b: number): number {
        return a * b;
    }

    static circleArea(radius: number): number {
        return MathUtils.PI * radius * radius;
    }
}

console.log("Add:", MathUtils.add(5, 3));
console.log("Circle area:", MathUtils.circleArea(5));

// Solution 3: Static Factory Methods
console.log("\n--- Factory Methods ---");

class User {
    private constructor(
        public id: number,
        public name: string,
        public email: string
    ) {}

    static create(name: string, email: string): User {
        return new User(Date.now(), name, email);
    }

    static fromJSON(json: string): User {
        const data = JSON.parse(json);
        return new User(data.id, data.name, data.email);
    }
}

const user1 = User.create("John", "john@example.com");
const user2 = User.fromJSON('{"id": 1, "name": "Jane", "email": "jane@example.com"}');

console.log("User 1:", user1);
console.log("User 2:", user2);

// Solution 4: Singleton Pattern
console.log("\n--- Singleton Pattern ---");

class Database {
    private static instance: Database;
    private connected: boolean = false;

    private constructor() {}

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    connect(): void {
        this.connected = true;
        console.log("Database connected");
    }

    isConnected(): boolean {
        return this.connected;
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
db1.connect();

console.log("Same instance:", db1 === db2);
console.log("DB2 connected:", db2.isConnected());

// Solution 5: Static with Access Modifiers
console.log("\n--- Static Access Modifiers ---");

class Config {
    private static settings: Map<string, string> = new Map();

    static set(key: string, value: string): void {
        Config.settings.set(key, value);
    }

    static get(key: string): string | undefined {
        return Config.settings.get(key);
    }

    static getAll(): Record<string, string> {
        return Object.fromEntries(Config.settings);
    }
}

Config.set("apiUrl", "https://api.example.com");
Config.set("timeout", "5000");

console.log("API URL:", Config.get("apiUrl"));
console.log("All config:", Config.getAll());

// Solution 6: Static Blocks
console.log("\n--- Static Blocks ---");

class AppConfig {
    static environment: string;
    static debug: boolean;

    static {
        // Static initialization block
        AppConfig.environment = process.env.NODE_ENV || "development";
        AppConfig.debug = AppConfig.environment === "development";
        console.log("AppConfig initialized");
    }
}

console.log("Environment:", AppConfig.environment);
console.log("Debug:", AppConfig.debug);

// Solution 7: Static and Instance Members
console.log("\n--- Static vs Instance ---");

class Product {
    static totalProducts: number = 0;

    id: number;

    constructor(public name: string, public price: number) {
        Product.totalProducts++;
        this.id = Product.totalProducts;
    }

    static getTotal(): number {
        return Product.totalProducts;
    }

    describe(): string {
        return `Product #${this.id}: ${this.name} - $${this.price}`;
    }
}

const p1 = new Product("Widget", 9.99);
const p2 = new Product("Gadget", 19.99);

console.log(p1.describe());
console.log(p2.describe());
console.log("Total products:", Product.getTotal());

// Solution 8: Static in Inheritance
console.log("\n--- Static Inheritance ---");

class Animal {
    static kingdom: string = "Animalia";

    static describe(): string {
        return `Kingdom: ${this.kingdom}`;
    }
}

class Dog extends Animal {
    static species: string = "Canis familiaris";

    static describe(): string {
        return `${super.describe()}, Species: ${this.species}`;
    }
}

console.log(Animal.describe());
console.log(Dog.describe());

// Solution 9: Utility Class Pattern
console.log("\n--- Utility Class ---");

class StringUtils {
    private constructor() {} // Prevent instantiation

    static capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static reverse(str: string): string {
        return str.split("").reverse().join("");
    }

    static truncate(str: string, length: number): string {
        return str.length > length ? str.slice(0, length) + "..." : str;
    }
}

console.log(StringUtils.capitalize("hello"));
console.log(StringUtils.reverse("hello"));
console.log(StringUtils.truncate("Hello World", 5));

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

class Logger {
    private static instance: Logger;
    private static logLevel: "debug" | "info" | "warn" | "error" = "info";

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    static setLogLevel(level: "debug" | "info" | "warn" | "error"): void {
        Logger.logLevel = level;
    }

    debug(message: string): void {
        if (Logger.logLevel === "debug") {
            console.log(`[DEBUG] ${message}`);
        }
    }

    info(message: string): void {
        if (["debug", "info"].includes(Logger.logLevel)) {
            console.log(`[INFO] ${message}`);
        }
    }

    warn(message: string): void {
        if (["debug", "info", "warn"].includes(Logger.logLevel)) {
            console.log(`[WARN] ${message}`);
        }
    }

    error(message: string): void {
        console.log(`[ERROR] ${message}`);
    }
}

const logger = Logger.getInstance();
Logger.setLogLevel("debug");
logger.debug("Debug message");
logger.info("Info message");
logger.error("Error message");
