/**
 * Lab 184: Extending Interfaces
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Interface inheritance:
 * 
 * - extends keyword
 * - Multiple inheritance
 * - Overriding properties
 * - Interface composition
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Extend interfaces
 * 2. Use multiple inheritance
 * 3. Compose interfaces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Interface Extension
console.log("--- Basic Extension ---");

interface Animal {
    name: string;
    age: number;
}

interface Dog extends Animal {
    breed: string;
    bark(): void;
}

const dog: Dog = {
    name: "Rex",
    age: 3,
    breed: "German Shepherd",
    bark() {
        console.log("Woof!");
    }
};

console.log("Dog:", dog.name, dog.breed);
dog.bark();

// Solution 2: Multiple Interface Extension
console.log("\n--- Multiple Extension ---");

interface Printable {
    print(): void;
}

interface Serializable {
    serialize(): string;
}

interface Document extends Printable, Serializable {
    title: string;
    content: string;
}

const doc: Document = {
    title: "Report",
    content: "This is the content",
    print() {
        console.log(`Title: ${this.title}\nContent: ${this.content}`);
    },
    serialize() {
        return JSON.stringify({ title: this.title, content: this.content });
    }
};

doc.print();
console.log("Serialized:", doc.serialize());

// Solution 3: Extending with Additional Properties
console.log("\n--- Additional Properties ---");

interface User {
    id: number;
    name: string;
    email: string;
}

interface Admin extends User {
    permissions: string[];
    role: "admin";
}

interface SuperAdmin extends Admin {
    canDeleteUsers: boolean;
    canManageAdmins: boolean;
}

const superAdmin: SuperAdmin = {
    id: 1,
    name: "John",
    email: "john@example.com",
    permissions: ["read", "write", "delete"],
    role: "admin",
    canDeleteUsers: true,
    canManageAdmins: true
};

console.log("Super Admin:", superAdmin.name, superAdmin.permissions);

// Solution 4: Overriding Properties
console.log("\n--- Overriding Properties ---");

interface BaseConfig {
    timeout: number;
    retries: number;
}

interface StrictConfig extends BaseConfig {
    timeout: 5000;  // Narrowing to literal type
    strictMode: true;
}

const strictConfig: StrictConfig = {
    timeout: 5000,
    retries: 3,
    strictMode: true
};

console.log("Strict config:", strictConfig);

// Solution 5: Generic Interface Extension
console.log("\n--- Generic Extension ---");

interface Repository<T> {
    find(id: number): T | null;
    findAll(): T[];
    save(item: T): void;
}

interface CrudRepository<T> extends Repository<T> {
    update(id: number, item: Partial<T>): void;
    delete(id: number): void;
}

// Implementation
class UserRepository implements CrudRepository<User> {
    private users: User[] = [];
    
    find(id: number): User | null {
        return this.users.find(u => u.id === id) ?? null;
    }
    
    findAll(): User[] {
        return [...this.users];
    }
    
    save(user: User): void {
        this.users.push(user);
    }
    
    update(id: number, data: Partial<User>): void {
        const user = this.find(id);
        if (user) Object.assign(user, data);
    }
    
    delete(id: number): void {
        this.users = this.users.filter(u => u.id !== id);
    }
}

const repo = new UserRepository();
repo.save({ id: 1, name: "John", email: "john@example.com" });
console.log("Users:", repo.findAll());

// Solution 6: Interface Composition
console.log("\n--- Interface Composition ---");

interface HasId {
    id: number;
}

interface HasTimestamps {
    createdAt: Date;
    updatedAt: Date;
}

interface HasName {
    name: string;
}

// Compose multiple interfaces
interface Entity extends HasId, HasTimestamps {}
interface NamedEntity extends Entity, HasName {}

const entity: NamedEntity = {
    id: 1,
    name: "Test Entity",
    createdAt: new Date(),
    updatedAt: new Date()
};

console.log("Entity:", entity.name);

// Solution 7: Extending Built-in Interfaces
console.log("\n--- Extending Built-ins ---");

interface Array<T> {
    customMethod(): T[];
}

// Note: This extends the global Array interface
// Implementation would be: Array.prototype.customMethod = function() { ... }

// Solution 8: Conditional Extension
console.log("\n--- Conditional Patterns ---");

interface BaseResponse {
    status: number;
    message: string;
}

interface SuccessResponse<T> extends BaseResponse {
    status: 200;
    data: T;
}

interface ErrorResponse extends BaseResponse {
    status: 400 | 404 | 500;
    error: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

function handleResponse<T>(response: ApiResponse<T>): void {
    if (response.status === 200) {
        console.log("Success:", response.data);
    } else {
        console.log("Error:", response.error);
    }
}

handleResponse({ status: 200, message: "OK", data: { id: 1 } });

// Solution 9: Mixin Pattern
console.log("\n--- Mixin Pattern ---");

interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface Activatable {
    isActive: boolean;
    activate(): void;
    deactivate(): void;
}

interface Product extends Timestamped, Activatable {
    id: number;
    name: string;
    price: number;
}

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface BaseEvent {
    type: string;
    timestamp: Date;
}

interface UserEvent extends BaseEvent {
    userId: number;
}

interface ClickEvent extends UserEvent {
    type: "click";
    x: number;
    y: number;
    target: string;
}

interface ScrollEvent extends UserEvent {
    type: "scroll";
    scrollTop: number;
    scrollLeft: number;
}

type AppEvent = ClickEvent | ScrollEvent;

function logEvent(event: AppEvent): void {
    console.log(`[${event.type}] User ${event.userId} at ${event.timestamp}`);
}

logEvent({
    type: "click",
    timestamp: new Date(),
    userId: 1,
    x: 100,
    y: 200,
    target: "button"
});

