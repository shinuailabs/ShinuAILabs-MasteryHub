/**
 * Lab 029: Nested Conditions and Refactoring
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Nested conditions can become hard to read and maintain.
 * 
 * Techniques to reduce nesting:
 * 1. Guard clauses (early returns)
 * 2. Extract to functions
 * 3. Use lookup objects/maps
 * 4. Combine conditions
 * 5. Use polymorphism (advanced)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify deeply nested code
 * 2. Refactor using various techniques
 * 3. Improve readability
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Problem - Deeply Nested Code
console.log("--- Deeply Nested (Problem) ---");

function calculatePriceBad(user, product, quantity) {
    let price = 0;
    if (user) {
        if (user.isActive) {
            if (product) {
                if (product.inStock) {
                    if (quantity > 0) {
                        price = product.price * quantity;
                        if (user.isPremium) {
                            price = price * 0.9; // 10% discount
                        }
                        if (quantity >= 10) {
                            price = price * 0.95; // 5% bulk discount
                        }
                    }
                }
            }
        }
    }
    return price;
}

// Solution 2: Refactored with Guard Clauses
console.log("--- Guard Clauses (Better) ---");

function calculatePriceGood(user, product, quantity) {
    // Guard clauses
    if (!user || !user.isActive) return 0;
    if (!product || !product.inStock) return 0;
    if (quantity <= 0) return 0;
    
    // Main logic (flat, easy to read)
    let price = product.price * quantity;
    
    if (user.isPremium) {
        price *= 0.9;
    }
    
    if (quantity >= 10) {
        price *= 0.95;
    }
    
    return price;
}

// Test
const user = { isActive: true, isPremium: true };
const product = { price: 100, inStock: true };
console.log("Price:", calculatePriceGood(user, product, 15));

// Solution 3: Extract to Functions
console.log("\n--- Extract Functions ---");

function isValidOrder(user, product, quantity) {
    return user?.isActive && product?.inStock && quantity > 0;
}

function getDiscountMultiplier(user, quantity) {
    let multiplier = 1;
    if (user.isPremium) multiplier *= 0.9;
    if (quantity >= 10) multiplier *= 0.95;
    return multiplier;
}

function calculatePriceExtracted(user, product, quantity) {
    if (!isValidOrder(user, product, quantity)) {
        return 0;
    }
    
    const basePrice = product.price * quantity;
    const discount = getDiscountMultiplier(user, quantity);
    
    return basePrice * discount;
}

console.log("Extracted:", calculatePriceExtracted(user, product, 15));

// Solution 4: Lookup Object Instead of if-else
console.log("\n--- Lookup Objects ---");

// BAD: Long if-else chain
function getDiscountBad(memberLevel) {
    if (memberLevel === "gold") return 0.20;
    else if (memberLevel === "silver") return 0.15;
    else if (memberLevel === "bronze") return 0.10;
    else return 0;
}

// GOOD: Lookup object
const DISCOUNT_RATES = {
    gold: 0.20,
    silver: 0.15,
    bronze: 0.10,
    default: 0
};

function getDiscountGood(memberLevel) {
    return DISCOUNT_RATES[memberLevel] ?? DISCOUNT_RATES.default;
}

console.log("Gold discount:", getDiscountGood("gold"));
console.log("Unknown discount:", getDiscountGood("unknown"));

// Solution 5: Strategy Pattern with Objects
console.log("\n--- Strategy Pattern ---");

const shippingCalculators = {
    standard: (weight) => weight * 0.5,
    express: (weight) => weight * 1.0 + 5,
    overnight: (weight) => weight * 2.0 + 10,
    free: () => 0
};

function calculateShipping(method, weight) {
    const calculator = shippingCalculators[method];
    if (!calculator) {
        throw new Error(`Unknown shipping method: ${method}`);
    }
    return calculator(weight);
}

console.log("Standard (10kg):", calculateShipping("standard", 10));
console.log("Express (10kg):", calculateShipping("express", 10));

// Solution 6: Combine Related Conditions
console.log("\n--- Combine Conditions ---");

// BAD: Separate nested checks
function canAccessBad(user, resource) {
    if (user.role === "admin") {
        return true;
    } else {
        if (user.role === "editor") {
            if (resource.type === "article") {
                return true;
            }
        }
    }
    return false;
}

// GOOD: Combined with logical operators
function canAccessGood(user, resource) {
    const isAdmin = user.role === "admin";
    const isEditorWithArticle = user.role === "editor" && resource.type === "article";
    
    return isAdmin || isEditorWithArticle;
}

console.log("Admin access:", canAccessGood({ role: "admin" }, {}));
console.log("Editor + article:", canAccessGood({ role: "editor" }, { type: "article" }));

// Solution 7: Complex Business Logic
console.log("\n--- Complex Logic ---");

function processOrder(order) {
    // Validate (guards)
    const validation = validateOrder(order);
    if (!validation.valid) return validation;
    
    // Calculate
    const pricing = calculateOrderPricing(order);
    
    // Apply rules
    const finalOrder = applyBusinessRules(order, pricing);
    
    return { success: true, order: finalOrder };
}

function validateOrder(order) {
    if (!order) return { valid: false, error: "No order" };
    if (!order.items?.length) return { valid: false, error: "No items" };
    return { valid: true };
}

function calculateOrderPricing(order) {
    return { subtotal: 100, tax: 10, total: 110 };
}

function applyBusinessRules(order, pricing) {
    return { ...order, ...pricing };
}

console.log("Process:", processOrder({ items: ["item1"] }));

