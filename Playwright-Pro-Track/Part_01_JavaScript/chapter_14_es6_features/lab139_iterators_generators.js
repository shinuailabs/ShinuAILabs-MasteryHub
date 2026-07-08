/**
 * Lab 139: Iterators and Generators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Custom iteration with iterators and generators:
 * 
 * - Iterator protocol
 * - Generator functions
 * - yield keyword
 * - for...of loop
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom iterators
 * 2. Use generator functions
 * 3. Implement lazy evaluation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Iterator Protocol
console.log("--- Iterator Protocol ---");

const range = {
    start: 1,
    end: 5,
    
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        
        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

console.log("Range:", [...range]);

for (const num of range) {
    console.log("Num:", num);
}

// Solution 2: Basic Generator
console.log("\n--- Basic Generator ---");

function* simpleGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { done: true }

// Solution 3: Generator with Loop
console.log("\n--- Generator with Loop ---");

function* rangeGenerator(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

console.log("Range generator:", [...rangeGenerator(1, 5)]);

// Solution 4: Infinite Generator
console.log("\n--- Infinite Generator ---");

function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const infinite = infiniteSequence();
console.log("First 5:", [
    infinite.next().value,
    infinite.next().value,
    infinite.next().value,
    infinite.next().value,
    infinite.next().value
]);

// Solution 5: Generator with Return
console.log("\n--- Generator Return ---");

function* withReturn() {
    yield 1;
    yield 2;
    return "done";
    yield 3; // Never reached
}

const genReturn = withReturn();
console.log(genReturn.next());
console.log(genReturn.next());
console.log(genReturn.next()); // { value: "done", done: true }

// Solution 6: Passing Values to Generator
console.log("\n--- Passing Values ---");

function* conversation() {
    const name = yield "What is your name?";
    const age = yield `Hello ${name}! How old are you?`;
    yield `${name} is ${age} years old.`;
}

const chat = conversation();
console.log(chat.next().value);
console.log(chat.next("John").value);
console.log(chat.next(30).value);

// Solution 7: yield* Delegation
console.log("\n--- yield* Delegation ---");

function* inner() {
    yield 2;
    yield 3;
}

function* outer() {
    yield 1;
    yield* inner();
    yield 4;
}

console.log("Delegated:", [...outer()]);

// Solution 8: Generator for Tree Traversal
console.log("\n--- Tree Traversal ---");

const tree = {
    value: 1,
    children: [
        { value: 2, children: [{ value: 4 }, { value: 5 }] },
        { value: 3, children: [{ value: 6 }] }
    ]
};

function* traverse(node) {
    yield node.value;
    if (node.children) {
        for (const child of node.children) {
            yield* traverse(child);
        }
    }
}

console.log("Tree values:", [...traverse(tree)]);

// Solution 9: Lazy Evaluation
console.log("\n--- Lazy Evaluation ---");

function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

function take(gen, n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(gen.next().value);
    }
    return result;
}

console.log("First 10 Fibonacci:", take(fibonacci(), 10));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Paginated data
function* paginate(items, pageSize) {
    for (let i = 0; i < items.length; i += pageSize) {
        yield items.slice(i, i + pageSize);
    }
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pages = paginate(data, 3);

console.log("Page 1:", pages.next().value);
console.log("Page 2:", pages.next().value);
console.log("Page 3:", pages.next().value);
console.log("Page 4:", pages.next().value);

// ID generator
function* idGenerator(prefix = "id") {
    let id = 1;
    while (true) {
        yield `${prefix}_${id++}`;
    }
}

const userIds = idGenerator("user");
console.log("ID 1:", userIds.next().value);
console.log("ID 2:", userIds.next().value);
console.log("ID 3:", userIds.next().value);

