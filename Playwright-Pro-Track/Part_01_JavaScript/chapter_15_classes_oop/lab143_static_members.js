/**
 * Lab 143: Static Members
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Static properties and methods:
 * 
 * - Belong to class, not instances
 * - Called on class directly
 * - Useful for utilities
 * - Factory methods
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create static methods
 * 2. Use static properties
 * 3. Build factory methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Static Methods
console.log("--- Static Methods ---");

class MathUtils {
    static add(a, b) {
        return a + b;
    }
    
    static subtract(a, b) {
        return a - b;
    }
    
    static multiply(a, b) {
        return a * b;
    }
    
    static divide(a, b) {
        if (b === 0) throw new Error("Cannot divide by zero");
        return a / b;
    }
}

// Called on class, not instance
console.log("Add:", MathUtils.add(5, 3));
console.log("Multiply:", MathUtils.multiply(4, 7));

// Solution 2: Static Properties
console.log("\n--- Static Properties ---");

class Config {
    static VERSION = "1.0.0";
    static DEBUG = true;
    static API_URL = "https://api.example.com";
    
    static getFullVersion() {
        return `v${this.VERSION}`;
    }
}

console.log("Version:", Config.VERSION);
console.log("Full version:", Config.getFullVersion());
console.log("Debug:", Config.DEBUG);

// Solution 3: Instance Counter
console.log("\n--- Instance Counter ---");

class User {
    static count = 0;
    static users = [];
    
    constructor(name) {
        this.name = name;
        this.id = ++User.count;
        User.users.push(this);
    }
    
    static getCount() {
        return User.count;
    }
    
    static getAllUsers() {
        return User.users;
    }
    
    static findById(id) {
        return User.users.find(user => user.id === id);
    }
}

new User("John");
new User("Jane");
new User("Bob");

console.log("User count:", User.getCount());
console.log("All users:", User.getAllUsers().map(u => u.name));
console.log("Find by ID:", User.findById(2));

// Solution 4: Factory Methods
console.log("\n--- Factory Methods ---");

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    static fromArray([x, y]) {
        return new Point(x, y);
    }
    
    static fromObject({ x, y }) {
        return new Point(x, y);
    }
    
    static origin() {
        return new Point(0, 0);
    }
    
    static distance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }
    
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

const p1 = Point.fromArray([3, 4]);
const p2 = Point.fromObject({ x: 6, y: 8 });
const origin = Point.origin();

console.log("Point 1:", p1.toString());
console.log("Point 2:", p2.toString());
console.log("Origin:", origin.toString());
console.log("Distance:", Point.distance(p1, p2));

// Solution 5: Singleton Pattern
console.log("\n--- Singleton Pattern ---");

class Database {
    static instance = null;
    
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = "Connected";
        Database.instance = this;
    }
    
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    
    query(sql) {
        return `Executing: ${sql}`;
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log("Same instance:", db1 === db2);
console.log("Query:", db1.query("SELECT * FROM users"));

// Solution 6: Static Initialization Block
console.log("\n--- Static Initialization ---");

class AppConfig {
    static settings = {};
    
    static {
        // Static initialization block
        this.settings.env = "development";
        this.settings.port = 3000;
        this.settings.initialized = true;
        console.log("AppConfig initialized");
    }
    
    static get(key) {
        return this.settings[key];
    }
}

console.log("Env:", AppConfig.get("env"));
console.log("Port:", AppConfig.get("port"));

// Solution 7: Static in Inheritance
console.log("\n--- Static Inheritance ---");

class Animal {
    static kingdom = "Animalia";
    
    static describe() {
        return `Kingdom: ${this.kingdom}`;
    }
}

class Dog extends Animal {
    static species = "Canis familiaris";
    
    static describe() {
        return `${super.describe()}, Species: ${this.species}`;
    }
}

console.log("Animal:", Animal.describe());
console.log("Dog:", Dog.describe());

// Solution 8: Utility Class
console.log("\n--- Utility Class ---");

class StringUtils {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    static truncate(str, length, suffix = "...") {
        if (str.length <= length) return str;
        return str.slice(0, length) + suffix;
    }
    
    static slugify(str) {
        return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    }
    
    static reverse(str) {
        return str.split("").reverse().join("");
    }
}

console.log("Capitalize:", StringUtils.capitalize("hello"));
console.log("Truncate:", StringUtils.truncate("Hello World", 5));
console.log("Slugify:", StringUtils.slugify("Hello World!"));
console.log("Reverse:", StringUtils.reverse("Hello"));

// Solution 9: Registry Pattern
console.log("\n--- Registry Pattern ---");

class ComponentRegistry {
    static components = new Map();
    
    static register(name, component) {
        this.components.set(name, component);
    }
    
    static get(name) {
        return this.components.get(name);
    }
    
    static has(name) {
        return this.components.has(name);
    }
    
    static list() {
        return Array.from(this.components.keys());
    }
}

ComponentRegistry.register("Button", { render: () => "<button>" });
ComponentRegistry.register("Input", { render: () => "<input>" });

console.log("Components:", ComponentRegistry.list());
console.log("Has Button:", ComponentRegistry.has("Button"));

