/**
 * Lab 127: Error Logging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Effective error logging:
 * 
 * - What to log
 * - Log levels
 * - Structured logging
 * - Error tracking
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement error logging
 * 2. Add context to logs
 * 3. Create structured logs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Error Logging
console.log("--- Basic Logging ---");

function logError(error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}

try {
    throw new Error("Something went wrong");
} catch (error) {
    logError(error);
}

// Solution 2: Log Levels
console.log("\n--- Log Levels ---");

const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
};

class Logger {
    constructor(minLevel = LogLevel.INFO) {
        this.minLevel = minLevel;
    }
    
    log(level, message, data = {}) {
        if (level < this.minLevel) return;
        
        const levelName = Object.keys(LogLevel).find(k => LogLevel[k] === level);
        const timestamp = new Date().toISOString();
        
        console.log(JSON.stringify({
            timestamp,
            level: levelName,
            message,
            ...data
        }));
    }
    
    debug(message, data) { this.log(LogLevel.DEBUG, message, data); }
    info(message, data) { this.log(LogLevel.INFO, message, data); }
    warn(message, data) { this.log(LogLevel.WARN, message, data); }
    error(message, data) { this.log(LogLevel.ERROR, message, data); }
    fatal(message, data) { this.log(LogLevel.FATAL, message, data); }
}

const logger = new Logger(LogLevel.INFO);
logger.info("Application started");
logger.error("Database connection failed", { host: "localhost", port: 5432 });

// Solution 3: Error Context
console.log("\n--- Error Context ---");

function logErrorWithContext(error, context) {
    const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack?.split("\n").slice(0, 5)
        },
        context
    };
    
    console.log(JSON.stringify(errorLog, null, 2));
}

try {
    throw new Error("User not found");
} catch (error) {
    logErrorWithContext(error, {
        userId: 123,
        action: "getUser",
        requestId: "req-456"
    });
}

// Solution 4: Error Tracking Service
console.log("\n--- Error Tracking ---");

class ErrorTracker {
    constructor() {
        this.errors = [];
    }
    
    capture(error, context = {}) {
        const entry = {
            id: Date.now().toString(36),
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            context,
            environment: process.env.NODE_ENV || "development"
        };
        
        this.errors.push(entry);
        this.send(entry);
        
        return entry.id;
    }
    
    send(entry) {
        // In production, send to error tracking service
        console.log("Tracked error:", entry.id);
    }
    
    getErrors() {
        return this.errors;
    }
}

const tracker = new ErrorTracker();

try {
    throw new Error("Critical error");
} catch (error) {
    const errorId = tracker.capture(error, { user: "john@example.com" });
    console.log("Error ID:", errorId);
}

// Solution 5: Structured Error Logging
console.log("\n--- Structured Logging ---");

function createErrorLog(error, request = {}) {
    return {
        "@timestamp": new Date().toISOString(),
        level: "error",
        message: error.message,
        error: {
            type: error.name,
            message: error.message,
            stack_trace: error.stack
        },
        request: {
            method: request.method,
            url: request.url,
            headers: request.headers
        },
        service: {
            name: "my-app",
            version: "1.0.0"
        }
    };
}

const errorLog = createErrorLog(
    new Error("Request failed"),
    { method: "GET", url: "/api/users", headers: {} }
);
console.log(JSON.stringify(errorLog, null, 2));

// Solution 6: Error Aggregation
console.log("\n--- Error Aggregation ---");

class ErrorAggregator {
    constructor() {
        this.errorCounts = new Map();
    }
    
    record(error) {
        const key = `${error.name}:${error.message}`;
        const current = this.errorCounts.get(key) || { count: 0, first: null, last: null };
        
        current.count++;
        current.last = new Date();
        if (!current.first) current.first = current.last;
        
        this.errorCounts.set(key, current);
    }
    
    getStats() {
        const stats = [];
        for (const [key, data] of this.errorCounts) {
            stats.push({ error: key, ...data });
        }
        return stats.sort((a, b) => b.count - a.count);
    }
}

const aggregator = new ErrorAggregator();
aggregator.record(new Error("Connection timeout"));
aggregator.record(new Error("Connection timeout"));
aggregator.record(new Error("Invalid input"));

console.log("Error stats:", aggregator.getStats());

// Solution 7: Sanitizing Sensitive Data
console.log("\n--- Sanitizing Data ---");

function sanitizeError(error, context) {
    const sensitiveKeys = ["password", "token", "secret", "apiKey"];
    
    const sanitized = { ...context };
    for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
            sanitized[key] = "[REDACTED]";
        }
    }
    
    return {
        error: error.message,
        context: sanitized
    };
}

const sanitized = sanitizeError(
    new Error("Auth failed"),
    { username: "john", password: "secret123", apiKey: "key-123" }
);
console.log("Sanitized:", sanitized);

// Solution 8: Error Fingerprinting
console.log("\n--- Error Fingerprinting ---");

function getErrorFingerprint(error) {
    // Create unique identifier for error type
    const stack = error.stack || "";
    const firstLine = stack.split("\n")[1] || "";
    
    return `${error.name}:${error.message}:${firstLine.trim()}`;
}

const err1 = new Error("Test error");
const err2 = new Error("Test error");

console.log("Fingerprint 1:", getErrorFingerprint(err1));
console.log("Same error:", getErrorFingerprint(err1) === getErrorFingerprint(err2));

