/**
 * Lab 189: Generic Interfaces
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Interfaces with type parameters:
 * 
 * - Generic interface syntax
 * - Constraints
 * - Default type parameters
 * - Multiple type parameters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic interfaces
 * 2. Use constraints
 * 3. Implement generic interfaces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Generic Interface
console.log("--- Basic Generic Interface ---");

interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

class Box<T> implements Container<T> {
    constructor(public value: T) {}
    
    getValue(): T {
        return this.value;
    }
    
    setValue(value: T): void {
        this.value = value;
    }
}

const stringBox = new Box<string>("Hello");
const numberBox = new Box<number>(42);

console.log("String box:", stringBox.getValue());
console.log("Number box:", numberBox.getValue());

// Solution 2: Multiple Type Parameters
console.log("\n--- Multiple Type Parameters ---");

interface Pair<K, V> {
    key: K;
    value: V;
}

interface Map<K, V> {
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
}

const pair: Pair<string, number> = {
    key: "age",
    value: 30
};

console.log("Pair:", pair);

// Solution 3: Generic Constraints
console.log("\n--- Generic Constraints ---");

interface HasLength {
    length: number;
}

interface Measurable<T extends HasLength> {
    item: T;
    getLength(): number;
}

class StringMeasurer implements Measurable<string> {
    constructor(public item: string) {}
    
    getLength(): number {
        return this.item.length;
    }
}

const measurer = new StringMeasurer("Hello World");
console.log("Length:", measurer.getLength());

// Solution 4: Default Type Parameters
console.log("\n--- Default Type Parameters ---");

interface Response<T = unknown, E = Error> {
    data?: T;
    error?: E;
    status: number;
}

const successResponse: Response<{ name: string }> = {
    data: { name: "John" },
    status: 200
};

const errorResponse: Response = {
    error: new Error("Not found"),
    status: 404
};

console.log("Success:", successResponse);
console.log("Error:", errorResponse.error?.message);

// Solution 5: Generic Repository Pattern
console.log("\n--- Repository Pattern ---");

interface Entity {
    id: number;
}

interface Repository<T extends Entity> {
    find(id: number): T | null;
    findAll(): T[];
    save(entity: T): T;
    update(id: number, entity: Partial<T>): T | null;
    delete(id: number): boolean;
}

interface User extends Entity {
    name: string;
    email: string;
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
    private items: T[] = [];
    
    find(id: number): T | null {
        return this.items.find(item => item.id === id) ?? null;
    }
    
    findAll(): T[] {
        return [...this.items];
    }
    
    save(entity: T): T {
        this.items.push(entity);
        return entity;
    }
    
    update(id: number, data: Partial<T>): T | null {
        const item = this.find(id);
        if (item) Object.assign(item, data);
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
userRepo.save({ id: 1, name: "John", email: "john@example.com" });
console.log("Users:", userRepo.findAll());

// Solution 6: Generic Function Interface
console.log("\n--- Generic Function Interface ---");

interface Transformer<T, U> {
    (input: T): U;
}

interface Predicate<T> {
    (item: T): boolean;
}

interface Reducer<T, U> {
    (accumulator: U, current: T): U;
}

const toUpper: Transformer<string, string> = s => s.toUpperCase();
const isEven: Predicate<number> = n => n % 2 === 0;
const sum: Reducer<number, number> = (acc, n) => acc + n;

console.log("Transform:", toUpper("hello"));
console.log("Predicate:", isEven(4));
console.log("Reduce:", [1, 2, 3].reduce(sum, 0));

// Solution 7: Conditional Generic Interface
console.log("\n--- Conditional Generics ---");

interface ApiResponse<T, Success extends boolean = true> {
    success: Success;
    data: Success extends true ? T : null;
    error: Success extends true ? null : string;
}

type SuccessResponse<T> = ApiResponse<T, true>;
type ErrorResponse = ApiResponse<never, false>;

const success: SuccessResponse<User> = {
    success: true,
    data: { id: 1, name: "John", email: "john@example.com" },
    error: null
};

console.log("Success response:", success);

// Solution 8: Generic Interface with keyof
console.log("\n--- keyof Constraint ---");

interface PropertyAccessor<T, K extends keyof T> {
    get(obj: T): T[K];
    set(obj: T, value: T[K]): void;
}

class ObjectAccessor<T, K extends keyof T> implements PropertyAccessor<T, K> {
    constructor(private key: K) {}
    
    get(obj: T): T[K] {
        return obj[this.key];
    }
    
    set(obj: T, value: T[K]): void {
        obj[this.key] = value;
    }
}

const user: User = { id: 1, name: "John", email: "john@example.com" };
const nameAccessor = new ObjectAccessor<User, "name">("name");
console.log("Name:", nameAccessor.get(user));

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

interface EventEmitter<Events extends Record<string, unknown[]>> {
    on<K extends keyof Events>(
        event: K,
        handler: (...args: Events[K]) => void
    ): void;
    emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
}

interface AppEvents {
    login: [userId: number];
    logout: [];
    message: [from: string, content: string];
}

// Type-safe event emitter
class TypedEmitter<Events extends Record<string, unknown[]>> 
    implements EventEmitter<Events> {
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

const emitter = new TypedEmitter<AppEvents>();
emitter.on("message", (from, content) => {
    console.log(`Message from ${from}: ${content}`);
});
emitter.emit("message", "John", "Hello!");

