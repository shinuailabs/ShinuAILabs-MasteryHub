/**
 * Lab 238: Enum Patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common enum patterns:
 * 
 * - State machines
 * - Flags/bitmasks
 * - Lookup tables
 * - Factory patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement state machine
 * 2. Use bitwise flags
 * 3. Create lookup tables
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: State Machine
console.log("--- State Machine ---");

enum OrderState {
    Created = "created",
    Paid = "paid",
    Shipped = "shipped",
    Delivered = "delivered",
    Cancelled = "cancelled"
}

const validTransitions: Record<OrderState, OrderState[]> = {
    [OrderState.Created]: [OrderState.Paid, OrderState.Cancelled],
    [OrderState.Paid]: [OrderState.Shipped, OrderState.Cancelled],
    [OrderState.Shipped]: [OrderState.Delivered],
    [OrderState.Delivered]: [],
    [OrderState.Cancelled]: []
};

function canTransition(from: OrderState, to: OrderState): boolean {
    return validTransitions[from].includes(to);
}

console.log("Created -> Paid:", canTransition(OrderState.Created, OrderState.Paid));
console.log("Shipped -> Cancelled:", canTransition(OrderState.Shipped, OrderState.Cancelled));

// Solution 2: Bitwise Flags
console.log("\n--- Bitwise Flags ---");

enum Permission {
    None = 0,
    Read = 1 << 0,      // 1
    Write = 1 << 1,     // 2
    Execute = 1 << 2,   // 4
    Delete = 1 << 3,    // 8
    Admin = Read | Write | Execute | Delete  // 15
}

function hasPermission(userPerms: Permission, required: Permission): boolean {
    return (userPerms & required) === required;
}

function addPermission(current: Permission, toAdd: Permission): Permission {
    return current | toAdd;
}

function removePermission(current: Permission, toRemove: Permission): Permission {
    return current & ~toRemove;
}

let userPerms = Permission.Read | Permission.Write;
console.log("Has Read:", hasPermission(userPerms, Permission.Read));
console.log("Has Delete:", hasPermission(userPerms, Permission.Delete));

userPerms = addPermission(userPerms, Permission.Execute);
console.log("After adding Execute:", userPerms);

// Solution 3: Lookup Table
console.log("\n--- Lookup Table ---");

enum HttpStatus {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    ServerError = 500
}

const statusMessages: Record<HttpStatus, string> = {
    [HttpStatus.OK]: "Success",
    [HttpStatus.Created]: "Resource created",
    [HttpStatus.BadRequest]: "Invalid request",
    [HttpStatus.Unauthorized]: "Authentication required",
    [HttpStatus.NotFound]: "Resource not found",
    [HttpStatus.ServerError]: "Internal server error"
};

function getStatusMessage(status: HttpStatus): string {
    return statusMessages[status];
}

console.log("200:", getStatusMessage(HttpStatus.OK));
console.log("404:", getStatusMessage(HttpStatus.NotFound));

// Solution 4: Factory Pattern
console.log("\n--- Factory Pattern ---");

enum ShapeType {
    Circle = "circle",
    Rectangle = "rectangle",
    Triangle = "triangle"
}

interface Shape {
    type: ShapeType;
    area(): number;
}

function createShape(type: ShapeType, ...args: number[]): Shape {
    switch (type) {
        case ShapeType.Circle:
            return {
                type,
                area: () => Math.PI * args[0] ** 2
            };
        case ShapeType.Rectangle:
            return {
                type,
                area: () => args[0] * args[1]
            };
        case ShapeType.Triangle:
            return {
                type,
                area: () => (args[0] * args[1]) / 2
            };
    }
}

const circle = createShape(ShapeType.Circle, 5);
console.log("Circle area:", circle.area());

// Solution 5: Command Pattern
console.log("\n--- Command Pattern ---");

enum Command {
    Start = "start",
    Stop = "stop",
    Pause = "pause",
    Resume = "resume"
}

const commandHandlers: Record<Command, () => void> = {
    [Command.Start]: () => console.log("Starting..."),
    [Command.Stop]: () => console.log("Stopping..."),
    [Command.Pause]: () => console.log("Pausing..."),
    [Command.Resume]: () => console.log("Resuming...")
};

function executeCommand(cmd: Command): void {
    commandHandlers[cmd]();
}

executeCommand(Command.Start);
executeCommand(Command.Pause);

// Solution 6: Validation Pattern
console.log("\n--- Validation Pattern ---");

enum ValidationRule {
    Required = "required",
    Email = "email",
    MinLength = "minLength",
    MaxLength = "maxLength"
}

const validators: Record<ValidationRule, (value: string, param?: number) => boolean> = {
    [ValidationRule.Required]: (v) => v.length > 0,
    [ValidationRule.Email]: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    [ValidationRule.MinLength]: (v, p) => v.length >= (p ?? 0),
    [ValidationRule.MaxLength]: (v, p) => v.length <= (p ?? Infinity)
};

function validate(value: string, rule: ValidationRule, param?: number): boolean {
    return validators[rule](value, param);
}

console.log("Required:", validate("hello", ValidationRule.Required));
console.log("Email:", validate("test@example.com", ValidationRule.Email));
console.log("MinLength:", validate("hi", ValidationRule.MinLength, 5));

// Solution 7: Strategy Pattern
console.log("\n--- Strategy Pattern ---");

enum SortStrategy {
    Ascending = "asc",
    Descending = "desc",
    Random = "random"
}

const sortStrategies: Record<SortStrategy, (a: number, b: number) => number> = {
    [SortStrategy.Ascending]: (a, b) => a - b,
    [SortStrategy.Descending]: (a, b) => b - a,
    [SortStrategy.Random]: () => Math.random() - 0.5
};

function sortNumbers(numbers: number[], strategy: SortStrategy): number[] {
    return [...numbers].sort(sortStrategies[strategy]);
}

const nums = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("Ascending:", sortNumbers(nums, SortStrategy.Ascending));
console.log("Descending:", sortNumbers(nums, SortStrategy.Descending));

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}

const logColors: Record<LogLevel, string> = {
    [LogLevel.Debug]: "\x1b[36m",   // Cyan
    [LogLevel.Info]: "\x1b[32m",    // Green
    [LogLevel.Warning]: "\x1b[33m", // Yellow
    [LogLevel.Error]: "\x1b[31m"    // Red
};

function log(level: LogLevel, message: string, minLevel: LogLevel = LogLevel.Info): void {
    if (level >= minLevel) {
        const color = logColors[level];
        const reset = "\x1b[0m";
        console.log(`${color}[${LogLevel[level]}]${reset} ${message}`);
    }
}

log(LogLevel.Debug, "Debug message");
log(LogLevel.Info, "Info message");
log(LogLevel.Warning, "Warning message");
log(LogLevel.Error, "Error message");

