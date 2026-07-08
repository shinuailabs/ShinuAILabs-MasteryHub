/**
 * Lab 148: Composition over Inheritance
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Favor composition over inheritance:
 *
 * - Mixins
 * - Object composition
 * - Delegation
 * - Flexible design
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use mixins
 * 2. Compose objects
 * 3. Implement delegation
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Composition
console.log("--- Basic Composition ---");

const canWalk = {
    walk() {
        return `${this.name} is walking`;
    }
};

const canSwim = {
    swim() {
        return `${this.name} is swimming`;
    }
};

const canFly = {
    fly() {
        return `${this.name} is flying`;
    }
};

function createDuck(name) {
    return Object.assign(
        { name },
        canWalk,
        canSwim,
        canFly
    );
}

const duck = createDuck("Donald");
console.log(duck.walk());
console.log(duck.swim());
console.log(duck.fly());

// Solution 2: Mixins with Classes
console.log("\n--- Mixins with Classes ---");

const Serializable = (Base) => class extends Base {
    toJSON() {
        return JSON.stringify(this);
    }

    static fromJSON(json) {
        return Object.assign(new this(), JSON.parse(json));
    }
};

const Timestamped = (Base) => class extends Base {
    constructor(...args) {
        super(...args);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    touch() {
        this.updatedAt = new Date();
    }
};

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

class EnhancedUser extends Timestamped(Serializable(User)) {}

const user = new EnhancedUser("John", "john@example.com");
console.log("User:", user.toJSON());
console.log("Created:", user.createdAt);

// Solution 3: Delegation Pattern
console.log("\n--- Delegation ---");

class Engine {
    start() { return "Engine started"; }
    stop() { return "Engine stopped"; }
}

class Wheels {
    roll() { return "Wheels rolling"; }
    brake() { return "Wheels braking"; }
}

class Car {
    constructor() {
        this.engine = new Engine();
        this.wheels = new Wheels();
    }

    start() {
        return this.engine.start();
    }

    drive() {
        return `${this.engine.start()}, ${this.wheels.roll()}`;
    }

    stop() {
        return `${this.wheels.brake()}, ${this.engine.stop()}`;
    }
}

const car = new Car();
console.log("Drive:", car.drive());
console.log("Stop:", car.stop());

// Solution 4: Strategy Composition
console.log("\n--- Strategy Composition ---");

const sortStrategies = {
    byName: (a, b) => a.name.localeCompare(b.name),
    byAge: (a, b) => a.age - b.age,
    byDate: (a, b) => new Date(a.date) - new Date(b.date)
};

class DataSorter {
    constructor(strategy = sortStrategies.byName) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    sort(data) {
        return [...data].sort(this.strategy);
    }
}

const people = [
    { name: "Charlie", age: 25 },
    { name: "Alice", age: 30 },
    { name: "Bob", age: 20 }
];

const sorter = new DataSorter();
console.log("By name:", sorter.sort(people).map(p => p.name));
sorter.setStrategy(sortStrategies.byAge);
console.log("By age:", sorter.sort(people).map(p => p.name));

// Solution 5: Behavior Composition
console.log("\n--- Behavior Composition ---");

function withLogging(obj) {
    const logged = {};

    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "function") {
            logged[key] = function(...args) {
                console.log(`Calling ${key} with`, args);
                const result = obj[key].apply(this, args);
                console.log(`${key} returned`, result);
                return result;
            };
        } else {
            logged[key] = obj[key];
        }
    }

    return logged;
}

const calculator = {
    add(a, b) { return a + b; },
    multiply(a, b) { return a * b; }
};

const loggedCalc = withLogging(calculator);
loggedCalc.add(2, 3);

// Solution 6: Component System
console.log("\n--- Component System ---");

class Entity {
    constructor(name) {
        this.name = name;
        this.components = new Map();
    }

    addComponent(name, component) {
        this.components.set(name, component);
        component.entity = this;
        return this;
    }

    getComponent(name) {
        return this.components.get(name);
    }

    update() {
        for (const component of this.components.values()) {
            if (component.update) component.update();
        }
    }
}

const PositionComponent = { x: 0, y: 0 };
const VelocityComponent = { vx: 1, vy: 1 };
const RenderComponent = {
    render() {
        const pos = this.entity.getComponent("position");
        console.log(`Rendering at (${pos.x}, ${pos.y})`);
    }
};

const player = new Entity("Player")
    .addComponent("position", { ...PositionComponent })
    .addComponent("velocity", { ...VelocityComponent })
    .addComponent("render", { ...RenderComponent });

player.getComponent("render").render();

// Solution 7: Functional Composition
console.log("\n--- Functional Composition ---");

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const addTax = (price) => price * 1.1;
const addShipping = (price) => price + 5;
const applyDiscount = (price) => price * 0.9;

const calculateTotal = pipe(addTax, addShipping, applyDiscount);
console.log("Total:", calculateTotal(100).toFixed(2));

// Solution 8: Builder with Composition
console.log("\n--- Builder Composition ---");

class RequestBuilder {
    constructor() {
        this.config = { method: "GET", headers: {} };
    }

    url(url) { this.config.url = url; return this; }
    method(method) { this.config.method = method; return this; }
    header(key, value) { this.config.headers[key] = value; return this; }
    body(data) { this.config.body = data; return this; }

    build() { return { ...this.config }; }
}

const request = new RequestBuilder()
    .url("/api/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .body({ name: "John" })
    .build();

console.log("Request:", request);
