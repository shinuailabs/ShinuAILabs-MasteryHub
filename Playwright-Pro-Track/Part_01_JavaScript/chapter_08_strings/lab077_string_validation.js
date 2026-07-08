/**
 * Lab 077: String Validation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common string validation patterns:
 * 
 * - Email validation
 * - Password strength
 * - Phone numbers
 * - URLs
 * - Credit cards
 * - Custom formats
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Validate common formats
 * 2. Create custom validators
 * 3. Provide helpful error messages
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Email Validation
console.log("--- Email Validation ---");

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

console.log("test@example.com:", isValidEmail("test@example.com"));
console.log("invalid-email:", isValidEmail("invalid-email"));
console.log("test@.com:", isValidEmail("test@.com"));

// Solution 2: Password Strength
console.log("\n--- Password Strength ---");

function checkPasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const passed = Object.values(checks).filter(Boolean).length;
    
    return {
        checks,
        score: passed,
        strength: passed <= 2 ? "weak" : passed <= 4 ? "medium" : "strong"
    };
}

console.log("'password':", checkPasswordStrength("password"));
console.log("'Password1!':", checkPasswordStrength("Password1!"));

// Solution 3: Phone Number Validation
console.log("\n--- Phone Validation ---");

function isValidPhone(phone, format = "us") {
    const patterns = {
        us: /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
        international: /^\+?[\d\s-]{10,}$/
    };
    
    return patterns[format]?.test(phone) ?? false;
}

console.log("(123) 456-7890:", isValidPhone("(123) 456-7890"));
console.log("123-456-7890:", isValidPhone("123-456-7890"));
console.log("+1 234 567 8900:", isValidPhone("+1 234 567 8900", "international"));

// Solution 4: URL Validation
console.log("\n--- URL Validation ---");

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

console.log("https://example.com:", isValidUrl("https://example.com"));
console.log("not-a-url:", isValidUrl("not-a-url"));

// Solution 5: Credit Card Validation
console.log("\n--- Credit Card ---");

function validateCreditCard(number) {
    // Remove spaces and dashes
    const cleaned = number.replace(/[\s-]/g, "");
    
    // Check if all digits
    if (!/^\d+$/.test(cleaned)) {
        return { valid: false, type: null };
    }
    
    // Detect card type
    const types = {
        visa: /^4\d{12}(?:\d{3})?$/,
        mastercard: /^5[1-5]\d{14}$/,
        amex: /^3[47]\d{13}$/
    };
    
    let cardType = null;
    for (const [type, pattern] of Object.entries(types)) {
        if (pattern.test(cleaned)) {
            cardType = type;
            break;
        }
    }
    
    // Luhn algorithm
    const luhnCheck = (num) => {
        let sum = 0;
        let isEven = false;
        
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    };
    
    return {
        valid: luhnCheck(cleaned),
        type: cardType
    };
}

console.log("4111111111111111:", validateCreditCard("4111111111111111"));

// Solution 6: Username Validation
console.log("\n--- Username ---");

function validateUsername(username) {
    const errors = [];
    
    if (username.length < 3) errors.push("Too short (min 3)");
    if (username.length > 20) errors.push("Too long (max 20)");
    if (!/^[a-zA-Z]/.test(username)) errors.push("Must start with letter");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) errors.push("Only letters, numbers, underscore");
    
    return {
        valid: errors.length === 0,
        errors
    };
}

console.log("john_doe:", validateUsername("john_doe"));
console.log("123user:", validateUsername("123user"));

// Solution 7: Date Format Validation
console.log("\n--- Date Format ---");

function isValidDate(dateStr, format = "YYYY-MM-DD") {
    const patterns = {
        "YYYY-MM-DD": /^\d{4}-\d{2}-\d{2}$/,
        "MM/DD/YYYY": /^\d{2}\/\d{2}\/\d{4}$/,
        "DD.MM.YYYY": /^\d{2}\.\d{2}\.\d{4}$/
    };
    
    if (!patterns[format]?.test(dateStr)) return false;
    
    // Check if actual valid date
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

console.log("2024-01-15:", isValidDate("2024-01-15"));
console.log("2024-13-45:", isValidDate("2024-13-45"));

// Solution 8: Alphanumeric Check
console.log("\n--- Alphanumeric ---");

const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
const isAlpha = (str) => /^[a-zA-Z]+$/.test(str);
const isNumeric = (str) => /^\d+$/.test(str);

console.log("isAlphanumeric('abc123'):", isAlphanumeric("abc123"));
console.log("isAlpha('abc'):", isAlpha("abc"));
console.log("isNumeric('123'):", isNumeric("123"));

// Solution 9: Whitespace Check
console.log("\n--- Whitespace ---");

const isEmpty = (str) => str.trim().length === 0;
const hasWhitespace = (str) => /\s/.test(str);

console.log("isEmpty('   '):", isEmpty("   "));
console.log("hasWhitespace('hello world'):", hasWhitespace("hello world"));

// Solution 10: Custom Validator Factory
console.log("\n--- Validator Factory ---");

function createValidator(rules) {
    return (value) => {
        const errors = [];
        for (const [name, check] of Object.entries(rules)) {
            if (!check(value)) errors.push(name);
        }
        return { valid: errors.length === 0, errors };
    };
}

const validateName = createValidator({
    "required": v => v.length > 0,
    "min length 2": v => v.length >= 2,
    "letters only": v => /^[a-zA-Z\s]+$/.test(v)
});

console.log("validateName('John'):", validateName("John"));
console.log("validateName('J'):", validateName("J"));

