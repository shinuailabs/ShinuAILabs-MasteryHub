/**
 * Lab 204: Generic Classes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Classes with type parameters:
 * 
 * - Generic class syntax
 * - Generic properties
 * - Generic methods
 * - Static members
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic classes
 * 2. Use generic methods
 * 3. Implement generic patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Generic Class
console.log("--- Basic Generic Class ---");

class Box<T> {
    constructor(private value: T) {}
    
    getValue(): T {
        return this.value;
    }
    
    setValue(value: T): void {
        this.value = value;
    }
}

const stringBox = new Box<string>("Hello");
const numberBox = new Box(42); // Type inferred

console.log("String box:", stringBox.getValue());
console.log("Number box:", numberBox.getValue());

// Solution 2: Generic Collection
console.log("\n--- Generic Collection ---");

class Collection<T> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    remove(item: T): boolean {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    
    getAll(): T[] {
        return [...this.items];
    }
    
    find(predicate: (item: T) => boolean): T | undefined {
        return this.items.find(predicate);
    }
}

const numbers = new Collection<number>();
numbers.add(1);
numbers.add(2);
numbers.add(3);
console.log("Numbers:", numbers.getAll());

// Solution 3: Generic Stack
console.log("\n--- Generic Stack ---");

class Stack<T> {
    private items: T[] = [];
    
    push(item: T): void {
        this.items.push(item);
    }
    
    pop(): T | undefined {
        return this.items.pop();
    }
    
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }
    
    isEmpty(): boolean {
        return this.items.length === 0;
    }
    
    size(): number {
        return this.items.length;
    }
}

const stack = new Stack<string>();
stack.push("first");
stack.push("second");
console.log("Peek:", stack.peek());
console.log("Pop:", stack.pop());

// Solution 4: Generic Queue
console.log("\n--- Generic Queue ---");

class Queue<T> {
    private items: T[] = [];
    
    enqueue(item: T): void {
        this.items.push(item);
    }
    
    dequeue(): T | undefined {
        return this.items.shift();
    }
    
    front(): T | undefined {
        return this.items[0];
    }
    
    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log("Front:", queue.front());
console.log("Dequeue:", queue.dequeue());

// Solution 5: Multiple Type Parameters
console.log("\n--- Multiple Type Parameters ---");

class KeyValuePair<K, V> {
    constructor(public key: K, public value: V) {}
    
    toString(): string {
        return `${this.key}: ${this.value}`;
    }
}

class Dictionary<K, V> {
    private pairs: KeyValuePair<K, V>[] = [];
    
    set(key: K, value: V): void {
        const existing = this.pairs.find(p => p.key === key);
        if (existing) {
            existing.value = value;
        } else {
            this.pairs.push(new KeyValuePair(key, value));
        }
    }
    
    get(key: K): V | undefined {
        return this.pairs.find(p => p.key === key)?.value;
    }
}

const dict = new Dictionary<string, number>();
dict.set("age", 30);
dict.set("score", 100);
console.log("Age:", dict.get("age"));

// Solution 6: Constrained Generic Class
console.log("\n--- Constrained Generic ---");

interface Entity {
    id: number;
}

class Repository<T extends Entity> {
    private items: T[] = [];
    
    save(item: T): void {
        this.items.push(item);
    }
    
    findById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }
    
    findAll(): T[] {
        return [...this.items];
    }
}

interface User extends Entity {
    name: string;
}

const userRepo = new Repository<User>();
userRepo.save({ id: 1, name: "John" });
console.log("User:", userRepo.findById(1));

// Solution 7: Generic with Default
console.log("\n--- Generic Default ---");

class Container<T = string> {
    constructor(public value: T) {}
}

const defaultContainer = new Container("hello"); // T is string
const numberContainer = new Container<number>(42);

console.log("Default:", defaultContainer.value);
console.log("Number:", numberContainer.value);

// Solution 8: Generic Singleton
console.log("\n--- Generic Singleton ---");

class Singleton<T> {
    private static instances = new Map<string, any>();
    
    static getInstance<T>(key: string, factory: () => T): T {
        if (!Singleton.instances.has(key)) {
            Singleton.instances.set(key, factory());
        }
        return Singleton.instances.get(key);
    }
}

const config = Singleton.getInstance("config", () => ({ debug: true }));
console.log("Config:", config);

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

class ApiClient<T> {
    constructor(private baseUrl: string) {}
    
    async get(endpoint: string): Promise<T> {
        console.log(`GET ${this.baseUrl}${endpoint}`);
        return {} as T;
    }
    
    async post(endpoint: string, data: Partial<T>): Promise<T> {
        console.log(`POST ${this.baseUrl}${endpoint}`);
        return {} as T;
    }
}

interface Product {
    id: number;
    name: string;
    price: number;
}

const productApi = new ApiClient<Product>("https://api.example.com");
productApi.get("/products/1");

