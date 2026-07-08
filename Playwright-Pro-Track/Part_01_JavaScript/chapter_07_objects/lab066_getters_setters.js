/**
 * Lab 066: Getters and Setters
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Getters and setters are special methods that get/set property values.
 * 
 * Benefits:
 * - Computed properties
 * - Validation on assignment
 * - Encapsulation
 * - Lazy evaluation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create getters and setters
 * 2. Add validation
 * 3. Create computed properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Getter
console.log("--- Basic Getter ---");

const person = {
    firstName: "Alice",
    lastName: "Smith",
    
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};

console.log("Full name:", person.fullName);
// Accessed like property, not method call

// Solution 2: Basic Setter
console.log("\n--- Basic Setter ---");

const user = {
    _name: "",
    
    get name() {
        return this._name;
    },
    
    set name(value) {
        this._name = value.trim();
    }
};

user.name = "  Bob  ";
console.log("Name:", user.name);

// Solution 3: Validation in Setter
console.log("\n--- Validation ---");

const account = {
    _balance: 0,
    
    get balance() {
        return this._balance;
    },
    
    set balance(value) {
        if (typeof value !== "number") {
            throw new Error("Balance must be a number");
        }
        if (value < 0) {
            throw new Error("Balance cannot be negative");
        }
        this._balance = value;
    }
};

account.balance = 100;
console.log("Balance:", account.balance);

try {
    account.balance = -50;
} catch (e) {
    console.log("Error:", e.message);
}

// Solution 4: Computed Properties
console.log("\n--- Computed Properties ---");

const rectangle = {
    width: 10,
    height: 5,
    
    get area() {
        return this.width * this.height;
    },
    
    get perimeter() {
        return 2 * (this.width + this.height);
    }
};

console.log("Area:", rectangle.area);
console.log("Perimeter:", rectangle.perimeter);

rectangle.width = 20;
console.log("New area:", rectangle.area);

// Solution 5: Setter with Side Effects
console.log("\n--- Side Effects ---");

const logger = {
    _logs: [],
    _value: null,
    
    get value() {
        return this._value;
    },
    
    set value(v) {
        this._logs.push({
            oldValue: this._value,
            newValue: v,
            timestamp: new Date().toISOString()
        });
        this._value = v;
    },
    
    get history() {
        return [...this._logs];
    }
};

logger.value = 1;
logger.value = 2;
logger.value = 3;
console.log("History:", logger.history);

// Solution 6: Read-Only Property
console.log("\n--- Read-Only ---");

const config = {
    _createdAt: new Date(),
    
    get createdAt() {
        return this._createdAt;
    }
    // No setter = read-only
};

console.log("Created:", config.createdAt);
config.createdAt = new Date(); // Silently fails
console.log("Still:", config.createdAt);

// Solution 7: Lazy Evaluation
console.log("\n--- Lazy Evaluation ---");

const expensive = {
    _cache: null,
    
    get computedValue() {
        if (this._cache === null) {
            console.log("Computing...");
            this._cache = Array.from({ length: 1000 }, (_, i) => i)
                .reduce((a, b) => a + b, 0);
        }
        return this._cache;
    }
};

console.log("First access:", expensive.computedValue);
console.log("Second access:", expensive.computedValue); // No "Computing..."

// Solution 8: Class Getters/Setters
console.log("\n--- Class Syntax ---");

class Circle {
    constructor(radius) {
        this._radius = radius;
    }
    
    get radius() {
        return this._radius;
    }
    
    set radius(value) {
        if (value <= 0) throw new Error("Radius must be positive");
        this._radius = value;
    }
    
    get diameter() {
        return this._radius * 2;
    }
    
    get area() {
        return Math.PI * this._radius ** 2;
    }
}

const circle = new Circle(5);
console.log("Radius:", circle.radius);
console.log("Diameter:", circle.diameter);
console.log("Area:", circle.area.toFixed(2));

// Solution 9: defineProperty
console.log("\n--- defineProperty ---");

const obj = { _temp: 0 };

Object.defineProperty(obj, "temperature", {
    get() {
        return this._temp;
    },
    set(celsius) {
        this._temp = celsius;
    },
    enumerable: true
});

Object.defineProperty(obj, "fahrenheit", {
    get() {
        return this._temp * 9/5 + 32;
    },
    set(f) {
        this._temp = (f - 32) * 5/9;
    },
    enumerable: true
});

obj.temperature = 100;
console.log("Celsius:", obj.temperature);
console.log("Fahrenheit:", obj.fahrenheit);

