/**
 * Lab 213: Discriminated Unions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Tagged/discriminated unions:
 * 
 * - Discriminant property
 * - Exhaustive checking
 * - Pattern matching
 * - Type narrowing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create discriminated unions
 * 2. Use exhaustive checking
 * 3. Implement pattern matching
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Discriminated Union
console.log("--- Basic Discriminated Union ---");

type Dog = {
    kind: "dog";
    name: string;
    bark(): void;
};

type Cat = {
    kind: "cat";
    name: string;
    meow(): void;
};

type Bird = {
    kind: "bird";
    name: string;
    fly(): void;
};

type Animal = Dog | Cat | Bird;

function makeSound(animal: Animal): void {
    switch (animal.kind) {
        case "dog":
            animal.bark();
            break;
        case "cat":
            animal.meow();
            break;
        case "bird":
            animal.fly();
            break;
    }
}

const dog: Dog = { kind: "dog", name: "Rex", bark: () => console.log("Woof!") };
makeSound(dog);

// Solution 2: Exhaustive Checking
console.log("\n--- Exhaustive Checking ---");

type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number }
    | { kind: "triangle"; base: number; height: number };

function assertNever(x: never): never {
    throw new Error(`Unexpected value: ${x}`);
}

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
        default:
            return assertNever(shape);
    }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));

// Solution 3: Action Types (Redux Pattern)
console.log("\n--- Action Types ---");

type AddTodoAction = {
    type: "ADD_TODO";
    payload: { id: number; text: string };
};

type RemoveTodoAction = {
    type: "REMOVE_TODO";
    payload: { id: number };
};

type ToggleTodoAction = {
    type: "TOGGLE_TODO";
    payload: { id: number };
};

type TodoAction = AddTodoAction | RemoveTodoAction | ToggleTodoAction;

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
    switch (action.type) {
        case "ADD_TODO":
            return [...state, { ...action.payload, completed: false }];
        case "REMOVE_TODO":
            return state.filter(t => t.id !== action.payload.id);
        case "TOGGLE_TODO":
            return state.map(t =>
                t.id === action.payload.id ? { ...t, completed: !t.completed } : t
            );
    }
}

console.log("Reducer works with discriminated unions");

// Solution 4: API Response Types
console.log("\n--- API Response Types ---");

type LoadingState = {
    status: "loading";
};

type SuccessState<T> = {
    status: "success";
    data: T;
};

type ErrorState = {
    status: "error";
    error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): string {
    switch (state.status) {
        case "loading":
            return "Loading...";
        case "success":
            return `Data: ${JSON.stringify(state.data)}`;
        case "error":
            return `Error: ${state.error}`;
    }
}

console.log(renderState({ status: "loading" }));
console.log(renderState({ status: "success", data: { id: 1 } }));
console.log(renderState({ status: "error", error: "Not found" }));

// Solution 5: Event System
console.log("\n--- Event System ---");

type ClickEvent = {
    type: "click";
    x: number;
    y: number;
    button: "left" | "right" | "middle";
};

type KeyEvent = {
    type: "keydown" | "keyup";
    key: string;
    ctrlKey: boolean;
    shiftKey: boolean;
};

type ScrollEvent = {
    type: "scroll";
    scrollX: number;
    scrollY: number;
};

type UIEvent = ClickEvent | KeyEvent | ScrollEvent;

function handleUIEvent(event: UIEvent): void {
    switch (event.type) {
        case "click":
            console.log(`Click at (${event.x}, ${event.y}) with ${event.button}`);
            break;
        case "keydown":
        case "keyup":
            console.log(`Key ${event.type}: ${event.key}`);
            break;
        case "scroll":
            console.log(`Scroll to (${event.scrollX}, ${event.scrollY})`);
            break;
    }
}

handleUIEvent({ type: "click", x: 100, y: 200, button: "left" });

// Solution 6: Payment Methods
console.log("\n--- Payment Methods ---");

type CreditCard = {
    method: "credit_card";
    cardNumber: string;
    expiry: string;
    cvv: string;
};

type PayPal = {
    method: "paypal";
    email: string;
};

type BankTransfer = {
    method: "bank_transfer";
    accountNumber: string;
    routingNumber: string;
};

type PaymentMethod = CreditCard | PayPal | BankTransfer;

function processPayment(payment: PaymentMethod, amount: number): void {
    switch (payment.method) {
        case "credit_card":
            console.log(`Charging $${amount} to card ending in ${payment.cardNumber.slice(-4)}`);
            break;
        case "paypal":
            console.log(`Charging $${amount} to PayPal: ${payment.email}`);
            break;
        case "bank_transfer":
            console.log(`Transferring $${amount} from account ${payment.accountNumber}`);
            break;
    }
}

processPayment({ method: "credit_card", cardNumber: "1234567890123456", expiry: "12/25", cvv: "123" }, 99.99);

// Solution 7: Message Types
console.log("\n--- Message Types ---");

type TextMessage = { type: "text"; content: string };
type ImageMessage = { type: "image"; url: string; caption?: string };
type VideoMessage = { type: "video"; url: string; duration: number };
type FileMessage = { type: "file"; filename: string; size: number };

type Message = TextMessage | ImageMessage | VideoMessage | FileMessage;

function renderMessage(msg: Message): string {
    switch (msg.type) {
        case "text":
            return msg.content;
        case "image":
            return `[Image: ${msg.url}]${msg.caption ? ` - ${msg.caption}` : ""}`;
        case "video":
            return `[Video: ${msg.url}] (${msg.duration}s)`;
        case "file":
            return `[File: ${msg.filename}] (${msg.size} bytes)`;
    }
}

console.log(renderMessage({ type: "text", content: "Hello!" }));
console.log(renderMessage({ type: "image", url: "photo.jpg", caption: "My photo" }));

