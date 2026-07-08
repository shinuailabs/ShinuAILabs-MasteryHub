/**
 * Lab 104: Promise Chaining
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Promise chaining allows sequential async operations.
 * 
 * Key concepts:
 * - Each then() returns a new promise
 * - Return values become next promise's value
 * - Returning a promise waits for it
 * - Errors propagate down the chain
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Chain multiple operations
 * 2. Transform data through chain
 * 3. Handle errors in chain
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Chaining
console.log("--- Basic Chaining ---");

Promise.resolve(1)
    .then(value => {
        console.log("Step 1:", value);
        return value + 1;
    })
    .then(value => {
        console.log("Step 2:", value);
        return value * 2;
    })
    .then(value => {
        console.log("Step 3:", value);
    });

// Solution 2: Chaining with Async Operations
console.log("\n--- Async Chaining ---");

function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, name: "John", departmentId: 5 }), 50);
    });
}

function fetchDepartment(id) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ id, name: "Engineering" }), 50);
    });
}

function fetchProjects(departmentId) {
    return new Promise(resolve => {
        setTimeout(() => resolve(["Project A", "Project B"]), 50);
    });
}

fetchUser(1)
    .then(user => {
        console.log("User:", user.name);
        return fetchDepartment(user.departmentId);
    })
    .then(department => {
        console.log("Department:", department.name);
        return fetchProjects(department.id);
    })
    .then(projects => {
        console.log("Projects:", projects);
    });

// Solution 3: Passing Data Through Chain
console.log("\n--- Passing Data ---");

fetchUser(1)
    .then(user => {
        return fetchDepartment(user.departmentId)
            .then(department => ({ user, department }));
    })
    .then(({ user, department }) => {
        console.log(`${user.name} works in ${department.name}`);
    });

// Solution 4: Error Handling in Chain
console.log("\n--- Error Handling ---");

function riskyOperation(shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Operation failed"));
            } else {
                resolve("Success");
            }
        }, 50);
    });
}

riskyOperation(false)
    .then(result => {
        console.log("Step 1:", result);
        return riskyOperation(true); // This will fail
    })
    .then(result => {
        console.log("Step 2:", result); // Skipped
    })
    .catch(error => {
        console.log("Caught:", error.message);
        return "Recovered";
    })
    .then(result => {
        console.log("After recovery:", result);
    });

// Solution 5: Multiple Catch Handlers
console.log("\n--- Multiple Catches ---");

Promise.resolve("start")
    .then(value => {
        throw new Error("Error 1");
    })
    .catch(error => {
        console.log("Catch 1:", error.message);
        return "recovered from 1";
    })
    .then(value => {
        console.log("After catch 1:", value);
        throw new Error("Error 2");
    })
    .catch(error => {
        console.log("Catch 2:", error.message);
    });

// Solution 6: Conditional Chaining
console.log("\n--- Conditional Chaining ---");

function processOrder(order) {
    return Promise.resolve(order)
        .then(order => {
            console.log("Validating order...");
            if (!order.items.length) {
                throw new Error("Empty order");
            }
            return order;
        })
        .then(order => {
            console.log("Calculating total...");
            order.total = order.items.reduce((sum, item) => sum + item.price, 0);
            return order;
        })
        .then(order => {
            if (order.total > 100) {
                console.log("Applying discount...");
                order.discount = order.total * 0.1;
                order.total -= order.discount;
            }
            return order;
        })
        .then(order => {
            console.log("Final order:", order);
            return order;
        });
}

processOrder({
    items: [
        { name: "Item 1", price: 50 },
        { name: "Item 2", price: 75 }
    ]
});

// Solution 7: Flattening Nested Promises
console.log("\n--- Flattening ---");

// Nested (avoid)
fetchUser(1).then(user => {
    fetchDepartment(user.departmentId).then(dept => {
        fetchProjects(dept.id).then(projects => {
            console.log("Nested:", projects);
        });
    });
});

// Flattened (preferred)
fetchUser(1)
    .then(user => fetchDepartment(user.departmentId))
    .then(dept => fetchProjects(dept.id))
    .then(projects => console.log("Flattened:", projects));

// Solution 8: Chain with Array Processing
console.log("\n--- Array Processing ---");

function processItems(items) {
    return Promise.resolve(items)
        .then(items => items.filter(item => item.active))
        .then(items => items.map(item => ({ ...item, processed: true })))
        .then(items => {
            console.log("Processed items:", items);
            return items;
        });
}

processItems([
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: true }
]);

