/**
 * Lab 026: Guard Clauses (Early Returns)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Guard clauses are early return statements that handle edge cases first.
 * They reduce nesting and improve code readability.
 * 
 * Pattern:
 * function doSomething(param) {
 *     if (!param) return;           // Guard clause
 *     if (param.invalid) return;    // Guard clause
 *     
 *     // Main logic here (less nested)
 * }
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert nested if-else to guard clauses
 * 2. Handle validation with guards
 * 3. Improve code readability
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Before and After Guard Clauses
console.log("--- Before and After ---");

// BEFORE: Deeply nested
function processOrderBefore(order) {
    if (order) {
        if (order.items) {
            if (order.items.length > 0) {
                if (order.customer) {
                    // Finally, main logic!
                    return `Processing order for ${order.customer.name}`;
                } else {
                    return "Error: No customer";
                }
            } else {
                return "Error: No items";
            }
        } else {
            return "Error: Items undefined";
        }
    } else {
        return "Error: No order";
    }
}

// AFTER: Guard clauses
function processOrderAfter(order) {
    // Guard clauses - handle errors first
    if (!order) return "Error: No order";
    if (!order.items) return "Error: Items undefined";
    if (order.items.length === 0) return "Error: No items";
    if (!order.customer) return "Error: No customer";
    
    // Main logic - clean and clear
    return `Processing order for ${order.customer.name}`;
}

const testOrder = { items: ["item1"], customer: { name: "John" } };
console.log("Before:", processOrderBefore(testOrder));
console.log("After:", processOrderAfter(testOrder));

// Solution 2: User Validation with Guards
console.log("\n--- User Validation ---");

function createUser(userData) {
    // Guard clauses for validation
    if (!userData) {
        return { error: "User data is required" };
    }
    
    if (!userData.email) {
        return { error: "Email is required" };
    }
    
    if (!userData.email.includes("@")) {
        return { error: "Invalid email format" };
    }
    
    if (!userData.password) {
        return { error: "Password is required" };
    }
    
    if (userData.password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }
    
    // Main logic - create user
    return {
        success: true,
        user: {
            email: userData.email,
            createdAt: new Date().toISOString()
        }
    };
}

console.log(createUser(null));
console.log(createUser({ email: "test" }));
console.log(createUser({ email: "test@example.com", password: "123" }));
console.log(createUser({ email: "test@example.com", password: "secure123" }));

// Solution 3: Permission Checking
console.log("\n--- Permission Checking ---");

function deleteResource(user, resource) {
    // Guard: User must exist
    if (!user) {
        return { success: false, error: "Authentication required" };
    }
    
    // Guard: User must be active
    if (!user.isActive) {
        return { success: false, error: "Account is deactivated" };
    }
    
    // Guard: Resource must exist
    if (!resource) {
        return { success: false, error: "Resource not found" };
    }
    
    // Guard: Check ownership or admin
    if (resource.ownerId !== user.id && user.role !== "admin") {
        return { success: false, error: "Permission denied" };
    }
    
    // Main logic - delete resource
    return {
        success: true,
        message: `Resource ${resource.id} deleted by ${user.name}`
    };
}

const admin = { id: 1, name: "Admin", role: "admin", isActive: true };
const user = { id: 2, name: "User", role: "user", isActive: true };
const resource = { id: 100, ownerId: 2 };

console.log(deleteResource(null, resource));
console.log(deleteResource(user, null));
console.log(deleteResource(admin, resource));
console.log(deleteResource(user, resource));

// Solution 4: Loop Guard Clause (continue)
console.log("\n--- Loop Guards ---");

const items = [
    { name: "Item 1", active: true, stock: 5 },
    { name: "Item 2", active: false, stock: 10 },
    { name: "Item 3", active: true, stock: 0 },
    { name: "Item 4", active: true, stock: 3 },
];

console.log("Available items:");
for (const item of items) {
    // Guard: Skip inactive
    if (!item.active) continue;
    
    // Guard: Skip out of stock
    if (item.stock === 0) continue;
    
    // Main logic
    console.log(`- ${item.name} (${item.stock} in stock)`);
}

// Solution 5: Async Function Guards
console.log("\n--- Async Guards ---");

async function fetchUserData(userId) {
    // Guard: Validate input
    if (!userId) {
        throw new Error("User ID is required");
    }
    
    if (typeof userId !== "number") {
        throw new Error("User ID must be a number");
    }
    
    // Simulate API call
    // const response = await fetch(`/api/users/${userId}`);
    
    // Main logic would go here
    return { id: userId, name: "John Doe" };
}

// Test
fetchUserData(123)
    .then(user => console.log("Fetched:", user))
    .catch(err => console.log("Error:", err.message));

