/**
 * Lab 198: Mixins
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript mixins:
 * 
 * - Mixin pattern
 * - Composing behaviors
 * - Constrained mixins
 * - Decorator pattern
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create mixin functions
 * 2. Compose multiple mixins
 * 3. Use constrained mixins
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Mixin Pattern
console.log("--- Basic Mixin ---");

type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        createdAt = new Date();
        updatedAt = new Date();
        
        touch() {
            this.updatedAt = new Date();
        }
    };
}

class User {
    constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);
const user = new TimestampedUser("John");

console.log("User:", user.name);
console.log("Created:", user.createdAt);

// Solution 2: Multiple Mixins
console.log("\n--- Multiple Mixins ---");

function Activatable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        isActive = false;
        
        activate() {
            this.isActive = true;
        }
        
        deactivate() {
            this.isActive = false;
        }
    };
}

function Taggable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        tags: string[] = [];
        
        addTag(tag: string) {
            this.tags.push(tag);
        }
        
        removeTag(tag: string) {
            this.tags = this.tags.filter(t => t !== tag);
        }
    };
}

class Entity {
    constructor(public id: number) {}
}

const EnhancedEntity = Taggable(Activatable(Timestamped(Entity)));
const entity = new EnhancedEntity(1);

entity.activate();
entity.addTag("important");
console.log("Entity:", entity.id, entity.isActive, entity.tags);

// Solution 3: Constrained Mixins
console.log("\n--- Constrained Mixins ---");

interface HasName {
    name: string;
}

function Greetable<TBase extends Constructor<HasName>>(Base: TBase) {
    return class extends Base {
        greet() {
            return `Hello, I'm ${this.name}`;
        }
    };
}

class Person {
    constructor(public name: string, public age: number) {}
}

const GreetablePerson = Greetable(Person);
const person = new GreetablePerson("John", 30);
console.log(person.greet());

// Solution 4: Mixin with Methods
console.log("\n--- Mixin with Methods ---");

function Serializable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        serialize(): string {
            return JSON.stringify(this);
        }
        
        static deserialize<T>(this: new (...args: any[]) => T, json: string): T {
            return Object.assign(new this(), JSON.parse(json));
        }
    };
}

class Product {
    constructor(public name: string, public price: number) {}
}

const SerializableProduct = Serializable(Product);
const product = new SerializableProduct("Widget", 9.99);
console.log("Serialized:", product.serialize());

// Solution 5: Mixin with Private State
console.log("\n--- Mixin with Private State ---");

function Loggable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        private logs: string[] = [];
        
        log(message: string) {
            this.logs.push(`[${new Date().toISOString()}] ${message}`);
        }
        
        getLogs(): string[] {
            return [...this.logs];
        }
        
        clearLogs() {
            this.logs = [];
        }
    };
}

class Service {
    constructor(public name: string) {}
}

const LoggableService = Loggable(Service);
const service = new LoggableService("API");
service.log("Started");
service.log("Processing request");
console.log("Logs:", service.getLogs());

// Solution 6: Mixin Factory
console.log("\n--- Mixin Factory ---");

function Validatable<TBase extends Constructor>(
    Base: TBase,
    validator: (instance: InstanceType<TBase>) => boolean
) {
    return class extends Base {
        validate(): boolean {
            return validator(this as any);
        }
    };
}

class Email {
    constructor(public address: string) {}
}

const ValidatableEmail = Validatable(
    Email,
    (email) => email.address.includes("@")
);

const email = new ValidatableEmail("john@example.com");
console.log("Valid:", email.validate());

// Solution 7: Composable Mixins
console.log("\n--- Composable Mixins ---");

function compose<T extends Constructor>(...mixins: ((base: T) => T)[]) {
    return (Base: T) => mixins.reduce((acc, mixin) => mixin(acc), Base);
}

class BaseModel {
    constructor(public id: number) {}
}

const EnhancedModel = compose(
    Timestamped,
    Activatable,
    Loggable
)(BaseModel);

const model = new EnhancedModel(1);
model.activate();
model.log("Model created");
console.log("Model:", model.id, model.isActive);

// Solution 8: Interface Merging with Mixins
console.log("\n--- Interface Merging ---");

interface TimestampedClass {
    createdAt: Date;
    updatedAt: Date;
    touch(): void;
}

interface ActivatableClass {
    isActive: boolean;
    activate(): void;
    deactivate(): void;
}

// Declare merged interface
interface EnhancedUser extends TimestampedClass, ActivatableClass {}

class EnhancedUser extends Activatable(Timestamped(User)) {}

const enhancedUser = new EnhancedUser("Jane");
enhancedUser.activate();
console.log("Enhanced user:", enhancedUser.name, enhancedUser.isActive);

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

// Observable mixin
function Observable<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        private observers: Map<string, Function[]> = new Map();
        
        on(event: string, handler: Function) {
            const handlers = this.observers.get(event) ?? [];
            handlers.push(handler);
            this.observers.set(event, handlers);
        }
        
        emit(event: string, ...args: unknown[]) {
            const handlers = this.observers.get(event) ?? [];
            handlers.forEach(h => h(...args));
        }
    };
}

class Store {
    private data: Record<string, unknown> = {};
    
    get(key: string): unknown {
        return this.data[key];
    }
    
    set(key: string, value: unknown) {
        this.data[key] = value;
    }
}

const ObservableStore = Observable(Store);
const store = new ObservableStore();

store.on("change", (key: string, value: unknown) => {
    console.log(`Store changed: ${key} = ${value}`);
});

store.set("name", "John");
store.emit("change", "name", "John");

