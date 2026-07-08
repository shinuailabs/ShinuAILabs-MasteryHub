/**
 * Lab 065: The 'this' Keyword
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * 'this' refers to the execution context.
 * 
 * Rules:
 * 1. Global: window (browser) or undefined (strict)
 * 2. Object method: the object
 * 3. Constructor: new instance
 * 4. Event handler: element
 * 5. Arrow function: lexical (inherited)
 * 6. call/apply/bind: explicitly set
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand 'this' in different contexts
 * 2. Use call, apply, bind
 * 3. Handle 'this' in callbacks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Global Context
console.log("--- Global Context ---");

function showThis() {
    console.log("this:", this);
}

// In Node.js, global this is the module
console.log("Global this:", typeof this);

// Solution 2: Object Method
console.log("\n--- Object Method ---");

const person = {
    name: "Alice",
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    },
    getThis() {
        return this;
    }
};

person.greet();
console.log("this === person:", person.getThis() === person);

// Solution 3: Lost 'this'
console.log("\n--- Lost 'this' ---");

const greet = person.greet;
// greet(); // Error or undefined - 'this' is lost!

// Solution 4: Arrow Functions
console.log("\n--- Arrow Functions ---");

const obj = {
    name: "Bob",
    
    // Regular method
    regularMethod() {
        console.log("Regular:", this.name);
    },
    
    // Arrow (inherits 'this' from enclosing scope)
    arrowMethod: () => {
        console.log("Arrow:", this.name); // undefined
    },
    
    // Arrow in callback (useful!)
    delayedGreet() {
        setTimeout(() => {
            console.log("Delayed:", this.name); // Works!
        }, 100);
    }
};

obj.regularMethod();
obj.arrowMethod();
obj.delayedGreet();

// Solution 5: call()
console.log("\n--- call() ---");

function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const user1 = { name: "Charlie" };
const user2 = { name: "Diana" };

introduce.call(user1, "Hello", "!");
introduce.call(user2, "Hi", ".");

// Solution 6: apply()
console.log("\n--- apply() ---");

// Same as call, but arguments as array
introduce.apply(user1, ["Hey", "!!"]);

// Useful for spreading arguments
const args = ["Greetings", "..."];
introduce.apply(user2, args);

// Solution 7: bind()
console.log("\n--- bind() ---");

// Returns new function with bound 'this'
const boundGreet = introduce.bind(user1);
boundGreet("Howdy", "!");

// Partial application
const greetCharlie = introduce.bind(user1, "Hello");
greetCharlie("?");

// Solution 8: Fixing 'this' in Callbacks
console.log("\n--- Fixing Callbacks ---");

const counter = {
    count: 0,
    
    // Problem: 'this' lost in callback
    incrementBad() {
        setTimeout(function() {
            // this.count++; // Error!
        }, 100);
    },
    
    // Solution 1: Arrow function
    incrementArrow() {
        setTimeout(() => {
            this.count++;
            console.log("Arrow count:", this.count);
        }, 100);
    },
    
    // Solution 2: bind
    incrementBind() {
        setTimeout(function() {
            this.count++;
            console.log("Bind count:", this.count);
        }.bind(this), 200);
    },
    
    // Solution 3: Store reference
    incrementRef() {
        const self = this;
        setTimeout(function() {
            self.count++;
            console.log("Ref count:", self.count);
        }, 300);
    }
};

counter.incrementArrow();
counter.incrementBind();
counter.incrementRef();

// Solution 9: Constructor 'this'
console.log("\n--- Constructor ---");

function Person(name) {
    this.name = name;
    this.greet = function() {
        console.log(`Hi, I'm ${this.name}`);
    };
}

const eve = new Person("Eve");
eve.greet();

// Solution 10: Class 'this'
console.log("\n--- Class ---");

class User {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        console.log(`Hello from ${this.name}`);
    }
    
    // Arrow method (bound to instance)
    greetArrow = () => {
        console.log(`Arrow from ${this.name}`);
    }
}

const frank = new User("Frank");
frank.greet();

// Arrow method keeps 'this' even when extracted
const extractedGreet = frank.greetArrow;
extractedGreet(); // Works!

// Solution 11: Summary
console.log("\n--- Summary ---");
console.log("1. Object method: this = object");
console.log("2. Arrow function: this = enclosing scope");
console.log("3. call/apply: this = first argument");
console.log("4. bind: returns function with bound this");
console.log("5. Constructor/class: this = new instance");

