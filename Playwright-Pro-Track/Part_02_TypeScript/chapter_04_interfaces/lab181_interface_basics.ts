/**
 * Lab 181: Interface Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript interfaces:
 * 
 * - Defining interfaces
 * - Object shape contracts
 * - Property types
 * - Using interfaces
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic interfaces
 * 2. Use interfaces for objects
 * 3. Understand interface contracts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Interface
console.log("--- Basic Interface ---");

interface User {
    id: number;
    name: string;
    email: string;
}

const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com"
};

console.log("User:", user);

// Solution 2: Interface as Parameter Type
console.log("\n--- Interface as Parameter ---");

interface Point {
    x: number;
    y: number;
}

function printPoint(point: Point): void {
    console.log(`Point: (${point.x}, ${point.y})`);
}

function distance(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

printPoint({ x: 10, y: 20 });
console.log("Distance:", distance({ x: 0, y: 0 }, { x: 3, y: 4 }));

// Solution 3: Optional Properties
console.log("\n--- Optional Properties ---");

interface Config {
    host: string;
    port: number;
    ssl?: boolean;
    timeout?: number;
}

const minimalConfig: Config = {
    host: "localhost",
    port: 3000
};

const fullConfig: Config = {
    host: "example.com",
    port: 443,
    ssl: true,
    timeout: 5000
};

console.log("Minimal:", minimalConfig);
console.log("Full:", fullConfig);

// Solution 4: Readonly Properties
console.log("\n--- Readonly Properties ---");

interface ImmutablePoint {
    readonly x: number;
    readonly y: number;
}

const point: ImmutablePoint = { x: 10, y: 20 };
// point.x = 15; // Error!

console.log("Immutable point:", point);

// Solution 5: Interface for Functions
console.log("\n--- Function Interface ---");

interface MathOperation {
    (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

console.log("Add:", add(5, 3));
console.log("Multiply:", multiply(5, 3));

// Solution 6: Interface with Methods
console.log("\n--- Interface with Methods ---");

interface Calculator {
    value: number;
    add(n: number): Calculator;
    subtract(n: number): Calculator;
    getResult(): number;
}

const calc: Calculator = {
    value: 0,
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

const result = calc.add(10).add(5).subtract(3).getResult();
console.log("Calculator result:", result);

// Solution 7: Index Signatures
console.log("\n--- Index Signatures ---");

interface StringDictionary {
    [key: string]: string;
}

interface NumberMap {
    [key: string]: number;
}

const colors: StringDictionary = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff"
};

const scores: NumberMap = {
    alice: 95,
    bob: 87
};

console.log("Red:", colors.red);
console.log("Alice:", scores.alice);

// Solution 8: Hybrid Interfaces
console.log("\n--- Hybrid Interfaces ---");

interface Counter {
    (start: number): number;
    interval: number;
    reset(): void;
}

function createCounter(): Counter {
    const counter = function(start: number) {
        return start + counter.interval;
    } as Counter;
    counter.interval = 1;
    counter.reset = function() {
        counter.interval = 1;
    };
    return counter;
}

const counter = createCounter();
console.log("Counter:", counter(10));

// Solution 9: Interface vs Type Alias
console.log("\n--- Interface vs Type ---");

// Interface - can be extended, merged
interface IUser {
    name: string;
}

interface IUser {
    age: number;
}
// IUser now has both name and age

// Type alias - cannot be merged
type TUser = {
    name: string;
};

// type TUser = { age: number }; // Error: Duplicate identifier

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface ShoppingCart {
    items: CartItem[];
    addItem(product: Product, quantity: number): void;
    getTotal(): number;
}

const cart: ShoppingCart = {
    items: [],
    addItem(product, quantity) {
        this.items.push({ product, quantity });
    },
    getTotal() {
        return this.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    }
};

cart.addItem({ id: 1, name: "Widget", price: 9.99 }, 2);
console.log("Cart total:", cart.getTotal());

