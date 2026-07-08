/**
 * Lab 205: Generic Interfaces
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Interfaces with type parameters:
 * 
 * - Generic interface syntax
 * - Implementing generic interfaces
 * - Generic function interfaces
 * - Extending generic interfaces
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create generic interfaces
 * 2. Implement them in classes
 * 3. Use generic constraints
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

const box = new Box<string>("Hello");
console.log("Box value:", box.getValue());

// Solution 2: Generic Repository Interface
console.log("\n--- Repository Interface ---");

interface Repository<T> {
    find(id: number): T | null;
    findAll(): T[];
    save(item: T): T;
    update(id: number, item: Partial<T>): T | null;
    delete(id: number): boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
}

class UserRepository implements Repository<User> {
    private users: User[] = [];
    
    find(id: number): User | null {
        return this.users.find(u => u.id === id) ?? null;
    }
    
    findAll(): User[] {
        return [...this.users];
    }
    
    save(user: User): User {
        this.users.push(user);
        return user;
    }
    
    update(id: number, data: Partial<User>): User | null {
        const user = this.find(id);
        if (user) Object.assign(user, data);
        return user;
    }
    
    delete(id: number): boolean {
        const index = this.users.findIndex(u => u.id === id);
        if (index > -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}

const repo = new UserRepository();
repo.save({ id: 1, name: "John", email: "john@example.com" });
console.log("Users:", repo.findAll());

// Solution 3: Generic Function Interface
console.log("\n--- Function Interface ---");

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
const isPositive: Predicate<number> = n => n > 0;
const compareNumbers: Comparator<number> = (a, b) => a - b;

console.log("Transform:", toUpper("hello"));
console.log("Predicate:", isPositive(5));

// Solution 4: Extending Generic Interfaces
console.log("\n--- Extending Interfaces ---");

interface Entity {
    id: number;
}

interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface BaseEntity extends Entity, Timestamped {}

interface CrudRepository<T extends Entity> extends Repository<T> {
    count(): number;
    exists(id: number): boolean;
}

// Solution 5: Generic Response Interface
console.log("\n--- Response Interface ---");

interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    timestamp: Date;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

const response: ApiResponse<User> = {
    data: { id: 1, name: "John", email: "john@example.com" },
    status: 200,
    message: "Success",
    timestamp: new Date()
};

console.log("Response:", response.data.name);

// Solution 6: Generic Event Interface
console.log("\n--- Event Interface ---");

interface Event<T> {
    type: string;
    payload: T;
    timestamp: Date;
}

interface EventHandler<T> {
    (event: Event<T>): void;
}

interface EventEmitter<Events extends Record<string, unknown>> {
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void;
    emit<K extends keyof Events>(event: K, payload: Events[K]): void;
}

// Solution 7: Generic State Interface
console.log("\n--- State Interface ---");

interface State<T> {
    value: T;
    loading: boolean;
    error: Error | null;
}

interface Action<T> {
    type: string;
    payload?: T;
}

interface Reducer<S, A> {
    (state: S, action: A): S;
}

const initialState: State<User[]> = {
    value: [],
    loading: false,
    error: null
};

console.log("Initial state:", initialState);

// Solution 8: Generic Builder Interface
console.log("\n--- Builder Interface ---");

interface Builder<T> {
    build(): T;
    reset(): this;
}

interface UserBuilder extends Builder<User> {
    setName(name: string): this;
    setEmail(email: string): this;
}

class ConcreteUserBuilder implements UserBuilder {
    private user: Partial<User> = {};
    private nextId = 1;
    
    setName(name: string): this {
        this.user.name = name;
        return this;
    }
    
    setEmail(email: string): this {
        this.user.email = email;
        return this;
    }
    
    build(): User {
        return {
            id: this.nextId++,
            name: this.user.name ?? "",
            email: this.user.email ?? ""
        };
    }
    
    reset(): this {
        this.user = {};
        return this;
    }
}

const builder = new ConcreteUserBuilder();
const user = builder.setName("John").setEmail("john@example.com").build();
console.log("Built user:", user);

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

interface Cache<T> {
    get(key: string): T | undefined;
    set(key: string, value: T, ttl?: number): void;
    delete(key: string): boolean;
    clear(): void;
}

class MemoryCache<T> implements Cache<T> {
    private store = new Map<string, { value: T; expires?: number }>();
    
    get(key: string): T | undefined {
        const item = this.store.get(key);
        if (!item) return undefined;
        if (item.expires && Date.now() > item.expires) {
            this.store.delete(key);
            return undefined;
        }
        return item.value;
    }
    
    set(key: string, value: T, ttl?: number): void {
        this.store.set(key, {
            value,
            expires: ttl ? Date.now() + ttl : undefined
        });
    }
    
    delete(key: string): boolean {
        return this.store.delete(key);
    }
    
    clear(): void {
        this.store.clear();
    }
}

const cache = new MemoryCache<User>();
cache.set("user1", { id: 1, name: "John", email: "john@example.com" });
console.log("Cached:", cache.get("user1"));

