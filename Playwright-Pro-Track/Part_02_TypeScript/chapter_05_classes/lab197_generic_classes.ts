/**
 * Lab 197: Generic Classes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Classes with type parameters:
 * 
 * - Generic class syntax
 * - Type constraints
 * - Multiple type parameters
 * - Generic methods
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic classes
 * 2. Use type constraints
 * 3. Implement generic patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Generic Class
console.log("--- Basic Generic Class ---");

class Box<T> {
    private content: T;
    
    constructor(content: T) {
        this.content = content;
    }
    
    getContent(): T {
        return this.content;
    }
    
    setContent(content: T): void {
        this.content = content;
    }
}

const stringBox = new Box<string>("Hello");
const numberBox = new Box<number>(42);

console.log("String box:", stringBox.getContent());
console.log("Number box:", numberBox.getContent());

// Solution 2: Generic Collection
console.log("\n--- Generic Collection ---");

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

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log("Pop:", stack.pop());
console.log("Peek:", stack.peek());

// Solution 3: Multiple Type Parameters
console.log("\n--- Multiple Type Parameters ---");

class Pair<K, V> {
    constructor(public key: K, public value: V) {}
    
    swap(): Pair<V, K> {
        return new Pair(this.value, this.key);
    }
}

class Dictionary<K, V> {
    private items: Map<K, V> = new Map();
    
    set(key: K, value: V): void {
        this.items.set(key, value);
    }
    
    get(key: K): V | undefined {
        return this.items.get(key);
    }
    
    has(key: K): boolean {
        return this.items.has(key);
    }
}

const pair = new Pair<string, number>("age", 30);
console.log("Pair:", pair.key, pair.value);

const dict = new Dictionary<string, number>();
dict.set("one", 1);
dict.set("two", 2);
console.log("Dict get:", dict.get("one"));

// Solution 4: Type Constraints
console.log("\n--- Type Constraints ---");

interface HasId {
    id: number;
}

class Repository<T extends HasId> {
    private items: T[] = [];
    
    add(item: T): void {
        this.items.push(item);
    }
    
    findById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }
    
    getAll(): T[] {
        return [...this.items];
    }
}

interface User extends HasId {
    name: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: "John" });
userRepo.add({ id: 2, name: "Jane" });
console.log("Find:", userRepo.findById(1));

// Solution 5: Generic with Default Type
console.log("\n--- Default Type ---");

class Container<T = string> {
    constructor(public value: T) {}
}

const defaultContainer = new Container("Hello");  // T is string
const numberContainer = new Container<number>(42);

console.log("Default:", defaultContainer.value);
console.log("Number:", numberContainer.value);

// Solution 6: Generic Methods in Generic Class
console.log("\n--- Generic Methods ---");

class Transformer<T> {
    constructor(private value: T) {}
    
    transform<U>(fn: (value: T) => U): Transformer<U> {
        return new Transformer(fn(this.value));
    }
    
    getValue(): T {
        return this.value;
    }
}

const result = new Transformer(5)
    .transform(n => n * 2)
    .transform(n => n.toString())
    .getValue();

console.log("Transformed:", result);

// Solution 7: Generic Singleton
console.log("\n--- Generic Singleton ---");

class Singleton<T> {
    private static instances: Map<string, unknown> = new Map();
    
    static getInstance<T>(key: string, factory: () => T): T {
        if (!Singleton.instances.has(key)) {
            Singleton.instances.set(key, factory());
        }
        return Singleton.instances.get(key) as T;
    }
}

interface Config {
    apiUrl: string;
}

const config = Singleton.getInstance<Config>("config", () => ({
    apiUrl: "https://api.example.com"
}));

console.log("Config:", config);

// Solution 8: Generic Event Emitter
console.log("\n--- Generic Event Emitter ---");

class EventEmitter<Events extends Record<string, unknown[]>> {
    private handlers = new Map<keyof Events, Function[]>();
    
    on<K extends keyof Events>(
        event: K,
        handler: (...args: Events[K]) => void
    ): void {
        const handlers = this.handlers.get(event) ?? [];
        handlers.push(handler);
        this.handlers.set(event, handlers);
    }
    
    emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
        const handlers = this.handlers.get(event) ?? [];
        handlers.forEach(h => h(...args));
    }
}

interface AppEvents {
    login: [userId: number];
    message: [from: string, content: string];
}

const emitter = new EventEmitter<AppEvents>();
emitter.on("message", (from, content) => {
    console.log(`Message from ${from}: ${content}`);
});
emitter.emit("message", "John", "Hello!");

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

class AsyncQueue<T> {
    private queue: T[] = [];
    private processing = false;
    
    constructor(private processor: (item: T) => Promise<void>) {}
    
    async enqueue(item: T): Promise<void> {
        this.queue.push(item);
        if (!this.processing) {
            await this.processQueue();
        }
    }
    
    private async processQueue(): Promise<void> {
        this.processing = true;
        while (this.queue.length > 0) {
            const item = this.queue.shift()!;
            await this.processor(item);
        }
        this.processing = false;
    }
}

const queue = new AsyncQueue<string>(async (item) => {
    console.log("Processing:", item);
});

queue.enqueue("Task 1");
queue.enqueue("Task 2");

