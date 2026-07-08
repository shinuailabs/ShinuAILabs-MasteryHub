/**
 * Lab 061: Object Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Objects are collections of key-value pairs.
 * 
 * Key features:
 * - Properties (data)
 * - Methods (functions)
 * - Dynamic (can add/remove properties)
 * - Reference type
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create objects
 * 2. Access and modify properties
 * 3. Add methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating Objects
console.log("--- Creating Objects ---");

// Object literal (preferred)
const person = {
    name: "Alice",
    age: 25,
    city: "NYC"
};
console.log("Person:", person);

// Object constructor
const obj = new Object();
obj.key = "value";
console.log("Constructor:", obj);

// Object.create
const proto = { greet() { return "Hello"; } };
const created = Object.create(proto);
created.name = "Bob";
console.log("Created:", created.name, created.greet());

// Solution 2: Accessing Properties
console.log("\n--- Accessing Properties ---");

// Dot notation
console.log("Dot notation:", person.name);

// Bracket notation
console.log("Bracket notation:", person["age"]);

// Dynamic key
const key = "city";
console.log("Dynamic key:", person[key]);

// Nested access
const user = {
    profile: {
        name: "Charlie",
        address: {
            city: "LA"
        }
    }
};
console.log("Nested:", user.profile.address.city);

// Solution 3: Modifying Properties
console.log("\n--- Modifying Properties ---");

const car = { brand: "Toyota", year: 2020 };
console.log("Original:", car);

// Update
car.year = 2021;
console.log("Updated:", car);

// Add new property
car.color = "blue";
console.log("Added:", car);

// Delete property
delete car.color;
console.log("Deleted:", car);

// Solution 4: Property Shorthand
console.log("\n--- Property Shorthand ---");

const name = "Diana";
const age = 30;

// Old way
const person1 = { name: name, age: age };

// Shorthand (ES6)
const person2 = { name, age };
console.log("Shorthand:", person2);

// Solution 5: Computed Property Names
console.log("\n--- Computed Properties ---");

const propName = "dynamicKey";
const obj2 = {
    [propName]: "dynamic value",
    ["key" + 1]: "key1 value",
    [`computed_${Date.now()}`]: "timestamp key"
};
console.log("Computed:", obj2);

// Solution 6: Methods
console.log("\n--- Methods ---");

const calculator = {
    value: 0,
    
    // Method shorthand
    add(n) {
        this.value += n;
        return this;
    },
    
    subtract(n) {
        this.value -= n;
        return this;
    },
    
    getResult() {
        return this.value;
    }
};

// Method chaining
calculator.add(10).subtract(3).add(5);
console.log("Result:", calculator.getResult());

// Solution 7: Checking Properties
console.log("\n--- Checking Properties ---");

const obj3 = { a: 1, b: undefined };

// in operator
console.log("'a' in obj:", "a" in obj3);
console.log("'c' in obj:", "c" in obj3);

// hasOwnProperty
console.log("hasOwnProperty('a'):", obj3.hasOwnProperty("a"));

// Checking for undefined (careful!)
console.log("obj.b !== undefined:", obj3.b !== undefined); // false!
console.log("'b' in obj:", "b" in obj3); // true

// Solution 8: Object.keys/values/entries
console.log("\n--- Keys/Values/Entries ---");

const data = { x: 1, y: 2, z: 3 };

console.log("Keys:", Object.keys(data));
console.log("Values:", Object.values(data));
console.log("Entries:", Object.entries(data));

// Iterate
for (const [key, value] of Object.entries(data)) {
    console.log(`${key}: ${value}`);
}

// Solution 9: Reference Behavior
console.log("\n--- Reference Behavior ---");

const original = { a: 1, b: 2 };
const reference = original;
const copy = { ...original };

reference.a = 100;
console.log("Original:", original); // Changed!
console.log("Reference:", reference);
console.log("Copy:", copy); // Unchanged

