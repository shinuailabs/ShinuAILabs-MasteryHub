/**
 * Lab 167: Intersection Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Combining types with intersections:
 * 
 * - Intersection syntax (&)
 * - Combining interfaces
 * - Mixins pattern
 * - Union vs Intersection
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create intersection types
 * 2. Combine multiple types
 * 3. Understand union vs intersection
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Intersection
console.log("--- Basic Intersection ---");

type Person = {
    name: string;
    age: number;
};

type Employee = {
    employeeId: string;
    department: string;
};

// Intersection combines both types
type PersonEmployee = Person & Employee;

const employee: PersonEmployee = {
    name: "John",
    age: 30,
    employeeId: "E123",
    department: "Engineering"
};

console.log("Employee:", employee);

// Solution 2: Interface Intersection
console.log("\n--- Interface Intersection ---");

interface Printable {
    print(): void;
}

interface Loggable {
    log(): void;
}

type PrintableLoggable = Printable & Loggable;

const document: PrintableLoggable = {
    print() {
        console.log("Printing...");
    },
    log() {
        console.log("Logging...");
    }
};

document.print();
document.log();

// Solution 3: Multiple Intersections
console.log("\n--- Multiple Intersections ---");

type HasId = { id: number };
type HasName = { name: string };
type HasEmail = { email: string };
type HasTimestamps = { createdAt: Date; updatedAt: Date };

type User = HasId & HasName & HasEmail & HasTimestamps;

const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com",
    createdAt: new Date(),
    updatedAt: new Date()
};

console.log("User:", user.name, user.email);

// Solution 4: Intersection with Generics
console.log("\n--- Generics Intersection ---");

function merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

const merged = merge(
    { name: "John" },
    { age: 30 }
);

console.log("Merged:", merged.name, merged.age);

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
console.log("Mixin instance:", instance.name, instance.createdAt);

// Solution 6: Union vs Intersection
console.log("\n--- Union vs Intersection ---");

type A = { a: string; shared: number };
type B = { b: string; shared: number };

// Union: A OR B (either type)
type AorB = A | B;
const unionValue: AorB = { a: "hello", shared: 1 }; // Only needs A's properties

// Intersection: A AND B (both types)
type AandB = A & B;
const intersectionValue: AandB = {
    a: "hello",
    b: "world",
    shared: 1
}; // Needs all properties

console.log("Union:", unionValue);
console.log("Intersection:", intersectionValue);

// Solution 7: Conflicting Properties
console.log("\n--- Conflicting Properties ---");

type TypeA = { value: string };
type TypeB = { value: number };

// Intersection of conflicting types results in never
type Conflicting = TypeA & TypeB;
// value would be string & number = never

// Solution: Use compatible types
type TypeC = { value: string | number };
type TypeD = { value: string };
type Compatible = TypeC & TypeD; // value is string

// Solution 8: Extending with Intersection
console.log("\n--- Extending Types ---");

type BaseConfig = {
    host: string;
    port: number;
};

type SSLConfig = BaseConfig & {
    ssl: boolean;
    cert?: string;
};

type AuthConfig = BaseConfig & {
    username: string;
    password: string;
};

type FullConfig = SSLConfig & AuthConfig;

const config: FullConfig = {
    host: "localhost",
    port: 443,
    ssl: true,
    username: "admin",
    password: "secret"
};

console.log("Config:", config.host, config.ssl);

// Solution 9: Intersection in Functions
console.log("\n--- Function Intersections ---");

type Logger = {
    log(message: string): void;
};

type ErrorHandler = {
    handleError(error: Error): void;
};

function createService(): Logger & ErrorHandler {
    return {
        log(message: string) {
            console.log(`[LOG] ${message}`);
        },
        handleError(error: Error) {
            console.log(`[ERROR] ${error.message}`);
        }
    };
}

const service = createService();
service.log("Service started");
service.handleError(new Error("Test error"));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Entity with metadata
type Entity = { id: number };
type Metadata = { createdAt: Date; updatedAt: Date };
type Auditable = { createdBy: string; updatedBy: string };

type AuditedEntity = Entity & Metadata & Auditable;

const auditedRecord: AuditedEntity = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "admin",
    updatedBy: "admin"
};

console.log("Audited record:", auditedRecord.id, auditedRecord.createdBy);

// Component props pattern
type BaseProps = { className?: string; style?: object };
type ClickableProps = { onClick?: () => void };
type ButtonProps = BaseProps & ClickableProps & { label: string };

const buttonProps: ButtonProps = {
    label: "Click me",
    className: "btn",
    onClick: () => console.log("Clicked!")
};

console.log("Button:", buttonProps.label);

