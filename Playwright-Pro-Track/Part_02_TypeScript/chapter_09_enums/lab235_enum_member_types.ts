/**
 * Lab 235: Enum Member Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Enum members as types:
 * 
 * - Literal enum members
 * - Union of members
 * - Type narrowing
 * - Discriminated unions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use enum members as types
 * 2. Create union types
 * 3. Narrow enum types
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Enum Member as Type
console.log("--- Enum Member as Type ---");

enum Status {
    Active = "active",
    Inactive = "inactive",
    Pending = "pending"
}

// Use specific member as type
type ActiveStatus = Status.Active;

function handleActive(status: Status.Active): void {
    console.log("Handling active status:", status);
}

handleActive(Status.Active);
// handleActive(Status.Inactive); // Error!

// Solution 2: Union of Enum Members
console.log("\n--- Union of Members ---");

enum Permission {
    Read = "read",
    Write = "write",
    Delete = "delete",
    Admin = "admin"
}

// Subset of permissions
type BasicPermission = Permission.Read | Permission.Write;
type AdminPermission = Permission.Admin;

function checkBasicPermission(perm: BasicPermission): void {
    console.log("Basic permission:", perm);
}

checkBasicPermission(Permission.Read);
checkBasicPermission(Permission.Write);
// checkBasicPermission(Permission.Delete); // Error!

// Solution 3: Enum in Discriminated Union
console.log("\n--- Discriminated Union ---");

enum ShapeType {
    Circle = "circle",
    Rectangle = "rectangle",
    Triangle = "triangle"
}

interface Circle {
    type: ShapeType.Circle;
    radius: number;
}

interface Rectangle {
    type: ShapeType.Rectangle;
    width: number;
    height: number;
}

interface Triangle {
    type: ShapeType.Triangle;
    base: number;
    height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    switch (shape.type) {
        case ShapeType.Circle:
            return Math.PI * shape.radius ** 2;
        case ShapeType.Rectangle:
            return shape.width * shape.height;
        case ShapeType.Triangle:
            return (shape.base * shape.height) / 2;
    }
}

console.log("Circle area:", getArea({ type: ShapeType.Circle, radius: 5 }));

// Solution 4: Extracting Enum Types
console.log("\n--- Extracting Types ---");

enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue"
}

// Get all enum values as union type
type ColorValue = `${Color}`;
// "red" | "green" | "blue"

// Get enum keys
type ColorKey = keyof typeof Color;
// "Red" | "Green" | "Blue"

const colorValue: ColorValue = "red";
const colorKey: ColorKey = "Red";

console.log("Value:", colorValue);
console.log("Key:", colorKey);

// Solution 5: Conditional Types with Enums
console.log("\n--- Conditional Types ---");

enum UserRole {
    Admin = "admin",
    User = "user",
    Guest = "guest"
}

type IsAdmin<T> = T extends UserRole.Admin ? true : false;

type AdminCheck = IsAdmin<UserRole.Admin>;  // true
type UserCheck = IsAdmin<UserRole.User>;    // false

// Solution 6: Mapped Types with Enums
console.log("\n--- Mapped Types ---");

enum EventType {
    Click = "click",
    Focus = "focus",
    Blur = "blur"
}

type EventHandlers = {
    [K in EventType]: () => void;
};

const handlers: EventHandlers = {
    [EventType.Click]: () => console.log("Clicked"),
    [EventType.Focus]: () => console.log("Focused"),
    [EventType.Blur]: () => console.log("Blurred")
};

handlers[EventType.Click]();

// Solution 7: Enum Subsets
console.log("\n--- Enum Subsets ---");

enum HttpStatus {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    ServerError = 500
}

// Success statuses
type SuccessStatus = HttpStatus.OK | HttpStatus.Created;

// Error statuses
type ErrorStatus = HttpStatus.BadRequest | HttpStatus.Unauthorized | 
                   HttpStatus.NotFound | HttpStatus.ServerError;

function isSuccess(status: HttpStatus): status is SuccessStatus {
    return status === HttpStatus.OK || status === HttpStatus.Created;
}

function handleStatus(status: HttpStatus): void {
    if (isSuccess(status)) {
        console.log("Success:", status);
    } else {
        console.log("Error:", status);
    }
}

handleStatus(HttpStatus.OK);
handleStatus(HttpStatus.NotFound);

// Solution 8: Generic with Enum Constraint
console.log("\n--- Generic Constraint ---");

enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}

function logAtLevel<T extends LogLevel>(level: T, message: string): void {
    const levelName = LogLevel[level];
    console.log(`[${levelName}] ${message}`);
}

logAtLevel(LogLevel.Info, "Information");
logAtLevel(LogLevel.Error, "Error occurred");

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

enum ActionType {
    Add = "ADD",
    Remove = "REMOVE",
    Update = "UPDATE"
}

interface AddAction {
    type: ActionType.Add;
    payload: { item: string };
}

interface RemoveAction {
    type: ActionType.Remove;
    payload: { id: number };
}

interface UpdateAction {
    type: ActionType.Update;
    payload: { id: number; item: string };
}

type Action = AddAction | RemoveAction | UpdateAction;

function reducer(state: string[], action: Action): string[] {
    switch (action.type) {
        case ActionType.Add:
            return [...state, action.payload.item];
        case ActionType.Remove:
            return state.filter((_, i) => i !== action.payload.id);
        case ActionType.Update:
            return state.map((item, i) => 
                i === action.payload.id ? action.payload.item : item
            );
    }
}

let state = ["a", "b", "c"];
state = reducer(state, { type: ActionType.Add, payload: { item: "d" } });
console.log("After add:", state);

