/**
 * Lab 226: Discriminant Property Checks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using discriminant properties:
 * 
 * - Tagged unions
 * - Switch narrowing
 * - Exhaustive checks
 * - Multiple discriminants
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use discriminant properties
 * 2. Implement switch narrowing
 * 3. Handle exhaustive checks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Discriminant
console.log("--- Basic Discriminant ---");

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}

console.log("Circle:", getArea({ kind: "circle", radius: 5 }));
console.log("Square:", getArea({ kind: "square", side: 4 }));
console.log("Rectangle:", getArea({ kind: "rectangle", width: 3, height: 6 }));

// Solution 2: Exhaustive Check
console.log("\n--- Exhaustive Check ---");

function assertNever(x: never): never {
    throw new Error(`Unexpected value: ${x}`);
}

function getPerimeter(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return 2 * Math.PI * shape.radius;
        case "square":
            return 4 * shape.side;
        case "rectangle":
            return 2 * (shape.width + shape.height);
        default:
            return assertNever(shape);
    }
}

console.log("Perimeter:", getPerimeter({ kind: "circle", radius: 5 }));

// Solution 3: Action Types (Redux Pattern)
console.log("\n--- Action Types ---");

type AddAction = { type: "ADD"; payload: number };
type SubtractAction = { type: "SUBTRACT"; payload: number };
type MultiplyAction = { type: "MULTIPLY"; payload: number };
type ResetAction = { type: "RESET" };

type CalculatorAction = AddAction | SubtractAction | MultiplyAction | ResetAction;

function calculatorReducer(state: number, action: CalculatorAction): number {
    switch (action.type) {
        case "ADD":
            return state + action.payload;
        case "SUBTRACT":
            return state - action.payload;
        case "MULTIPLY":
            return state * action.payload;
        case "RESET":
            return 0;
    }
}

let state = 10;
state = calculatorReducer(state, { type: "ADD", payload: 5 });
console.log("After ADD:", state);
state = calculatorReducer(state, { type: "MULTIPLY", payload: 2 });
console.log("After MULTIPLY:", state);

// Solution 4: API Response States
console.log("\n--- API States ---");

type IdleState = { status: "idle" };
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T };
type ErrorState = { status: "error"; error: string };

type AsyncState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): string {
    switch (state.status) {
        case "idle":
            return "Ready to load";
        case "loading":
            return "Loading...";
        case "success":
            return `Data: ${JSON.stringify(state.data)}`;
        case "error":
            return `Error: ${state.error}`;
    }
}

console.log(renderState({ status: "idle" }));
console.log(renderState({ status: "loading" }));
console.log(renderState({ status: "success", data: { id: 1 } }));
console.log(renderState({ status: "error", error: "Not found" }));

// Solution 5: Multiple Discriminants
console.log("\n--- Multiple Discriminants ---");

type HttpGet = { method: "GET"; url: string };
type HttpPost = { method: "POST"; url: string; body: unknown };
type HttpPut = { method: "PUT"; url: string; body: unknown };
type HttpDelete = { method: "DELETE"; url: string };

type HttpRequest = HttpGet | HttpPost | HttpPut | HttpDelete;

function describeRequest(req: HttpRequest): string {
    switch (req.method) {
        case "GET":
            return `GET ${req.url}`;
        case "POST":
            return `POST ${req.url} with body`;
        case "PUT":
            return `PUT ${req.url} with body`;
        case "DELETE":
            return `DELETE ${req.url}`;
    }
}

console.log(describeRequest({ method: "GET", url: "/api/users" }));
console.log(describeRequest({ method: "POST", url: "/api/users", body: {} }));

// Solution 6: Event System
console.log("\n--- Event System ---");

type ClickEvent = { type: "click"; x: number; y: number };
type KeyEvent = { type: "keydown"; key: string };
type FocusEvent = { type: "focus"; target: string };
type BlurEvent = { type: "blur"; target: string };

type UIEvent = ClickEvent | KeyEvent | FocusEvent | BlurEvent;

function handleEvent(event: UIEvent): void {
    switch (event.type) {
        case "click":
            console.log(`Click at (${event.x}, ${event.y})`);
            break;
        case "keydown":
            console.log(`Key pressed: ${event.key}`);
            break;
        case "focus":
            console.log(`Focus on: ${event.target}`);
            break;
        case "blur":
            console.log(`Blur from: ${event.target}`);
            break;
    }
}

handleEvent({ type: "click", x: 100, y: 200 });
handleEvent({ type: "keydown", key: "Enter" });

// Solution 7: Message Types
console.log("\n--- Message Types ---");

type TextMessage = { kind: "text"; content: string };
type ImageMessage = { kind: "image"; url: string; alt?: string };
type VideoMessage = { kind: "video"; url: string; duration: number };
type AudioMessage = { kind: "audio"; url: string; duration: number };

type Message = TextMessage | ImageMessage | VideoMessage | AudioMessage;

function getMessagePreview(msg: Message): string {
    switch (msg.kind) {
        case "text":
            return msg.content.substring(0, 50);
        case "image":
            return `[Image${msg.alt ? `: ${msg.alt}` : ""}]`;
        case "video":
            return `[Video: ${msg.duration}s]`;
        case "audio":
            return `[Audio: ${msg.duration}s]`;
    }
}

console.log(getMessagePreview({ kind: "text", content: "Hello World!" }));
console.log(getMessagePreview({ kind: "image", url: "photo.jpg", alt: "My photo" }));

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

type ValidationSuccess = { valid: true; value: string };
type ValidationError = { valid: false; errors: string[] };
type ValidationResult = ValidationSuccess | ValidationError;

function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email.includes("@")) {
        errors.push("Must contain @");
    }
    if (email.length < 5) {
        errors.push("Too short");
    }
    
    return errors.length === 0
        ? { valid: true, value: email }
        : { valid: false, errors };
}

function handleValidation(result: ValidationResult): void {
    if (result.valid) {
        console.log("Valid email:", result.value);
    } else {
        console.log("Errors:", result.errors.join(", "));
    }
}

handleValidation(validateEmail("test@example.com"));
handleValidation(validateEmail("bad"));

