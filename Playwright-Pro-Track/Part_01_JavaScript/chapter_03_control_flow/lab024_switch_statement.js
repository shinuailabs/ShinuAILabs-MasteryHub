/**
 * Lab 024: switch Statement
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The switch statement selects one of many code blocks to execute.
 * 
 * Syntax:
 * switch (expression) {
 *     case value1:
 *         // code
 *         break;
 *     case value2:
 *         // code
 *         break;
 *     default:
 *         // code if no match
 * }
 * 
 * - Uses strict equality (===)
 * - break prevents fall-through
 * - default is optional
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert if-else chains to switch
 * 2. Handle multiple cases
 * 3. Understand fall-through behavior
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic switch
console.log("--- Basic switch ---");
const day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
        dayName = "Saturday";
        break;
    case 7:
        dayName = "Sunday";
        break;
    default:
        dayName = "Invalid day";
}

console.log(`Day ${day}: ${dayName}`);

// Solution 2: switch with Strings
console.log("\n--- String switch ---");
function getColorHex(color) {
    switch (color.toLowerCase()) {
        case "red":
            return "#FF0000";
        case "green":
            return "#00FF00";
        case "blue":
            return "#0000FF";
        case "white":
            return "#FFFFFF";
        case "black":
            return "#000000";
        default:
            return "Unknown color";
    }
}

console.log(`Red: ${getColorHex("Red")}`);
console.log(`blue: ${getColorHex("blue")}`);
console.log(`YELLOW: ${getColorHex("YELLOW")}`);

// Solution 3: Multiple Cases (Fall-through)
console.log("\n--- Multiple Cases ---");
function getSeasonActivity(month) {
    switch (month) {
        case "December":
        case "January":
        case "February":
            return "Winter sports";
        case "March":
        case "April":
        case "May":
            return "Spring gardening";
        case "June":
        case "July":
        case "August":
            return "Beach activities";
        case "September":
        case "October":
        case "November":
            return "Fall hiking";
        default:
            return "Invalid month";
    }
}

console.log(`January: ${getSeasonActivity("January")}`);
console.log(`July: ${getSeasonActivity("July")}`);
console.log(`October: ${getSeasonActivity("October")}`);

// Solution 4: Fall-through Behavior (intentional)
console.log("\n--- Intentional Fall-through ---");
function getCumulativeFeatures(plan) {
    const features = [];
    
    switch (plan) {
        case "premium":
            features.push("Priority support");
            features.push("Custom branding");
            // Intentional fall-through
        case "pro":
            features.push("Advanced analytics");
            features.push("API access");
            // Intentional fall-through
        case "basic":
            features.push("Basic features");
            features.push("Email support");
            break;
        default:
            features.push("Free tier only");
    }
    
    return features;
}

console.log("Premium:", getCumulativeFeatures("premium"));
console.log("Pro:", getCumulativeFeatures("pro"));
console.log("Basic:", getCumulativeFeatures("basic"));

// Solution 5: switch with Return
console.log("\n--- switch with Return ---");
function getHttpStatus(code) {
    switch (code) {
        case 200:
            return "OK";
        case 201:
            return "Created";
        case 400:
            return "Bad Request";
        case 401:
            return "Unauthorized";
        case 404:
            return "Not Found";
        case 500:
            return "Internal Server Error";
        default:
            return `Unknown status: ${code}`;
    }
}

console.log(`200: ${getHttpStatus(200)}`);
console.log(`404: ${getHttpStatus(404)}`);
console.log(`418: ${getHttpStatus(418)}`);

// Solution 6: switch with Expressions
console.log("\n--- switch with true ---");
const score = 85;

switch (true) {
    case score >= 90:
        console.log("Grade: A");
        break;
    case score >= 80:
        console.log("Grade: B");
        break;
    case score >= 70:
        console.log("Grade: C");
        break;
    default:
        console.log("Grade: F");
}

// Solution 7: When to Use switch vs if-else
console.log("\n--- switch vs if-else ---");

// Use switch when:
// - Comparing single value against many options
// - All comparisons use strict equality
// - Many possible values

// Use if-else when:
// - Comparing ranges
// - Complex conditions (&&, ||)
// - Different comparison operators

// Good for switch
const action = "save";
switch (action) {
    case "save":
        console.log("Saving...");
        break;
    case "load":
        console.log("Loading...");
        break;
    case "delete":
        console.log("Deleting...");
        break;
}

