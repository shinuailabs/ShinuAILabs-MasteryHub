/**
 * Lab 185: Function Interfaces
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Interfaces for functions:
 * 
 * - Call signatures
 * - Construct signatures
 * - Overloaded functions
 * - Hybrid interfaces
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Define function interfaces
 * 2. Use call signatures
 * 3. Create hybrid interfaces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Function Interface
console.log("--- Basic Function Interface ---");

interface MathOperation {
    (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;

console.log("Add:", add(5, 3));
console.log("Subtract:", subtract(10, 4));
console.log("Multiply:", multiply(6, 7));

// Solution 2: Function Interface with Properties
console.log("\n--- Function with Properties ---");

interface Greeter {
    (name: string): string;
    greeting: string;
    setGreeting(greeting: string): void;
}

function createGreeter(): Greeter {
    const greeter = function(name: string): string {
        return `${greeter.greeting}, ${name}!`;
    } as Greeter;
    
    greeter.greeting = "Hello";
    greeter.setGreeting = function(greeting: string) {
        greeter.greeting = greeting;
    };
    
    return greeter;
}

const greet = createGreeter();
console.log(greet("World"));
greet.setGreeting("Hi");
console.log(greet("TypeScript"));

// Solution 3: Construct Signatures
console.log("\n--- Construct Signatures ---");

interface PointConstructor {
    new (x: number, y: number): Point;
}

interface Point {
    x: number;
    y: number;
}

class PointImpl implements Point {
    constructor(public x: number, public y: number) {}
}

function createPoint(ctor: PointConstructor, x: number, y: number): Point {
    return new ctor(x, y);
}

const point = createPoint(PointImpl, 10, 20);
console.log("Point:", point);

// Solution 4: Overloaded Function Interface
console.log("\n--- Overloaded Functions ---");

interface StringFormatter {
    (value: string): string;
    (value: number): string;
    (value: Date): string;
}

const format: StringFormatter = (value: string | number | Date): string => {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    if (typeof value === "number") {
        return value.toFixed(2);
    }
    return value.toISOString();
};

console.log(format("hello"));
console.log(format(42.567));
console.log(format(new Date()));

// Solution 5: Generic Function Interface
console.log("\n--- Generic Function Interface ---");

interface Transformer<T, U> {
    (input: T): U;
}

interface Predicate<T> {
    (item: T): boolean;
}

interface Comparator<T> {
    (a: T, b: T): number;
}

const toUpper: Transformer<string, string> = s => s.toUpperCase();
const isEven: Predicate<number> = n => n % 2 === 0;
const compareNumbers: Comparator<number> = (a, b) => a - b;

console.log("Transform:", toUpper("hello"));
console.log("Predicate:", isEven(4));
console.log("Compare:", compareNumbers(5, 3));

// Solution 6: Callback Interfaces
console.log("\n--- Callback Interfaces ---");

interface Callback<T> {
    (error: Error | null, result?: T): void;
}

interface AsyncOperation<T> {
    (callback: Callback<T>): void;
}

const fetchData: AsyncOperation<string> = (callback) => {
    setTimeout(() => {
        callback(null, "Data loaded");
    }, 100);
};

fetchData((error, result) => {
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Result:", result);
    }
});

// Solution 7: Event Handler Interface
console.log("\n--- Event Handler Interface ---");

interface Event {
    type: string;
    target: unknown;
}

interface EventHandler<E extends Event> {
    (event: E): void;
}

interface ClickEvent extends Event {
    type: "click";
    x: number;
    y: number;
}

const handleClick: EventHandler<ClickEvent> = (event) => {
    console.log(`Clicked at (${event.x}, ${event.y})`);
};

handleClick({ type: "click", target: null, x: 100, y: 200 });

// Solution 8: Method Signatures
console.log("\n--- Method Signatures ---");

interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}

const calc: Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b
};

console.log("Calc add:", calc.add(10, 5));
console.log("Calc divide:", calc.divide(20, 4));

// Solution 9: Hybrid Interface
console.log("\n--- Hybrid Interface ---");

interface Counter {
    (start: number): number;
    count: number;
    increment(): number;
    decrement(): number;
    reset(): void;
}

function createCounter(): Counter {
    const counter = function(start: number): number {
        counter.count = start;
        return counter.count;
    } as Counter;
    
    counter.count = 0;
    counter.increment = () => ++counter.count;
    counter.decrement = () => --counter.count;
    counter.reset = () => { counter.count = 0; };
    
    return counter;
}

const counter = createCounter();
counter(10);
console.log("Count:", counter.count);
counter.increment();
console.log("After increment:", counter.count);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface HttpClient {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: unknown): Promise<T>;
    put<T>(url: string, data: unknown): Promise<T>;
    delete(url: string): Promise<void>;
    
    baseUrl: string;
    setHeader(name: string, value: string): void;
}

// Mock implementation
const client: HttpClient = {
    baseUrl: "https://api.example.com",
    async get<T>(url: string): Promise<T> {
        console.log(`GET ${this.baseUrl}${url}`);
        return {} as T;
    },
    async post<T>(url: string, data: unknown): Promise<T> {
        console.log(`POST ${this.baseUrl}${url}`);
        return {} as T;
    },
    async put<T>(url: string, data: unknown): Promise<T> {
        console.log(`PUT ${this.baseUrl}${url}`);
        return {} as T;
    },
    async delete(url: string): Promise<void> {
        console.log(`DELETE ${this.baseUrl}${url}`);
    },
    setHeader(name: string, value: string): void {
        console.log(`Header: ${name}=${value}`);
    }
};

client.get("/users");

