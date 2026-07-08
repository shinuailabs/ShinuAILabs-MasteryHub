/**
 * Lab 123: Custom Error Classes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom error types:
 * 
 * - Extend Error class
 * - Add custom properties
 * - Maintain stack trace
 * - Create error hierarchies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom error classes
 * 2. Add meaningful properties
 * 3. Handle custom errors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Custom Error
console.log("--- Basic Custom Error ---");

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

try {
    throw new ValidationError("Email is required");
} catch (error) {
    console.log("Name:", error.name);
    console.log("Message:", error.message);
    console.log("Is ValidationError:", error instanceof ValidationError);
    console.log("Is Error:", error instanceof Error);
}

// Solution 2: Custom Error with Properties
console.log("\n--- Error with Properties ---");

class HttpError extends Error {
    constructor(message, statusCode, url) {
        super(message);
        this.name = "HttpError";
        this.statusCode = statusCode;
        this.url = url;
        this.timestamp = new Date();
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            url: this.url,
            timestamp: this.timestamp
        };
    }
}

try {
    throw new HttpError("Not Found", 404, "/api/users/999");
} catch (error) {
    console.log("Status:", error.statusCode);
    console.log("URL:", error.url);
    console.log("JSON:", JSON.stringify(error.toJSON(), null, 2));
}

// Solution 3: Error Hierarchy
console.log("\n--- Error Hierarchy ---");

class AppError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "AppError";
        this.code = code;
    }
}

class DatabaseError extends AppError {
    constructor(message, query) {
        super(message, "DB_ERROR");
        this.name = "DatabaseError";
        this.query = query;
    }
}

class NetworkError extends AppError {
    constructor(message, endpoint) {
        super(message, "NETWORK_ERROR");
        this.name = "NetworkError";
        this.endpoint = endpoint;
    }
}

try {
    throw new DatabaseError("Connection failed", "SELECT * FROM users");
} catch (error) {
    console.log("Is AppError:", error instanceof AppError);
    console.log("Is DatabaseError:", error instanceof DatabaseError);
    console.log("Query:", error.query);
}

// Solution 4: Validation Error with Fields
console.log("\n--- Validation with Fields ---");

class FieldValidationError extends Error {
    constructor(fields) {
        const message = Object.entries(fields)
            .map(([field, error]) => `${field}: ${error}`)
            .join(", ");
        
        super(message);
        this.name = "FieldValidationError";
        this.fields = fields;
    }
    
    hasError(field) {
        return field in this.fields;
    }
    
    getError(field) {
        return this.fields[field];
    }
}

try {
    throw new FieldValidationError({
        email: "Invalid format",
        password: "Too short"
    });
} catch (error) {
    console.log("Message:", error.message);
    console.log("Has email error:", error.hasError("email"));
    console.log("Password error:", error.getError("password"));
}

// Solution 5: Error with Cause
console.log("\n--- Error with Cause ---");

class WrappedError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "WrappedError";
        this.cause = cause;
    }
}

try {
    try {
        JSON.parse("invalid");
    } catch (originalError) {
        throw new WrappedError("Failed to parse config", originalError);
    }
} catch (error) {
    console.log("Error:", error.message);
    console.log("Cause:", error.cause.message);
}

// Solution 6: Retryable Error
console.log("\n--- Retryable Error ---");

class RetryableError extends Error {
    constructor(message, retryAfter = 1000) {
        super(message);
        this.name = "RetryableError";
        this.retryAfter = retryAfter;
        this.retryable = true;
    }
}

function handleWithRetry(error) {
    if (error.retryable) {
        console.log(`Will retry after ${error.retryAfter}ms`);
        return true;
    }
    return false;
}

const retryError = new RetryableError("Service unavailable", 5000);
handleWithRetry(retryError);

// Solution 7: Error Factory
console.log("\n--- Error Factory ---");

const ErrorFactory = {
    validation: (message, field) => {
        const error = new Error(message);
        error.name = "ValidationError";
        error.field = field;
        return error;
    },
    
    notFound: (resource, id) => {
        const error = new Error(`${resource} with id ${id} not found`);
        error.name = "NotFoundError";
        error.resource = resource;
        error.resourceId = id;
        return error;
    },
    
    unauthorized: (reason) => {
        const error = new Error(reason || "Unauthorized");
        error.name = "UnauthorizedError";
        return error;
    }
};

const notFound = ErrorFactory.notFound("User", 123);
console.log("Factory error:", notFound.message);

// Solution 8: Error Codes
console.log("\n--- Error Codes ---");

const ErrorCodes = {
    VALIDATION_FAILED: "E001",
    NOT_FOUND: "E002",
    UNAUTHORIZED: "E003",
    SERVER_ERROR: "E500"
};

class CodedError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "CodedError";
        this.code = code;
    }
}

const coded = new CodedError(ErrorCodes.NOT_FOUND, "Resource not found");
console.log(`[${coded.code}] ${coded.message}`);

