/**
 * Lab 187: Class Interfaces
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing interfaces in classes:
 *
 * - implements keyword
 * - Multiple interfaces
 * - Interface vs abstract class
 * - Static interface members
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement interfaces in classes
 * 2. Use multiple interfaces
 * 3. Understand implementation rules
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Interface Implementation
console.log("--- Basic Implementation ---");

interface Animal {
    name: string;
    age: number;
    speak(): void;
}

class Dog implements Animal {
    constructor(public name: string, public age: number) {}

    speak(): void {
        console.log(`${this.name} says: Woof!`);
    }
}

class Cat implements Animal {
    constructor(public name: string, public age: number) {}

    speak(): void {
        console.log(`${this.name} says: Meow!`);
    }
}

const dog = new Dog("Rex", 3);
const cat = new Cat("Whiskers", 2);
dog.speak();
cat.speak();

// Solution 2: Multiple Interface Implementation
console.log("\n--- Multiple Interfaces ---");

interface Printable {
    print(): void;
}

interface Serializable {
    serialize(): string;
}

interface Comparable<T> {
    compareTo(other: T): number;
}

class Document implements Printable, Serializable {
    constructor(public title: string, public content: string) {}

    print(): void {
        console.log(`Title: ${this.title}\n${this.content}`);
    }

    serialize(): string {
        return JSON.stringify({ title: this.title, content: this.content });
    }
}

const doc = new Document("Report", "This is the content");
doc.print();
console.log("Serialized:", doc.serialize());

// Solution 3: Interface with Optional Members
console.log("\n--- Optional Members ---");

interface Logger {
    log(message: string): void;
    warn?(message: string): void;
    error?(message: string): void;
}

class SimpleLogger implements Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

class FullLogger implements Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }

    warn(message: string): void {
        console.log(`[WARN] ${message}`);
    }

    error(message: string): void {
        console.log(`[ERROR] ${message}`);
    }
}

const simple = new SimpleLogger();
const full = new FullLogger();
simple.log("Simple message");
full.warn("Warning message");

// Solution 4: Generic Interface Implementation
console.log("\n--- Generic Interface ---");

interface Repository<T> {
    find(id: number): T | null;
    findAll(): T[];
    save(item: T): void;
    delete(id: number): void;
}

interface User {
    id: number;
    name: string;
}

class UserRepository implements Repository<User> {
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

    delete(id: number): void {
        this.users = this.users.filter(u => u.id !== id);
    }
}

const repo = new UserRepository();
repo.save({ id: 1, name: "John" });
console.log("Users:", repo.findAll());

// Solution 5: Interface Extending Class
console.log("\n--- Interface Extending Class ---");

class Control {
    private state: boolean = false;

    activate(): void {
        this.state = true;
    }
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select(): void {
        console.log("Button selected");
    }
}

const button = new Button();
button.activate();
button.select();

// Solution 6: Constructor Interface
console.log("\n--- Constructor Interface ---");

interface PointConstructor {
    new (x: number, y: number): Point;
}

interface Point {
    x: number;
    y: number;
    distanceTo(other: Point): number;
}

class Point2D implements Point {
    constructor(public x: number, public y: number) {}

    distanceTo(other: Point): number {
        return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2);
    }
}

function createPoint(ctor: PointConstructor, x: number, y: number): Point {
    return new ctor(x, y);
}

const p1 = createPoint(Point2D, 0, 0);
const p2 = createPoint(Point2D, 3, 4);
console.log("Distance:", p1.distanceTo(p2));

// Solution 7: Interface vs Abstract Class
console.log("\n--- Interface vs Abstract ---");

// Interface - no implementation
interface Shape {
    getArea(): number;
    getPerimeter(): number;
}

// Abstract class - partial implementation
abstract class BaseShape implements Shape {
    abstract getArea(): number;
    abstract getPerimeter(): number;

    describe(): string {
        return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
    }
}

class Circle extends BaseShape {
    constructor(public radius: number) {
        super();
    }

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

const circle = new Circle(5);
console.log(circle.describe());

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

interface EventEmitter {
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    emit(event: string, ...args: unknown[]): void;
}

class MyEventEmitter implements EventEmitter {
    private handlers: Map<string, Function[]> = new Map();

    on(event: string, handler: Function): void {
        const handlers = this.handlers.get(event) ?? [];
        handlers.push(handler);
        this.handlers.set(event, handlers);
    }

    off(event: string, handler: Function): void {
        const handlers = this.handlers.get(event) ?? [];
        this.handlers.set(event, handlers.filter(h => h !== handler));
    }

    emit(event: string, ...args: unknown[]): void {
        const handlers = this.handlers.get(event) ?? [];
        handlers.forEach(h => h(...args));
    }
}

const emitter = new MyEventEmitter();
emitter.on("message", (msg: string) => console.log("Received:", msg));
emitter.emit("message", "Hello!");
