/**
 * Lab 231: Numeric Enums
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Numeric enums in TypeScript:
 * 
 * - Auto-incrementing values
 * - Custom values
 * - Reverse mapping
 * - Computed members
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create numeric enums
 * 2. Use custom values
 * 3. Access reverse mappings
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Numeric Enum
console.log("--- Basic Numeric Enum ---");

enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right    // 3
}

console.log("Up:", Direction.Up);
console.log("Down:", Direction.Down);
console.log("Left:", Direction.Left);
console.log("Right:", Direction.Right);

// Solution 2: Custom Starting Value
console.log("\n--- Custom Starting Value ---");

enum StatusCode {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    ServerError = 500
}

console.log("OK:", StatusCode.OK);
console.log("NotFound:", StatusCode.NotFound);

// Solution 3: Auto-increment from Custom
console.log("\n--- Auto-increment ---");

enum Priority {
    Low = 1,
    Medium,    // 2
    High,      // 3
    Critical   // 4
}

console.log("Low:", Priority.Low);
console.log("Medium:", Priority.Medium);
console.log("Critical:", Priority.Critical);

// Solution 4: Reverse Mapping
console.log("\n--- Reverse Mapping ---");

enum Color {
    Red,
    Green,
    Blue
}

// Forward: name -> value
console.log("Color.Red:", Color.Red);

// Reverse: value -> name
console.log("Color[0]:", Color[0]);
console.log("Color[1]:", Color[1]);
console.log("Color[2]:", Color[2]);

// Solution 5: Using Enums in Functions
console.log("\n--- Enums in Functions ---");

function move(direction: Direction): string {
    switch (direction) {
        case Direction.Up:
            return "Moving up";
        case Direction.Down:
            return "Moving down";
        case Direction.Left:
            return "Moving left";
        case Direction.Right:
            return "Moving right";
    }
}

console.log(move(Direction.Up));
console.log(move(Direction.Left));

// Solution 6: Enum as Object Key
console.log("\n--- Enum as Key ---");

const directionNames: { [key in Direction]: string } = {
    [Direction.Up]: "North",
    [Direction.Down]: "South",
    [Direction.Left]: "West",
    [Direction.Right]: "East"
};

console.log("Up is:", directionNames[Direction.Up]);

// Solution 7: Bitwise Flags
console.log("\n--- Bitwise Flags ---");

enum Permission {
    None = 0,
    Read = 1 << 0,    // 1
    Write = 1 << 1,   // 2
    Execute = 1 << 2, // 4
    All = Read | Write | Execute  // 7
}

function hasPermission(userPerms: Permission, required: Permission): boolean {
    return (userPerms & required) === required;
}

const userPermissions = Permission.Read | Permission.Write;
console.log("Has Read:", hasPermission(userPermissions, Permission.Read));
console.log("Has Execute:", hasPermission(userPermissions, Permission.Execute));
console.log("Has All:", hasPermission(userPermissions, Permission.All));

// Solution 8: Computed Members
console.log("\n--- Computed Members ---");

function getBaseValue(): number {
    return 100;
}

enum ComputedEnum {
    A = getBaseValue(),
    B,  // 101
    C   // 102
}

console.log("A:", ComputedEnum.A);
console.log("B:", ComputedEnum.B);
console.log("C:", ComputedEnum.C);

// Solution 9: Iterating Enum Values
console.log("\n--- Iterating Enums ---");

enum Weekday {
    Monday = 1,
    Tuesday,
    Wednesday,
    Thursday,
    Friday
}

// Get all numeric values
const numericValues = Object.values(Weekday).filter(v => typeof v === "number");
console.log("Numeric values:", numericValues);

// Get all string keys
const stringKeys = Object.keys(Weekday).filter(k => isNaN(Number(k)));
console.log("String keys:", stringKeys);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Critical = 4
}

class Logger {
    constructor(private minLevel: LogLevel = LogLevel.Info) {}
    
    log(level: LogLevel, message: string): void {
        if (level >= this.minLevel) {
            const levelName = LogLevel[level];
            console.log(`[${levelName}] ${message}`);
        }
    }
}

const logger = new Logger(LogLevel.Warning);
logger.log(LogLevel.Debug, "Debug message");    // Not shown
logger.log(LogLevel.Info, "Info message");      // Not shown
logger.log(LogLevel.Warning, "Warning message"); // Shown
logger.log(LogLevel.Error, "Error message");    // Shown

