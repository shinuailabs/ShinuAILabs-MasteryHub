/**
 * Lab 199: Decorators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript decorators:
 * 
 * - Class decorators
 * - Method decorators
 * - Property decorators
 * - Parameter decorators
 * 
 * Note: Enable experimentalDecorators in tsconfig.json
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create class decorators
 * 2. Create method decorators
 * 3. Use decorator factories
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Class Decorator
console.log("--- Class Decorator ---");

function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

function Logger(prefix: string) {
    return function<T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                console.log(`${prefix}: Instance created`);
            }
        };
    };
}

@Sealed
@Logger("User")
class User {
    constructor(public name: string) {}
}

const user = new User("John");
console.log("User:", user.name);

// Solution 2: Method Decorator
console.log("\n--- Method Decorator ---");

function Log(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${propertyKey} with:`, args);
        const result = original.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };
    
    return descriptor;
}

class Calculator {
    @Log
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(5, 3);

// Solution 3: Property Decorator
console.log("\n--- Property Decorator ---");

function Required(target: any, propertyKey: string) {
    let value: any;
    
    const getter = () => value;
    const setter = (newValue: any) => {
        if (newValue === undefined || newValue === null) {
            throw new Error(`${propertyKey} is required`);
        }
        value = newValue;
    };
    
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}

class Product {
    @Required
    name!: string;
    
    price: number = 0;
}

const product = new Product();
product.name = "Widget";
console.log("Product:", product.name);

// Solution 4: Decorator Factory
console.log("\n--- Decorator Factory ---");

function MinLength(min: number) {
    return function(target: any, propertyKey: string) {
        let value: string;
        
        Object.defineProperty(target, propertyKey, {
            get: () => value,
            set: (newValue: string) => {
                if (newValue.length < min) {
                    throw new Error(`${propertyKey} must be at least ${min} characters`);
                }
                value = newValue;
            }
        });
    };
}

function Range(min: number, max: number) {
    return function(target: any, propertyKey: string) {
        let value: number;
        
        Object.defineProperty(target, propertyKey, {
            get: () => value,
            set: (newValue: number) => {
                if (newValue < min || newValue > max) {
                    throw new Error(`${propertyKey} must be between ${min} and ${max}`);
                }
                value = newValue;
            }
        });
    };
}

class Person {
    @MinLength(2)
    name!: string;
    
    @Range(0, 150)
    age!: number;
}

const person = new Person();
person.name = "John";
person.age = 30;
console.log("Person:", person.name, person.age);

// Solution 5: Method Timing Decorator
console.log("\n--- Timing Decorator ---");

function Timing(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        const start = performance.now();
        const result = original.apply(this, args);
        const end = performance.now();
        console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
        return result;
    };
    
    return descriptor;
}

class DataProcessor {
    @Timing
    process(data: number[]): number {
        return data.reduce((a, b) => a + b, 0);
    }
}

const processor = new DataProcessor();
processor.process([1, 2, 3, 4, 5]);

// Solution 6: Memoization Decorator
console.log("\n--- Memoization Decorator ---");

function Memoize(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    const cache = new Map<string, any>();
    
    descriptor.value = function(...args: any[]) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("Cache hit");
            return cache.get(key);
        }
        console.log("Cache miss");
        const result = original.apply(this, args);
        cache.set(key, result);
        return result;
    };
    
    return descriptor;
}

class Fibonacci {
    @Memoize
    calculate(n: number): number {
        if (n <= 1) return n;
        return this.calculate(n - 1) + this.calculate(n - 2);
    }
}

const fib = new Fibonacci();
console.log("Fib(10):", fib.calculate(10));
console.log("Fib(10) again:", fib.calculate(10));

// Solution 7: Practical Example
console.log("\n--- Practical Example ---");

function Validate(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        for (const arg of args) {
            if (arg === undefined || arg === null) {
                throw new Error(`Invalid argument in ${propertyKey}`);
            }
        }
        return original.apply(this, args);
    };
    
    return descriptor;
}

function Catch(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        try {
            return original.apply(this, args);
        } catch (error) {
            console.error(`Error in ${propertyKey}:`, error);
            return null;
        }
    };
    
    return descriptor;
}

class UserService {
    @Catch
    @Validate
    createUser(name: string, email: string): object {
        return { name, email };
    }
}

const service = new UserService();
console.log(service.createUser("John", "john@example.com"));

