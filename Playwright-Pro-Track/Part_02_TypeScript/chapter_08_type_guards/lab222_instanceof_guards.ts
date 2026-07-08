/**
 * Lab 222: instanceof Type Guards
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using instanceof for class checking:
 * 
 * - Class instance checks
 * - Inheritance chains
 * - Built-in types
 * - Limitations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use instanceof guards
 * 2. Check class hierarchies
 * 3. Handle built-in types
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic instanceof
console.log("--- Basic instanceof ---");

class Dog {
    bark() { console.log("Woof!"); }
}

class Cat {
    meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat): void {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

makeSound(new Dog());
makeSound(new Cat());

// Solution 2: Inheritance Chain
console.log("\n--- Inheritance Chain ---");

class Animal {
    constructor(public name: string) {}
}

class Mammal extends Animal {
    nurse() { console.log(`${this.name} is nursing`); }
}

class Bird extends Animal {
    fly() { console.log(`${this.name} is flying`); }
}

class Penguin extends Bird {
    swim() { console.log(`${this.name} is swimming`); }
    // Override fly - penguins can't fly
    fly() { console.log(`${this.name} cannot fly`); }
}

function describeAnimal(animal: Animal): void {
    console.log(`Animal: ${animal.name}`);
    
    if (animal instanceof Penguin) {
        animal.swim();
    } else if (animal instanceof Bird) {
        animal.fly();
    } else if (animal instanceof Mammal) {
        animal.nurse();
    }
}

describeAnimal(new Mammal("Dog"));
describeAnimal(new Bird("Eagle"));
describeAnimal(new Penguin("Pingu"));

// Solution 3: Built-in Types
console.log("\n--- Built-in Types ---");

function processValue(value: unknown): string {
    if (value instanceof Date) {
        return `Date: ${value.toISOString()}`;
    }
    if (value instanceof RegExp) {
        return `RegExp: ${value.source}`;
    }
    if (value instanceof Error) {
        return `Error: ${value.message}`;
    }
    if (value instanceof Array) {
        return `Array: [${value.join(", ")}]`;
    }
    if (value instanceof Map) {
        return `Map with ${value.size} entries`;
    }
    if (value instanceof Set) {
        return `Set with ${value.size} items`;
    }
    return `Unknown: ${value}`;
}

console.log(processValue(new Date()));
console.log(processValue(/hello/g));
console.log(processValue(new Error("Oops")));
console.log(processValue([1, 2, 3]));
console.log(processValue(new Map([["a", 1]])));
console.log(processValue(new Set([1, 2, 3])));

// Solution 4: Error Handling
console.log("\n--- Error Handling ---");

class ValidationError extends Error {
    constructor(public field: string, message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

class NetworkError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "NetworkError";
    }
}

function handleError(error: Error): void {
    if (error instanceof ValidationError) {
        console.log(`Validation failed for ${error.field}: ${error.message}`);
    } else if (error instanceof NetworkError) {
        console.log(`Network error ${error.statusCode}: ${error.message}`);
    } else {
        console.log(`Unknown error: ${error.message}`);
    }
}

handleError(new ValidationError("email", "Invalid email format"));
handleError(new NetworkError(404, "Not found"));
handleError(new Error("Something went wrong"));

// Solution 5: Promise Checking
console.log("\n--- Promise Checking ---");

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return value instanceof Promise;
}

async function processAsync<T>(value: T | Promise<T>): Promise<T> {
    if (isPromise(value)) {
        console.log("Awaiting promise...");
        return await value;
    }
    console.log("Direct value");
    return value;
}

processAsync(42).then(v => console.log("Result:", v));
processAsync(Promise.resolve(42)).then(v => console.log("Result:", v));

// Solution 6: Custom Classes
console.log("\n--- Custom Classes ---");

class HttpResponse {
    constructor(public status: number, public body: unknown) {}
}

class JsonResponse extends HttpResponse {
    constructor(status: number, public data: object) {
        super(status, JSON.stringify(data));
    }
}

class TextResponse extends HttpResponse {
    constructor(status: number, public text: string) {
        super(status, text);
    }
}

function processResponse(response: HttpResponse): void {
    if (response instanceof JsonResponse) {
        console.log("JSON data:", response.data);
    } else if (response instanceof TextResponse) {
        console.log("Text:", response.text);
    } else {
        console.log("Raw body:", response.body);
    }
}

processResponse(new JsonResponse(200, { id: 1 }));
processResponse(new TextResponse(200, "Hello"));

// Solution 7: Practical Example
console.log("\n--- Practical Example ---");

abstract class Shape {
    abstract area(): number;
}

class Circle extends Shape {
    constructor(public radius: number) { super(); }
    area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
    constructor(public width: number, public height: number) { super(); }
    area() { return this.width * this.height; }
}

function describeShape(shape: Shape): string {
    const area = shape.area().toFixed(2);
    
    if (shape instanceof Circle) {
        return `Circle with radius ${shape.radius}, area: ${area}`;
    }
    if (shape instanceof Rectangle) {
        return `Rectangle ${shape.width}x${shape.height}, area: ${area}`;
    }
    return `Shape with area: ${area}`;
}

console.log(describeShape(new Circle(5)));
console.log(describeShape(new Rectangle(4, 6)));

