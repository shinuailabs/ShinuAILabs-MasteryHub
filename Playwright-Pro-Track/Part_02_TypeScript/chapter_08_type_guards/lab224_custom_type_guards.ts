/**
 * Lab 224: Custom Type Guards
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating type predicate functions:
 * 
 * - Type predicates
 * - is keyword
 * - Complex validations
 * - Reusable guards
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom type guards
 * 2. Use type predicates
 * 3. Build validation guards
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Type Predicate
console.log("--- Basic Type Predicate ---");

interface Cat {
    meow(): void;
    purr(): void;
}

interface Dog {
    bark(): void;
    wagTail(): void;
}

function isCat(animal: Cat | Dog): animal is Cat {
    return "meow" in animal;
}

function isDog(animal: Cat | Dog): animal is Dog {
    return "bark" in animal;
}

const pet: Cat | Dog = { meow: () => {}, purr: () => {} };

if (isCat(pet)) {
    pet.meow();
    pet.purr();
}

// Solution 2: Validating Unknown
console.log("\n--- Validating Unknown ---");

interface User {
    id: number;
    name: string;
    email: string;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value &&
        "email" in value &&
        typeof (value as User).id === "number" &&
        typeof (value as User).name === "string" &&
        typeof (value as User).email === "string"
    );
}

const data: unknown = { id: 1, name: "John", email: "john@example.com" };

if (isUser(data)) {
    console.log(`User: ${data.name} (${data.email})`);
}

// Solution 3: Array Type Guards
console.log("\n--- Array Type Guards ---");

function isStringArray(arr: unknown[]): arr is string[] {
    return arr.every(item => typeof item === "string");
}

function isNumberArray(arr: unknown[]): arr is number[] {
    return arr.every(item => typeof item === "number");
}

function processArray(arr: unknown[]): void {
    if (isStringArray(arr)) {
        console.log("Strings:", arr.map(s => s.toUpperCase()).join(", "));
    } else if (isNumberArray(arr)) {
        console.log("Sum:", arr.reduce((a, b) => a + b, 0));
    }
}

processArray(["a", "b", "c"]);
processArray([1, 2, 3, 4, 5]);

// Solution 4: Nullable Guards
console.log("\n--- Nullable Guards ---");

function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}

function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

const values: (string | null)[] = ["a", null, "b", null, "c"];
const filtered = values.filter(isNotNull);
console.log("Filtered:", filtered);

// Solution 5: Complex Object Guards
console.log("\n--- Complex Object Guards ---");

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

function isSuccessResponse<T>(
    response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } {
    return response.success === true && response.data !== undefined;
}

function isErrorResponse<T>(
    response: ApiResponse<T>
): response is ApiResponse<T> & { success: false; error: string } {
    return response.success === false && response.error !== undefined;
}

function handleResponse<T>(response: ApiResponse<T>): void {
    if (isSuccessResponse(response)) {
        console.log("Data:", response.data);
    } else if (isErrorResponse(response)) {
        console.log("Error:", response.error);
    }
}

handleResponse({ success: true, data: { id: 1 } });
handleResponse({ success: false, error: "Not found" });

// Solution 6: Discriminated Union Guards
console.log("\n--- Discriminated Union Guards ---");

type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle = { kind: "triangle"; base: number; height: number };
type Shape = Circle | Rectangle | Triangle;

function isCircle(shape: Shape): shape is Circle {
    return shape.kind === "circle";
}

function isRectangle(shape: Shape): shape is Rectangle {
    return shape.kind === "rectangle";
}

function isTriangle(shape: Shape): shape is Triangle {
    return shape.kind === "triangle";
}

const shapes: Shape[] = [
    { kind: "circle", radius: 5 },
    { kind: "rectangle", width: 4, height: 6 },
    { kind: "triangle", base: 3, height: 4 }
];

const circles = shapes.filter(isCircle);
console.log("Circles:", circles.length);

// Solution 7: Generic Type Guards
console.log("\n--- Generic Type Guards ---");

function hasProperty<T extends object, K extends string>(
    obj: T,
    key: K
): obj is T & Record<K, unknown> {
    return key in obj;
}

function hasMethod<T extends object, K extends string>(
    obj: T,
    key: K
): obj is T & Record<K, Function> {
    return key in obj && typeof (obj as any)[key] === "function";
}

const obj = { name: "John", greet: () => "Hello" };

if (hasProperty(obj, "name")) {
    console.log("Has name:", obj.name);
}

if (hasMethod(obj, "greet")) {
    console.log("Greeting:", obj.greet());
}

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

interface TextMessage {
    type: "text";
    content: string;
}

interface ImageMessage {
    type: "image";
    url: string;
    caption?: string;
}

interface VideoMessage {
    type: "video";
    url: string;
    duration: number;
}

type Message = TextMessage | ImageMessage | VideoMessage;

const isTextMessage = (msg: Message): msg is TextMessage => msg.type === "text";
const isImageMessage = (msg: Message): msg is ImageMessage => msg.type === "image";
const isVideoMessage = (msg: Message): msg is VideoMessage => msg.type === "video";

function renderMessage(message: Message): string {
    if (isTextMessage(message)) {
        return message.content;
    }
    if (isImageMessage(message)) {
        return `[Image: ${message.url}]${message.caption ? ` - ${message.caption}` : ""}`;
    }
    if (isVideoMessage(message)) {
        return `[Video: ${message.url}] (${message.duration}s)`;
    }
    return "Unknown message";
}

console.log(renderMessage({ type: "text", content: "Hello!" }));
console.log(renderMessage({ type: "image", url: "photo.jpg", caption: "My photo" }));

