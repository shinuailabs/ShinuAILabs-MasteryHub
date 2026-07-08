/**
 * Lab 232: String Enums
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * String enums in TypeScript:
 * 
 * - String values
 * - No reverse mapping
 * - Better debugging
 * - Serialization friendly
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create string enums
 * 2. Use in functions
 * 3. Compare with numeric
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic String Enum
console.log("--- Basic String Enum ---");

enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

console.log("Up:", Direction.Up);
console.log("Down:", Direction.Down);

// Solution 2: Status Enum
console.log("\n--- Status Enum ---");

enum Status {
    Pending = "pending",
    Active = "active",
    Completed = "completed",
    Cancelled = "cancelled"
}

function getStatusMessage(status: Status): string {
    switch (status) {
        case Status.Pending:
            return "Waiting to start";
        case Status.Active:
            return "In progress";
        case Status.Completed:
            return "Done!";
        case Status.Cancelled:
            return "Cancelled";
    }
}

console.log(getStatusMessage(Status.Active));

// Solution 3: HTTP Methods
console.log("\n--- HTTP Methods ---");

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

interface ApiRequest {
    method: HttpMethod;
    url: string;
    body?: unknown;
}

const request: ApiRequest = {
    method: HttpMethod.POST,
    url: "/api/users",
    body: { name: "John" }
};

console.log("Request:", request.method, request.url);

// Solution 4: No Reverse Mapping
console.log("\n--- No Reverse Mapping ---");

// String enums don't have reverse mapping
console.log("Direction.Up:", Direction.Up);
// console.log("Direction['UP']:", Direction["UP"]); // Error!

// Numeric enum comparison
enum NumericDirection {
    Up,
    Down
}
console.log("NumericDirection[0]:", NumericDirection[0]); // Works

// Solution 5: Event Types
console.log("\n--- Event Types ---");

enum EventType {
    Click = "click",
    Focus = "focus",
    Blur = "blur",
    Change = "change",
    Submit = "submit"
}

function addEventListener(type: EventType, handler: () => void): void {
    console.log(`Adding listener for: ${type}`);
    // In real code: element.addEventListener(type, handler);
}

addEventListener(EventType.Click, () => console.log("Clicked!"));

// Solution 6: API Endpoints
console.log("\n--- API Endpoints ---");

enum Endpoint {
    Users = "/api/users",
    Posts = "/api/posts",
    Comments = "/api/comments",
    Auth = "/api/auth"
}

function fetchData(endpoint: Endpoint): void {
    console.log(`Fetching from: ${endpoint}`);
}

fetchData(Endpoint.Users);
fetchData(Endpoint.Posts);

// Solution 7: Color Codes
console.log("\n--- Color Codes ---");

enum Color {
    Red = "#FF0000",
    Green = "#00FF00",
    Blue = "#0000FF",
    White = "#FFFFFF",
    Black = "#000000"
}

function setBackgroundColor(color: Color): void {
    console.log(`Setting background to: ${color}`);
}

setBackgroundColor(Color.Blue);

// Solution 8: Iterating String Enums
console.log("\n--- Iterating String Enums ---");

enum Fruit {
    Apple = "apple",
    Banana = "banana",
    Orange = "orange"
}

// Get all values
const fruitValues = Object.values(Fruit);
console.log("Fruit values:", fruitValues);

// Get all keys
const fruitKeys = Object.keys(Fruit);
console.log("Fruit keys:", fruitKeys);

// Solution 9: Type Safety
console.log("\n--- Type Safety ---");

enum Role {
    Admin = "admin",
    User = "user",
    Guest = "guest"
}

function checkAccess(role: Role): boolean {
    // Can't pass arbitrary string
    // checkAccess("admin"); // Error!
    return role === Role.Admin;
}

console.log("Admin access:", checkAccess(Role.Admin));
console.log("User access:", checkAccess(Role.User));

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

enum LogLevel {
    Debug = "DEBUG",
    Info = "INFO",
    Warning = "WARNING",
    Error = "ERROR"
}

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: Date;
}

function log(level: LogLevel, message: string): LogEntry {
    const entry: LogEntry = {
        level,
        message,
        timestamp: new Date()
    };
    
    // String value is readable in output
    console.log(`[${entry.level}] ${entry.message}`);
    
    return entry;
}

log(LogLevel.Info, "Application started");
log(LogLevel.Warning, "Low memory");
log(LogLevel.Error, "Connection failed");

