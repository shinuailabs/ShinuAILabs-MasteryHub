/**
 * Lab 153: First TypeScript Program
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Writing and running TypeScript:
 * 
 * - Create TypeScript files
 * - Compile to JavaScript
 * - Run the compiled code
 * - Debug TypeScript
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write a complete TypeScript program
 * 2. Compile and run it
 * 3. Understand the output
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Simple Program
console.log("--- First TypeScript Program ---");

// Define types
interface Person {
    name: string;
    age: number;
    email?: string; // Optional property
}

// Create a person
const person: Person = {
    name: "John Doe",
    age: 30,
    email: "john@example.com"
};

console.log("Person:", person);

// Solution 2: Functions with Types
console.log("\n--- Typed Functions ---");

function calculateArea(width: number, height: number): number {
    return width * height;
}

function formatCurrency(amount: number, currency: string = "USD"): string {
    return `${currency} ${amount.toFixed(2)}`;
}

console.log("Area:", calculateArea(10, 5));
console.log("Price:", formatCurrency(99.99));

// Solution 3: Classes
console.log("\n--- Classes ---");

class Calculator {
    private result: number = 0;
    
    add(value: number): Calculator {
        this.result += value;
        return this;
    }
    
    subtract(value: number): Calculator {
        this.result -= value;
        return this;
    }
    
    multiply(value: number): Calculator {
        this.result *= value;
        return this;
    }
    
    getResult(): number {
        return this.result;
    }
    
    reset(): Calculator {
        this.result = 0;
        return this;
    }
}

const calc = new Calculator();
const result = calc.add(10).multiply(2).subtract(5).getResult();
console.log("Calculator result:", result);

// Solution 4: Arrays and Generics
console.log("\n--- Arrays and Generics ---");

function getFirst<T>(arr: T[]): T | undefined {
    return arr[0];
}

const numbers: number[] = [1, 2, 3, 4, 5];
const names: string[] = ["Alice", "Bob", "Charlie"];

console.log("First number:", getFirst(numbers));
console.log("First name:", getFirst(names));

// Solution 5: Enums
console.log("\n--- Enums ---");

enum Status {
    Pending = "PENDING",
    Active = "ACTIVE",
    Completed = "COMPLETED",
    Cancelled = "CANCELLED"
}

interface Task {
    id: number;
    title: string;
    status: Status;
}

const task: Task = {
    id: 1,
    title: "Learn TypeScript",
    status: Status.Active
};

console.log("Task:", task);

// Solution 6: Union Types
console.log("\n--- Union Types ---");

type StringOrNumber = string | number;

function formatValue(value: StringOrNumber): string {
    if (typeof value === "number") {
        return value.toFixed(2);
    }
    return value.toUpperCase();
}

console.log("Format number:", formatValue(42.5));
console.log("Format string:", formatValue("hello"));

// Solution 7: Type Guards
console.log("\n--- Type Guards ---");

interface Dog {
    bark(): void;
    breed: string;
}

interface Cat {
    meow(): void;
    color: string;
}

function isDog(animal: Dog | Cat): animal is Dog {
    return (animal as Dog).bark !== undefined;
}

const myPet: Dog = {
    bark: () => console.log("Woof!"),
    breed: "Labrador"
};

if (isDog(myPet)) {
    myPet.bark();
    console.log("Breed:", myPet.breed);
}

// Solution 8: Async/Await
console.log("\n--- Async/Await ---");

async function fetchData(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Data fetched successfully!");
        }, 100);
    });
}

// Using async function
(async () => {
    const data = await fetchData();
    console.log(data);
})();

// Solution 9: Error Handling
console.log("\n--- Error Handling ---");

class ValidationError extends Error {
    constructor(public field: string, message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateAge(age: number): void {
    if (age < 0 || age > 150) {
        throw new ValidationError("age", "Age must be between 0 and 150");
    }
}

try {
    validateAge(25);
    console.log("Age is valid");
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(`Validation error on ${error.field}: ${error.message}`);
    }
}

// Solution 10: Complete Example
console.log("\n--- Complete Example ---");

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

class ShoppingCart {
    private items: Product[] = [];
    
    addItem(product: Product): void {
        this.items.push(product);
    }
    
    getTotal(): number {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    
    getItems(): Product[] {
        return [...this.items];
    }
}

const cart = new ShoppingCart();
cart.addItem({ id: 1, name: "Widget", price: 9.99, quantity: 2 });
cart.addItem({ id: 2, name: "Gadget", price: 19.99, quantity: 1 });

console.log("Cart items:", cart.getItems().length);
console.log("Total:", formatCurrency(cart.getTotal()));

