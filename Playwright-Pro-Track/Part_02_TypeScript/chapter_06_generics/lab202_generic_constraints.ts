/**
 * Lab 202: Generic Constraints
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Constraining generic types:
 * 
 * - extends keyword
 * - Interface constraints
 * - keyof constraints
 * - Multiple constraints
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create constrained generics
 * 2. Use keyof constraints
 * 3. Combine multiple constraints
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Constraint
console.log("--- Basic Constraint ---");

interface HasLength {
    length: number;
}

function logLength<T extends HasLength>(item: T): number {
    console.log("Length:", item.length);
    return item.length;
}

logLength("hello");        // string has length
logLength([1, 2, 3]);      // array has length
logLength({ length: 10 }); // object with length

// Solution 2: Object Constraint
console.log("\n--- Object Constraint ---");

function merge<T extends object, U extends object>(a: T, b: U): T & U {
    return { ...a, ...b };
}

const merged = merge({ name: "John" }, { age: 30 });
console.log("Merged:", merged);

// merge("hello", "world"); // Error: string is not object

// Solution 3: keyof Constraint
console.log("\n--- keyof Constraint ---");

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
}

const user = { name: "John", age: 30 };
console.log("Name:", getProperty(user, "name"));
// getProperty(user, "invalid"); // Error: invalid key

// Solution 4: Interface Constraint
console.log("\n--- Interface Constraint ---");

interface Entity {
    id: number;
}

function findById<T extends Entity>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

interface User extends Entity {
    name: string;
}

const users: User[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];

console.log("Found:", findById(users, 1));

// Solution 5: Constructor Constraint
console.log("\n--- Constructor Constraint ---");

interface Constructable<T> {
    new (...args: any[]): T;
}

function createInstance<T>(ctor: Constructable<T>, ...args: any[]): T {
    return new ctor(...args);
}

class Person {
    constructor(public name: string) {}
}

const person = createInstance(Person, "John");
console.log("Person:", person.name);

// Solution 6: Multiple Constraints
console.log("\n--- Multiple Constraints ---");

interface HasName {
    name: string;
}

interface HasAge {
    age: number;
}

function greet<T extends HasName & HasAge>(person: T): string {
    return `Hello, ${person.name}! You are ${person.age} years old.`;
}

console.log(greet({ name: "John", age: 30, email: "john@example.com" }));

// Solution 7: Conditional Constraints
console.log("\n--- Conditional Constraints ---");

type NumberOrString<T> = T extends number ? number : string;

function process<T extends number | string>(value: T): NumberOrString<T> {
    if (typeof value === "number") {
        return (value * 2) as NumberOrString<T>;
    }
    return value.toUpperCase() as NumberOrString<T>;
}

console.log("Number:", process(5));
console.log("String:", process("hello"));

// Solution 8: Constraint with Default
console.log("\n--- Constraint with Default ---");

interface Config {
    timeout: number;
    retries: number;
}

function createConfig<T extends Partial<Config> = {}>(
    overrides: T = {} as T
): Config & T {
    const defaults: Config = { timeout: 5000, retries: 3 };
    return { ...defaults, ...overrides };
}

const config1 = createConfig();
const config2 = createConfig({ timeout: 10000, debug: true });

console.log("Config 1:", config1);
console.log("Config 2:", config2);

// Solution 9: Recursive Constraints
console.log("\n--- Recursive Constraints ---");

interface TreeNode<T> {
    value: T;
    children?: TreeNode<T>[];
}

function findInTree<T>(
    node: TreeNode<T>,
    predicate: (value: T) => boolean
): T | undefined {
    if (predicate(node.value)) {
        return node.value;
    }
    
    if (node.children) {
        for (const child of node.children) {
            const found = findInTree(child, predicate);
            if (found !== undefined) return found;
        }
    }
    
    return undefined;
}

const tree: TreeNode<number> = {
    value: 1,
    children: [
        { value: 2 },
        { value: 3, children: [{ value: 4 }] }
    ]
};

console.log("Found:", findInTree(tree, v => v === 4));

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface Repository<T extends Entity> {
    find(id: number): T | undefined;
    findAll(): T[];
    save(item: T): T;
    delete(id: number): boolean;
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
    private items: T[] = [];
    
    find(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }
    
    findAll(): T[] {
        return [...this.items];
    }
    
    save(item: T): T {
        const existing = this.find(item.id);
        if (existing) {
            Object.assign(existing, item);
            return existing;
        }
        this.items.push(item);
        return item;
    }
    
    delete(id: number): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index >= 0) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}

const userRepo = new InMemoryRepository<User>();
userRepo.save({ id: 1, name: "John" });
console.log("Users:", userRepo.findAll());

