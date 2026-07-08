/**
 * Lab 023: else if Statement
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The else if statement allows checking multiple conditions in sequence.
 * 
 * Syntax:
 * if (condition1) {
 *     // code if condition1 is true
 * } else if (condition2) {
 *     // code if condition2 is true
 * } else if (condition3) {
 *     // code if condition3 is true
 * } else {
 *     // code if all conditions are false
 * }
 * 
 * First true condition wins - subsequent conditions are not checked.
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create grading systems
 * 2. Handle multiple ranges
 * 3. Categorize data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Grade Calculator
console.log("--- Grade Calculator ---");
function getGrade(score) {
    if (score >= 90) {
        return "A";
    } else if (score >= 80) {
        return "B";
    } else if (score >= 70) {
        return "C";
    } else if (score >= 60) {
        return "D";
    } else {
        return "F";
    }
}

console.log(`Score 95: Grade ${getGrade(95)}`);
console.log(`Score 85: Grade ${getGrade(85)}`);
console.log(`Score 72: Grade ${getGrade(72)}`);
console.log(`Score 55: Grade ${getGrade(55)}`);

// Solution 2: Age Categories
console.log("\n--- Age Categories ---");
function getAgeCategory(age) {
    if (age < 0) {
        return "Invalid age";
    } else if (age < 13) {
        return "Child";
    } else if (age < 20) {
        return "Teenager";
    } else if (age < 60) {
        return "Adult";
    } else {
        return "Senior";
    }
}

console.log(`Age 5: ${getAgeCategory(5)}`);
console.log(`Age 15: ${getAgeCategory(15)}`);
console.log(`Age 35: ${getAgeCategory(35)}`);
console.log(`Age 70: ${getAgeCategory(70)}`);

// Solution 3: Temperature Description
console.log("\n--- Temperature Description ---");
function describeTemperature(celsius) {
    if (celsius < 0) {
        return "Freezing";
    } else if (celsius < 10) {
        return "Cold";
    } else if (celsius < 20) {
        return "Cool";
    } else if (celsius < 30) {
        return "Warm";
    } else if (celsius < 40) {
        return "Hot";
    } else {
        return "Extreme heat";
    }
}

console.log(`-5°C: ${describeTemperature(-5)}`);
console.log(`15°C: ${describeTemperature(15)}`);
console.log(`25°C: ${describeTemperature(25)}`);
console.log(`35°C: ${describeTemperature(35)}`);

// Solution 4: HTTP Status Codes
console.log("\n--- HTTP Status Codes ---");
function getStatusMessage(code) {
    if (code >= 200 && code < 300) {
        return "Success";
    } else if (code >= 300 && code < 400) {
        return "Redirection";
    } else if (code >= 400 && code < 500) {
        return "Client Error";
    } else if (code >= 500) {
        return "Server Error";
    } else {
        return "Unknown Status";
    }
}

console.log(`200: ${getStatusMessage(200)}`);
console.log(`301: ${getStatusMessage(301)}`);
console.log(`404: ${getStatusMessage(404)}`);
console.log(`500: ${getStatusMessage(500)}`);

// Solution 5: User Role Permissions
console.log("\n--- User Permissions ---");
function getPermissions(role) {
    if (role === "admin") {
        return ["read", "write", "delete", "manage_users"];
    } else if (role === "editor") {
        return ["read", "write"];
    } else if (role === "viewer") {
        return ["read"];
    } else if (role === "guest") {
        return ["read_public"];
    } else {
        return [];
    }
}

console.log("Admin:", getPermissions("admin"));
console.log("Editor:", getPermissions("editor"));
console.log("Guest:", getPermissions("guest"));

// Solution 6: BMI Calculator
console.log("\n--- BMI Categories ---");
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi < 25) {
        return "Normal weight";
    } else if (bmi < 30) {
        return "Overweight";
    } else {
        return "Obese";
    }
}

console.log(`BMI 17: ${getBMICategory(17)}`);
console.log(`BMI 22: ${getBMICategory(22)}`);
console.log(`BMI 28: ${getBMICategory(28)}`);
console.log(`BMI 35: ${getBMICategory(35)}`);

// Solution 7: Order of Conditions Matters!
console.log("\n--- Order Matters ---");
const score = 95;

// WRONG ORDER - would return "C" for score 95
function wrongOrder(score) {
    if (score >= 60) return "D or better";
    else if (score >= 70) return "C or better";
    else if (score >= 80) return "B or better";
    else if (score >= 90) return "A";
    return "F";
}

// CORRECT ORDER - check highest first
function correctOrder(score) {
    if (score >= 90) return "A";
    else if (score >= 80) return "B";
    else if (score >= 70) return "C";
    else if (score >= 60) return "D";
    return "F";
}

console.log(`Wrong order (95): ${wrongOrder(95)}`);
console.log(`Correct order (95): ${correctOrder(95)}`);

