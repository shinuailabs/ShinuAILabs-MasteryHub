/**
 * Lab 212: Intersection Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Combining types with intersection:
 * 
 * - Intersection syntax
 * - Combining interfaces
 * - Mixins pattern
 * - Practical uses
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create intersection types
 * 2. Combine multiple types
 * 3. Use with interfaces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Intersection
console.log("--- Basic Intersection ---");

type HasName = {
    name: string;
};

type HasAge = {
    age: number;
};

type Person = HasName & HasAge;

const person: Person = {
    name: "John",
    age: 30
};

console.log("Person:", person);

// Solution 2: Combining Interfaces
console.log("\n--- Combining Interfaces ---");

interface Identifiable {
    id: number;
}

interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface Auditable {
    createdBy: string;
    modifiedBy: string;
}

type Entity = Identifiable & Timestamped & Auditable;

const entity: Entity = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin",
    modifiedBy: "admin"
};

console.log("Entity ID:", entity.id);

// Solution 3: Intersection with Type Alias
console.log("\n--- Type Alias Intersection ---");

type User = {
    username: string;
    email: string;
};

type Admin = User & {
    adminLevel: number;
    permissions: string[];
};

const admin: Admin = {
    username: "admin",
    email: "admin@example.com",
    adminLevel: 1,
    permissions: ["read", "write", "delete"]
};

console.log("Admin:", admin.username);

// Solution 4: Function Intersection
console.log("\n--- Function Intersection ---");

type Logger = {
    log(message: string): void;
};

type ErrorHandler = {
    handleError(error: Error): void;
};

type Service = Logger & ErrorHandler;

const service: Service = {
    log(message: string) {
        console.log(`[LOG] ${message}`);
    },
    handleError(error: Error) {
        console.log(`[ERROR] ${error.message}`);
    }
};

service.log("Service started");

// Solution 5: Mixin Pattern
console.log("\n--- Mixin Pattern ---");

type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        createdAt = new Date();
        updatedAt = new Date();
    };
}

function Named<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        name = "";
        setName(name: string) {
            this.name = name;
        }
    };
}

class BaseClass {}
const TimestampedNamed = Timestamped(Named(BaseClass));
const instance = new TimestampedNamed();
instance.setName("Test");
console.log("Mixin instance:", instance.name);

// Solution 6: Intersection with Generics
console.log("\n--- Generic Intersection ---");

type WithId<T> = T & { id: number };
type WithTimestamp<T> = T & { timestamp: Date };

type UserData = {
    name: string;
    email: string;
};

type UserRecord = WithId<WithTimestamp<UserData>>;

const userRecord: UserRecord = {
    id: 1,
    name: "John",
    email: "john@example.com",
    timestamp: new Date()
};

console.log("User record:", userRecord);

// Solution 7: Intersection vs Union
console.log("\n--- Intersection vs Union ---");

type A = { a: string; shared: number };
type B = { b: string; shared: number };

// Union: A OR B
type AorB = A | B;

// Intersection: A AND B
type AandB = A & B;

const intersection: AandB = {
    a: "value a",
    b: "value b",
    shared: 42
};

console.log("Intersection:", intersection);

// Solution 8: Practical API Types
console.log("\n--- API Types ---");

type BaseResponse = {
    status: number;
    timestamp: Date;
};

type SuccessData<T> = {
    success: true;
    data: T;
};

type ErrorData = {
    success: false;
    error: string;
};

type ApiSuccess<T> = BaseResponse & SuccessData<T>;
type ApiError = BaseResponse & ErrorData;

const successResponse: ApiSuccess<User> = {
    status: 200,
    timestamp: new Date(),
    success: true,
    data: { username: "john", email: "john@example.com" }
};

console.log("Success:", successResponse.data);

// Solution 9: Extending Functionality
console.log("\n--- Extending Functionality ---");

type Serializable = {
    serialize(): string;
};

type Comparable<T> = {
    compareTo(other: T): number;
};

type Cloneable<T> = {
    clone(): T;
};

type FullFeatured<T> = T & Serializable & Comparable<T> & Cloneable<T>;

// Solution 10: Real-World Example
console.log("\n--- Real-World Example ---");

// Base types
type Product = {
    name: string;
    price: number;
};

type Inventory = {
    sku: string;
    quantity: number;
};

type Shipping = {
    weight: number;
    dimensions: { width: number; height: number; depth: number };
};

// Combined product type
type FullProduct = Product & Inventory & Shipping;

const product: FullProduct = {
    name: "Laptop",
    price: 999.99,
    sku: "LAP-001",
    quantity: 50,
    weight: 2.5,
    dimensions: { width: 35, height: 25, depth: 2 }
};

console.log("Product:", product.name, "SKU:", product.sku);

