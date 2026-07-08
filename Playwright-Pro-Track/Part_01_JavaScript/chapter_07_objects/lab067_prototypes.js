/**
 * Lab 067: Prototypes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript uses prototypal inheritance.
 * 
 * Key concepts:
 * - Every object has a prototype
 * - Properties are looked up the prototype chain
 * - Object.prototype is the root
 * - __proto__ vs prototype property
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand prototype chain
 * 2. Create objects with prototypes
 * 3. Add methods to prototypes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Prototype Chain
console.log("--- Prototype Chain ---");

const obj = { name: "Test" };

console.log("obj.toString():", obj.toString());
console.log("Has own toString:", obj.hasOwnProperty("toString"));
console.log("Prototype has toString:", Object.prototype.hasOwnProperty("toString"));

// Chain: obj -> Object.prototype -> null
console.log("Prototype:", Object.getPrototypeOf(obj) === Object.prototype);

// Solution 2: Creating with Prototype
console.log("\n--- Object.create ---");

const animal = {
    speak() {
        console.log(`${this.name} makes a sound`);
    }
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.bark = function() {
    console.log(`${this.name} barks!`);
};

dog.speak(); // Inherited
dog.bark();  // Own method

console.log("dog's prototype:", Object.getPrototypeOf(dog) === animal);

// Solution 3: Constructor Functions
console.log("\n--- Constructor Functions ---");

function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Add method to prototype (shared by all instances)
Person.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

Person.prototype.species = "Human";

const alice = new Person("Alice", 25);
const bob = new Person("Bob", 30);

alice.greet();
bob.greet();

console.log("Same greet method:", alice.greet === bob.greet);
console.log("Species:", alice.species);

// Solution 4: Prototype vs Instance Properties
console.log("\n--- Prototype vs Instance ---");

console.log("alice.hasOwnProperty('name'):", alice.hasOwnProperty("name"));
console.log("alice.hasOwnProperty('greet'):", alice.hasOwnProperty("greet"));
console.log("alice.hasOwnProperty('species'):", alice.hasOwnProperty("species"));

// Instance property shadows prototype
alice.species = "Homo Sapiens";
console.log("alice.species:", alice.species);
console.log("bob.species:", bob.species);

// Solution 5: Prototype Chain Lookup
console.log("\n--- Chain Lookup ---");

function Animal(name) {
    this.name = name;
}
Animal.prototype.eat = function() {
    console.log(`${this.name} eats`);
};

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log(`${this.name} barks`);
};

const rex = new Dog("Rex", "German Shepherd");
rex.eat();  // From Animal
rex.bark(); // From Dog

console.log("rex instanceof Dog:", rex instanceof Dog);
console.log("rex instanceof Animal:", rex instanceof Animal);

// Solution 6: Modifying Built-in Prototypes
console.log("\n--- Built-in Prototypes ---");

// Add method to all arrays (not recommended in production!)
Array.prototype.first = function() {
    return this[0];
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

const arr = [1, 2, 3, 4, 5];
console.log("First:", arr.first());
console.log("Last:", arr.last());

// Clean up
delete Array.prototype.first;
delete Array.prototype.last;

// Solution 7: Object.getPrototypeOf / setPrototypeOf
console.log("\n--- Get/Set Prototype ---");

const proto = { greet() { return "Hello"; } };
const obj2 = { name: "Test" };

Object.setPrototypeOf(obj2, proto);
console.log("Greeting:", obj2.greet());

// Solution 8: __proto__ (deprecated but common)
console.log("\n--- __proto__ ---");

const parent = { value: 42 };
const child = { name: "Child" };

child.__proto__ = parent;
console.log("Child value:", child.value);

// Solution 9: Checking Prototype
console.log("\n--- Checking Prototype ---");

console.log("isPrototypeOf:", animal.isPrototypeOf(dog));
console.log("instanceof:", dog instanceof Object);

// Solution 10: Prototype Best Practices
console.log("\n--- Best Practices ---");
console.log("1. Use classes (syntactic sugar over prototypes)");
console.log("2. Don't modify built-in prototypes");
console.log("3. Use Object.create for inheritance");
console.log("4. Put methods on prototype, data on instance");

