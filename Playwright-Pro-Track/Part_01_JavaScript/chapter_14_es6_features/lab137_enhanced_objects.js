/**
 * Lab 137: Enhanced Object Literals
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * ES6 object literal enhancements:
 * 
 * - Property shorthand
 * - Method shorthand
 * - Computed property names
 * - Object.assign()
 * - Object.entries/keys/values
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use property shorthand
 * 2. Define methods concisely
 * 3. Use computed properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Property Shorthand
console.log("--- Property Shorthand ---");

const name = "John";
const age = 30;
const email = "john@example.com";

// Old way
const userOld = {
    name: name,
    age: age,
    email: email
};

// ES6 shorthand
const user = { name, age, email };

console.log("User:", user);

// Solution 2: Method Shorthand
console.log("\n--- Method Shorthand ---");

// Old way
const calculatorOld = {
    add: function(a, b) {
        return a + b;
    }
};

// ES6 shorthand
const calculator = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a - b;
    },
    multiply(a, b) {
        return a * b;
    }
};

console.log("Add:", calculator.add(5, 3));
console.log("Subtract:", calculator.subtract(5, 3));

// Solution 3: Computed Property Names
console.log("\n--- Computed Properties ---");

const propName = "dynamicKey";
const prefix = "user";

const obj = {
    [propName]: "dynamic value",
    [`${prefix}Name`]: "John",
    [`${prefix}Age`]: 30,
    ["method" + "Name"]() {
        return "computed method";
    }
};

console.log("Object:", obj);
console.log("Method:", obj.methodName());

// Solution 4: Dynamic Object Creation
console.log("\n--- Dynamic Creation ---");

function createObject(key, value) {
    return { [key]: value };
}

console.log(createObject("name", "John"));
console.log(createObject("count", 42));

// Build object from array
const pairs = [["a", 1], ["b", 2], ["c", 3]];
const fromPairs = pairs.reduce((obj, [key, value]) => {
    return { ...obj, [key]: value };
}, {});

console.log("From pairs:", fromPairs);

// Solution 5: Object.assign
console.log("\n--- Object.assign ---");

const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { d: 5 };

const merged = Object.assign({}, target, source1, source2);
console.log("Merged:", merged);
console.log("Target unchanged:", target);

// Clone object
const clone = Object.assign({}, user);
console.log("Clone:", clone);

// Solution 6: Object.keys/values/entries
console.log("\n--- keys/values/entries ---");

const person = { name: "John", age: 30, city: "NYC" };

console.log("Keys:", Object.keys(person));
console.log("Values:", Object.values(person));
console.log("Entries:", Object.entries(person));

// Iterate with entries
for (const [key, value] of Object.entries(person)) {
    console.log(`${key}: ${value}`);
}

// Solution 7: Object.fromEntries
console.log("\n--- Object.fromEntries ---");

const entries = [["name", "John"], ["age", 30]];
const fromEntries = Object.fromEntries(entries);
console.log("From entries:", fromEntries);

// Transform object
const prices = { apple: 1.5, banana: 0.75, orange: 2.0 };
const doubled = Object.fromEntries(
    Object.entries(prices).map(([key, value]) => [key, value * 2])
);
console.log("Doubled prices:", doubled);

// Solution 8: Getters and Setters
console.log("\n--- Getters/Setters ---");

const account = {
    _balance: 1000,
    
    get balance() {
        return `$${this._balance.toFixed(2)}`;
    },
    
    set balance(value) {
        if (value < 0) throw new Error("Balance cannot be negative");
        this._balance = value;
    },
    
    deposit(amount) {
        this._balance += amount;
    }
};

console.log("Balance:", account.balance);
account.deposit(500);
console.log("After deposit:", account.balance);

// Solution 9: Symbol Properties
console.log("\n--- Symbol Properties ---");

const id = Symbol("id");
const secret = Symbol("secret");

const userWithSymbols = {
    name: "John",
    [id]: 12345,
    [secret]: "hidden"
};

console.log("User:", userWithSymbols);
console.log("ID:", userWithSymbols[id]);
console.log("Keys:", Object.keys(userWithSymbols)); // Symbols not included

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Factory function
function createPerson(name, age, occupation) {
    return {
        name,
        age,
        occupation,
        introduce() {
            return `I'm ${this.name}, a ${this.age}-year-old ${this.occupation}`;
        }
    };
}

const john = createPerson("John", 30, "developer");
console.log(john.introduce());

// Config builder
function buildConfig(env) {
    const base = { debug: false, timeout: 5000 };
    const envConfig = {
        development: { debug: true, apiUrl: "http://localhost:3000" },
        production: { apiUrl: "https://api.example.com" }
    };
    
    return { ...base, ...envConfig[env] };
}

console.log("Dev config:", buildConfig("development"));
console.log("Prod config:", buildConfig("production"));

