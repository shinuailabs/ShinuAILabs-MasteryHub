/**
 * Lab 150: OOP Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for OOP in JavaScript:
 * 
 * - SOLID principles
 * - Clean code
 * - Maintainability
 * - Testability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply SOLID principles
 * 2. Write clean OOP code
 * 3. Design for maintainability
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Single Responsibility Principle
console.log("--- Single Responsibility ---");

// BAD: Class does too much
class BadUser {
    constructor(name) { this.name = name; }
    save() { /* save to DB */ }
    sendEmail() { /* send email */ }
    generateReport() { /* generate report */ }
}

// GOOD: Separate concerns
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

class UserRepository {
    save(user) { console.log(`Saving ${user.name}`); }
    find(id) { return new User("John", "john@example.com"); }
}

class EmailService {
    send(user, message) { console.log(`Emailing ${user.email}`); }
}

const user = new User("John", "john@example.com");
const repo = new UserRepository();
repo.save(user);

// Solution 2: Open/Closed Principle
console.log("\n--- Open/Closed Principle ---");

// Open for extension, closed for modification
class Shape {
    area() { throw new Error("Must implement area"); }
}

class Rectangle extends Shape {
    constructor(w, h) { super(); this.w = w; this.h = h; }
    area() { return this.w * this.h; }
}

class Circle extends Shape {
    constructor(r) { super(); this.r = r; }
    area() { return Math.PI * this.r ** 2; }
}

// Can add new shapes without modifying existing code
function totalArea(shapes) {
    return shapes.reduce((sum, s) => sum + s.area(), 0);
}

console.log("Total:", totalArea([new Rectangle(4, 5), new Circle(3)]).toFixed(2));

// Solution 3: Liskov Substitution Principle
console.log("\n--- Liskov Substitution ---");

class Bird {
    move() { return "Moving"; }
}

class FlyingBird extends Bird {
    move() { return "Flying"; }
}

class SwimmingBird extends Bird {
    move() { return "Swimming"; }
}

// All birds can be used interchangeably
function moveBirds(birds) {
    return birds.map(b => b.move());
}

console.log(moveBirds([new FlyingBird(), new SwimmingBird()]));

// Solution 4: Interface Segregation
console.log("\n--- Interface Segregation ---");

// Instead of one large interface, use smaller ones
const Printable = { print() {} };
const Scannable = { scan() {} };
const Faxable = { fax() {} };

class SimplePrinter {
    print() { return "Printing"; }
}

class MultiFunctionPrinter {
    print() { return "Printing"; }
    scan() { return "Scanning"; }
    fax() { return "Faxing"; }
}

// Solution 5: Dependency Inversion
console.log("\n--- Dependency Inversion ---");

// Depend on abstractions, not concretions
class NotificationService {
    constructor(sender) {
        this.sender = sender; // Injected dependency
    }
    
    notify(message) {
        return this.sender.send(message);
    }
}

const emailSender = { send: (msg) => `Email: ${msg}` };
const smsSender = { send: (msg) => `SMS: ${msg}` };

const emailNotifier = new NotificationService(emailSender);
const smsNotifier = new NotificationService(smsSender);

console.log(emailNotifier.notify("Hello"));
console.log(smsNotifier.notify("Hello"));

// Solution 6: Favor Composition
console.log("\n--- Favor Composition ---");

const withLogging = (obj) => ({
    ...obj,
    log(msg) { console.log(`[LOG] ${msg}`); }
});

const withValidation = (obj) => ({
    ...obj,
    validate(data) { return data != null; }
});

const service = withLogging(withValidation({
    process(data) { return `Processed: ${data}`; }
}));

service.log("Starting");
console.log(service.validate("test"));
console.log(service.process("data"));

// Solution 7: Immutability
console.log("\n--- Immutability ---");

class ImmutableUser {
    #name;
    #email;
    
    constructor(name, email) {
        this.#name = name;
        this.#email = email;
        Object.freeze(this);
    }
    
    get name() { return this.#name; }
    get email() { return this.#email; }
    
    withName(name) { return new ImmutableUser(name, this.#email); }
    withEmail(email) { return new ImmutableUser(this.#name, email); }
}

const u1 = new ImmutableUser("John", "john@example.com");
const u2 = u1.withName("Jane");
console.log("Original:", u1.name);
console.log("New:", u2.name);

// Solution 8: Clear Naming
console.log("\n--- Clear Naming ---");

// BAD
class Mgr { proc(d) { return d; } }

// GOOD
class OrderManager {
    processOrder(orderData) {
        return { ...orderData, processed: true };
    }
}

// Solution 9: Small Classes
console.log("\n--- Small Classes ---");

// Keep classes focused and small
class EmailValidator {
    isValid(email) { return email.includes("@"); }
}

class PasswordValidator {
    isValid(password) { return password.length >= 8; }
}

class UserValidator {
    constructor() {
        this.emailValidator = new EmailValidator();
        this.passwordValidator = new PasswordValidator();
    }
    
    validate(user) {
        return {
            email: this.emailValidator.isValid(user.email),
            password: this.passwordValidator.isValid(user.password)
        };
    }
}

const validator = new UserValidator();
console.log(validator.validate({ email: "test@example.com", password: "12345678" }));

// Solution 10: Summary
console.log("\n--- Best Practices Summary ---");
console.log(`
OOP Best Practices:
1. Single Responsibility - One reason to change
2. Open/Closed - Open for extension, closed for modification
3. Liskov Substitution - Subtypes must be substitutable
4. Interface Segregation - Many specific interfaces
5. Dependency Inversion - Depend on abstractions
6. Favor Composition over Inheritance
7. Use Immutability when possible
8. Clear, descriptive naming
9. Keep classes small and focused
10. Write testable code
`);

