/**
 * Lab 146: Polymorphism
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Polymorphism in JavaScript:
 * 
 * - Method overriding
 * - Duck typing
 * - Interface-like patterns
 * - Runtime polymorphism
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement polymorphic behavior
 * 2. Use duck typing
 * 3. Create interface patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Method Overriding
console.log("--- Method Overriding ---");

class Shape {
    getArea() {
        throw new Error("getArea must be implemented");
    }
    
    describe() {
        return `This shape has area: ${this.getArea()}`;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    getArea() {
        return this.width * this.height;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super();
        this.base = base;
        this.height = height;
    }
    
    getArea() {
        return 0.5 * this.base * this.height;
    }
}

// Polymorphic usage
const shapes = [
    new Rectangle(10, 5),
    new Circle(7),
    new Triangle(8, 6)
];

shapes.forEach(shape => {
    console.log(shape.describe());
});

// Solution 2: Duck Typing
console.log("\n--- Duck Typing ---");

// If it walks like a duck and quacks like a duck...
function makeSound(animal) {
    if (typeof animal.speak === "function") {
        return animal.speak();
    }
    return "Cannot speak";
}

const dog = { speak: () => "Woof!" };
const cat = { speak: () => "Meow!" };
const rock = { weight: 5 };

console.log("Dog:", makeSound(dog));
console.log("Cat:", makeSound(cat));
console.log("Rock:", makeSound(rock));

// Solution 3: Interface Pattern
console.log("\n--- Interface Pattern ---");

// Define expected interface
const Drawable = {
    draw() { throw new Error("draw() must be implemented"); }
};

class Button {
    constructor(label) {
        this.label = label;
    }
    
    draw() {
        return `[${this.label}]`;
    }
}

class TextBox {
    constructor(placeholder) {
        this.placeholder = placeholder;
    }
    
    draw() {
        return `|${this.placeholder}|`;
    }
}

function renderUI(components) {
    return components.map(c => c.draw()).join(" ");
}

const ui = [new Button("Submit"), new TextBox("Enter name"), new Button("Cancel")];
console.log("UI:", renderUI(ui));

// Solution 4: Strategy Pattern
console.log("\n--- Strategy Pattern ---");

class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    process(amount) {
        return this.strategy.pay(amount);
    }
}

const creditCard = {
    pay(amount) {
        return `Paid $${amount} with Credit Card`;
    }
};

const paypal = {
    pay(amount) {
        return `Paid $${amount} with PayPal`;
    }
};

const bitcoin = {
    pay(amount) {
        return `Paid $${amount} with Bitcoin`;
    }
};

const processor = new PaymentProcessor(creditCard);
console.log(processor.process(100));

processor.strategy = paypal;
console.log(processor.process(50));

// Solution 5: Polymorphic Collections
console.log("\n--- Polymorphic Collections ---");

class Employee {
    constructor(name, baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }
    
    calculatePay() {
        return this.baseSalary;
    }
}

class Manager extends Employee {
    constructor(name, baseSalary, bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }
    
    calculatePay() {
        return this.baseSalary + this.bonus;
    }
}

class SalesRep extends Employee {
    constructor(name, baseSalary, commission, sales) {
        super(name, baseSalary);
        this.commission = commission;
        this.sales = sales;
    }
    
    calculatePay() {
        return this.baseSalary + (this.sales * this.commission);
    }
}

const employees = [
    new Employee("John", 50000),
    new Manager("Jane", 70000, 15000),
    new SalesRep("Bob", 40000, 0.1, 100000)
];

const totalPayroll = employees.reduce((sum, emp) => sum + emp.calculatePay(), 0);
console.log("Total payroll:", totalPayroll);

employees.forEach(emp => {
    console.log(`${emp.name}: $${emp.calculatePay()}`);
});

// Solution 6: Visitor Pattern
console.log("\n--- Visitor Pattern ---");

class FileVisitor {
    visitFile(file) { return `File: ${file.name}`; }
    visitFolder(folder) { return `Folder: ${folder.name}`; }
}

class SizeVisitor {
    visitFile(file) { return file.size; }
    visitFolder(folder) {
        return folder.children.reduce((sum, child) => {
            return sum + child.accept(this);
        }, 0);
    }
}

class File {
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
    accept(visitor) { return visitor.visitFile(this); }
}

class Folder {
    constructor(name, children = []) {
        this.name = name;
        this.children = children;
    }
    accept(visitor) { return visitor.visitFolder(this); }
}

const root = new Folder("root", [
    new File("a.txt", 100),
    new Folder("sub", [
        new File("b.txt", 200),
        new File("c.txt", 300)
    ])
]);

console.log("Total size:", root.accept(new SizeVisitor()));

// Solution 7: Polymorphic Serialization
console.log("\n--- Polymorphic Serialization ---");

class Serializable {
    toJSON() { throw new Error("toJSON must be implemented"); }
    toXML() { throw new Error("toXML must be implemented"); }
}

class User extends Serializable {
    constructor(name, email) {
        super();
        this.name = name;
        this.email = email;
    }
    
    toJSON() {
        return JSON.stringify({ name: this.name, email: this.email });
    }
    
    toXML() {
        return `<user><name>${this.name}</name><email>${this.email}</email></user>`;
    }
}

const user = new User("John", "john@example.com");
console.log("JSON:", user.toJSON());
console.log("XML:", user.toXML());

