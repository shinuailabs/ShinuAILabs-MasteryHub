/**
 * Lab 138: Symbols
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Symbols are unique, immutable identifiers:
 * 
 * - Create unique property keys
 * - Well-known symbols
 * - Symbol registry
 * - Hidden properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create and use symbols
 * 2. Use well-known symbols
 * 3. Implement custom iterators
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating Symbols
console.log("--- Creating Symbols ---");

const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol("description");

console.log("sym1 === sym2:", sym1 === sym2); // false - always unique
console.log("Symbol description:", sym3.description);
console.log("Symbol toString:", sym3.toString());

// Solution 2: Symbols as Property Keys
console.log("\n--- Symbol Properties ---");

const id = Symbol("id");
const secret = Symbol("secret");

const user = {
    name: "John",
    [id]: 12345,
    [secret]: "hidden data"
};

console.log("User:", user);
console.log("ID:", user[id]);
console.log("Secret:", user[secret]);

// Symbols are not enumerable
console.log("Keys:", Object.keys(user));
console.log("Symbol keys:", Object.getOwnPropertySymbols(user));

// Solution 3: Symbol Registry
console.log("\n--- Symbol Registry ---");

// Global symbol registry
const globalSym1 = Symbol.for("app.id");
const globalSym2 = Symbol.for("app.id");

console.log("Same symbol:", globalSym1 === globalSym2); // true

// Get key from symbol
console.log("Key:", Symbol.keyFor(globalSym1));

// Local symbols don't have keys
const localSym = Symbol("local");
console.log("Local key:", Symbol.keyFor(localSym)); // undefined

// Solution 4: Well-Known Symbols
console.log("\n--- Well-Known Symbols ---");

// Symbol.iterator
const iterable = {
    data: [1, 2, 3],
    [Symbol.iterator]() {
        let index = 0;
        const data = this.data;
        return {
            next() {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                return { done: true };
            }
        };
    }
};

console.log("Iterable:", [...iterable]);

// Solution 5: Symbol.toStringTag
console.log("\n--- Symbol.toStringTag ---");

class MyClass {
    get [Symbol.toStringTag]() {
        return "MyClass";
    }
}

const instance = new MyClass();
console.log("toString:", Object.prototype.toString.call(instance));

// Solution 6: Symbol.toPrimitive
console.log("\n--- Symbol.toPrimitive ---");

const money = {
    amount: 100,
    currency: "USD",
    
    [Symbol.toPrimitive](hint) {
        if (hint === "number") {
            return this.amount;
        }
        if (hint === "string") {
            return `${this.currency} ${this.amount}`;
        }
        return this.amount;
    }
};

console.log("Number:", +money);
console.log("String:", `${money}`);
console.log("Default:", money + 0);

// Solution 7: Private-like Properties
console.log("\n--- Private-like Properties ---");

const _private = Symbol("private");

class SecureClass {
    constructor(publicData, privateData) {
        this.publicData = publicData;
        this[_private] = privateData;
    }
    
    getPrivate() {
        return this[_private];
    }
}

const secure = new SecureClass("public", "secret");
console.log("Public:", secure.publicData);
console.log("Private via method:", secure.getPrivate());
console.log("Keys:", Object.keys(secure));

// Solution 8: Symbol.hasInstance
console.log("\n--- Symbol.hasInstance ---");

class MyArray {
    static [Symbol.hasInstance](instance) {
        return Array.isArray(instance);
    }
}

console.log("[] instanceof MyArray:", [] instanceof MyArray);
console.log("{} instanceof MyArray:", {} instanceof MyArray);

// Solution 9: Symbol.species
console.log("\n--- Symbol.species ---");

class MyArray2 extends Array {
    static get [Symbol.species]() {
        return Array; // Return Array instead of MyArray2
    }
}

const myArr = new MyArray2(1, 2, 3);
const mapped = myArr.map(x => x * 2);

console.log("myArr instanceof MyArray2:", myArr instanceof MyArray2);
console.log("mapped instanceof MyArray2:", mapped instanceof MyArray2);
console.log("mapped instanceof Array:", mapped instanceof Array);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Unique event types
const Events = {
    CLICK: Symbol("click"),
    HOVER: Symbol("hover"),
    SUBMIT: Symbol("submit")
};

function handleEvent(eventType) {
    switch (eventType) {
        case Events.CLICK:
            return "Handling click";
        case Events.HOVER:
            return "Handling hover";
        case Events.SUBMIT:
            return "Handling submit";
        default:
            return "Unknown event";
    }
}

console.log(handleEvent(Events.CLICK));

// Metadata storage
const metadata = Symbol("metadata");

function addMetadata(obj, data) {
    obj[metadata] = data;
    return obj;
}

function getMetadata(obj) {
    return obj[metadata];
}

const item = addMetadata({ name: "Item" }, { created: new Date() });
console.log("Item:", item);
console.log("Metadata:", getMetadata(item));

