/**
 * Lab 144: Getters and Setters
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Accessor properties in classes:
 * 
 * - get keyword for getters
 * - set keyword for setters
 * - Computed properties
 * - Validation in setters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create getters and setters
 * 2. Add validation
 * 3. Use computed properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Getters and Setters
console.log("--- Basic Getters/Setters ---");

class Person {
    constructor(firstName, lastName) {
        this._firstName = firstName;
        this._lastName = lastName;
    }
    
    get firstName() {
        return this._firstName;
    }
    
    set firstName(value) {
        this._firstName = value;
    }
    
    get lastName() {
        return this._lastName;
    }
    
    set lastName(value) {
        this._lastName = value;
    }
    
    get fullName() {
        return `${this._firstName} ${this._lastName}`;
    }
    
    set fullName(value) {
        const [first, last] = value.split(" ");
        this._firstName = first;
        this._lastName = last;
    }
}

const person = new Person("John", "Doe");
console.log("Full name:", person.fullName);
person.fullName = "Jane Smith";
console.log("New name:", person.firstName, person.lastName);

// Solution 2: Validation in Setters
console.log("\n--- Validation ---");

class User {
    constructor(email, age) {
        this.email = email; // Uses setter
        this.age = age;     // Uses setter
    }
    
    get email() {
        return this._email;
    }
    
    set email(value) {
        if (!value.includes("@")) {
            throw new Error("Invalid email format");
        }
        this._email = value.toLowerCase();
    }
    
    get age() {
        return this._age;
    }
    
    set age(value) {
        if (value < 0 || value > 150) {
            throw new Error("Invalid age");
        }
        this._age = value;
    }
}

const user = new User("John@Example.com", 30);
console.log("Email:", user.email);
console.log("Age:", user.age);

// Solution 3: Computed Properties
console.log("\n--- Computed Properties ---");

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    
    get area() {
        return this.width * this.height;
    }
    
    get perimeter() {
        return 2 * (this.width + this.height);
    }
    
    get diagonal() {
        return Math.sqrt(this.width ** 2 + this.height ** 2);
    }
}

const rect = new Rectangle(3, 4);
console.log("Area:", rect.area);
console.log("Perimeter:", rect.perimeter);
console.log("Diagonal:", rect.diagonal);

// Solution 4: Read-Only Properties
console.log("\n--- Read-Only ---");

class Circle {
    constructor(radius) {
        this._radius = radius;
        this._createdAt = new Date();
    }
    
    get radius() {
        return this._radius;
    }
    
    set radius(value) {
        if (value <= 0) {
            throw new Error("Radius must be positive");
        }
        this._radius = value;
    }
    
    // Read-only (no setter)
    get createdAt() {
        return this._createdAt;
    }
    
    get area() {
        return Math.PI * this._radius ** 2;
    }
    
    get circumference() {
        return 2 * Math.PI * this._radius;
    }
}

const circle = new Circle(5);
console.log("Radius:", circle.radius);
console.log("Area:", circle.area.toFixed(2));
console.log("Created:", circle.createdAt);

// Solution 5: Lazy Evaluation
console.log("\n--- Lazy Evaluation ---");

class DataProcessor {
    constructor(data) {
        this._data = data;
        this._processedData = null;
    }
    
    get processedData() {
        if (this._processedData === null) {
            console.log("Processing data...");
            this._processedData = this._data.map(x => x * 2);
        }
        return this._processedData;
    }
}

const processor = new DataProcessor([1, 2, 3, 4, 5]);
console.log("First access:", processor.processedData);
console.log("Second access:", processor.processedData); // Cached

// Solution 6: Chained Setters
console.log("\n--- Chained Setters ---");

class QueryBuilder {
    constructor() {
        this._table = "";
        this._columns = "*";
        this._conditions = [];
    }
    
    get table() { return this._table; }
    set table(value) { this._table = value; }
    
    get columns() { return this._columns; }
    set columns(value) { this._columns = value; }
    
    from(table) {
        this.table = table;
        return this;
    }
    
    select(columns) {
        this.columns = columns;
        return this;
    }
    
    where(condition) {
        this._conditions.push(condition);
        return this;
    }
    
    get query() {
        let sql = `SELECT ${this._columns} FROM ${this._table}`;
        if (this._conditions.length > 0) {
            sql += ` WHERE ${this._conditions.join(" AND ")}`;
        }
        return sql;
    }
}

const query = new QueryBuilder()
    .from("users")
    .select("name, email")
    .where("active = true")
    .where("age > 18")
    .query;

console.log("Query:", query);

// Solution 7: Temperature Converter
console.log("\n--- Temperature Converter ---");

class Temperature {
    constructor(celsius) {
        this._celsius = celsius;
    }
    
    get celsius() {
        return this._celsius;
    }
    
    set celsius(value) {
        this._celsius = value;
    }
    
    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    }
    
    set fahrenheit(value) {
        this._celsius = (value - 32) * 5/9;
    }
    
    get kelvin() {
        return this._celsius + 273.15;
    }
    
    set kelvin(value) {
        this._celsius = value - 273.15;
    }
}

const temp = new Temperature(25);
console.log("Celsius:", temp.celsius);
console.log("Fahrenheit:", temp.fahrenheit);
console.log("Kelvin:", temp.kelvin);

temp.fahrenheit = 100;
console.log("After setting F=100, C=", temp.celsius.toFixed(2));

// Solution 8: Observable Property
console.log("\n--- Observable Property ---");

class Observable {
    constructor(value) {
        this._value = value;
        this._listeners = [];
    }
    
    get value() {
        return this._value;
    }
    
    set value(newValue) {
        const oldValue = this._value;
        this._value = newValue;
        this._listeners.forEach(fn => fn(newValue, oldValue));
    }
    
    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }
}

const counter = new Observable(0);
counter.subscribe((newVal, oldVal) => {
    console.log(`Changed from ${oldVal} to ${newVal}`);
});

counter.value = 1;
counter.value = 2;

