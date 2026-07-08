/**
 * Lab 030: Control Flow Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for writing clean, maintainable control flow:
 *
 * 1. Prefer positive conditions
 * 2. Keep conditions simple
 * 3. Avoid deep nesting
 * 4. Use early returns
 * 5. Choose right construct (if vs switch vs ternary)
 * 6. Extract complex conditions to variables/functions
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices to control flow
 * 2. Recognize and fix anti-patterns
 * 3. Write readable conditional code
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Prefer Positive Conditions
console.log("--- Positive Conditions ---");

// ❌ BAD: Negative condition
function checkAccessBad(user) {
    if (!user.isNotBanned) {
        return "Access denied";
    }
    return "Access granted";
}

// ✅ GOOD: Positive condition
function checkAccessGood(user) {
    if (user.isActive) {
        return "Access granted";
    }
    return "Access denied";
}

// Best Practice 2: Name Complex Conditions
console.log("\n--- Named Conditions ---");

const user = { age: 25, role: "editor", verified: true, active: true };

// ❌ BAD: Complex inline condition
if (user.age >= 18 && (user.role === "admin" || user.role === "editor") && user.verified) {
    console.log("Can publish (bad)");
}

// ✅ GOOD: Named conditions
const isAdult = user.age >= 18;
const hasPublishRole = user.role === "admin" || user.role === "editor";
const isVerified = user.verified;
const canPublish = isAdult && hasPublishRole && isVerified;

if (canPublish) {
    console.log("Can publish (good)");
}

// Best Practice 3: Avoid Yoda Conditions
console.log("\n--- Avoid Yoda ---");

const status = "active";

// ❌ BAD: Yoda condition (constant first)
if ("active" === status) {
    console.log("Yoda style");
}

// ✅ GOOD: Natural reading order
if (status === "active") {
    console.log("Natural style");
}

// Best Practice 4: Single Responsibility
console.log("\n--- Single Responsibility ---");

// ❌ BAD: One function doing too much
function handleUserBad(user) {
    if (user) {
        if (user.email) {
            // validate email
            // send welcome email
            // create profile
            // set preferences
        }
    }
}

// ✅ GOOD: Separate functions
function handleUserGood(user) {
    if (!isValidUser(user)) return;

    validateEmail(user.email);
    sendWelcomeEmail(user.email);
    createProfile(user);
    setDefaultPreferences(user);
}

function isValidUser(user) { return user && user.email; }
function validateEmail(email) { console.log("Validating", email); }
function sendWelcomeEmail(email) { console.log("Sending to", email); }
function createProfile(user) { console.log("Creating profile"); }
function setDefaultPreferences(user) { console.log("Setting prefs"); }

// Best Practice 5: Choose Right Construct
console.log("\n--- Right Construct ---");

// Use IF for: boolean checks, ranges, complex conditions
const age = 25;
if (age >= 18 && age < 65) {
    console.log("Working age");
}

// Use SWITCH for: multiple discrete values
const day = "Monday";
switch (day) {
    case "Monday":
    case "Tuesday":
        console.log("Work day");
        break;
}

// Use TERNARY for: simple value assignment
const greeting = age >= 18 ? "Mr/Ms" : "Young";
console.log(greeting);

// Use LOOKUP for: mapping values
const dayTypes = { Monday: "work", Saturday: "weekend" };
console.log(dayTypes[day] || "unknown");

// Best Practice 6: Consistent Return Types
console.log("\n--- Consistent Returns ---");

// ❌ BAD: Inconsistent returns
function getUserBad(id) {
    if (!id) return null;
    if (id < 0) return undefined;
    if (id === 0) return false;
    return { id, name: "User" };
}

// ✅ GOOD: Consistent return type
function getUserGood(id) {
    if (!id || id <= 0) return null;
    return { id, name: "User" };
}

// Best Practice 7: Avoid Flag Arguments
console.log("\n--- Avoid Flags ---");

// ❌ BAD: Boolean flag changes behavior
function renderBad(data, isAdmin) {
    if (isAdmin) {
        // render admin view
    } else {
        // render user view
    }
}

// ✅ GOOD: Separate functions
function renderAdminView(data) { console.log("Admin view"); }
function renderUserView(data) { console.log("User view"); }

// Summary
console.log("\n--- Summary ---");
console.log("1. Use positive conditions when possible");
console.log("2. Name complex conditions");
console.log("3. Keep functions focused");
console.log("4. Use early returns to reduce nesting");
console.log("5. Choose the right control structure");
console.log("6. Return consistent types");
console.log("7. Prefer multiple functions over flags");