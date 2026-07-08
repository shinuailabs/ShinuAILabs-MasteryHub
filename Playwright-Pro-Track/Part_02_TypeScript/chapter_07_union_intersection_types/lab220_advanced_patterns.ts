/**
 * Lab 220: Advanced Union/Intersection Patterns
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Advanced type patterns:
 *
 * - Branded types
 * - Opaque types
 * - State machines
 * - Builder patterns
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create branded types
 * 2. Implement state machines
 * 3. Use advanced patterns
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Branded Types
console.log("--- Branded Types ---");

type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function createUserId(id: string): UserId {
    return id as UserId;
}

function createOrderId(id: string): OrderId {
    return id as OrderId;
}

function getUser(id: UserId): void {
    console.log("Getting user:", id);
}

const userId = createUserId("user123");
const orderId = createOrderId("order456");

getUser(userId);  // OK
// getUser(orderId);  // Error! Type mismatch

// Solution 2: Opaque Types
console.log("\n--- Opaque Types ---");

type Email = string & { readonly __opaque__: unique symbol };
type Password = string & { readonly __opaque__: unique symbol };

function validateEmail(email: string): Email | null {
    if (email.includes("@")) {
        return email as Email;
    }
    return null;
}

function validatePassword(password: string): Password | null {
    if (password.length >= 8) {
        return password as Password;
    }
    return null;
}

const email = validateEmail("test@example.com");
const password = validatePassword("secret123");

console.log("Email:", email);

// Solution 3: State Machine Types
console.log("\n--- State Machine ---");

type Draft = { status: "draft"; content: string };
type Review = { status: "review"; content: string; reviewer: string };
type Published = { status: "published"; content: string; publishedAt: Date };
type Archived = { status: "archived"; content: string; archivedAt: Date };

type Article = Draft | Review | Published | Archived;

function submitForReview(article: Draft, reviewer: string): Review {
    return { status: "review", content: article.content, reviewer };
}

function publish(article: Review): Published {
    return { status: "published", content: article.content, publishedAt: new Date() };
}

function archive(article: Published): Archived {
    return { status: "archived", content: article.content, archivedAt: new Date() };
}

let article: Article = { status: "draft", content: "Hello World" };
article = submitForReview(article as Draft, "editor");
article = publish(article as Review);
console.log("Article status:", article.status);

// Solution 4: Builder Pattern with Types
console.log("\n--- Builder Pattern ---");

type BuilderState = {
    hasName: boolean;
    hasEmail: boolean;
    hasAge: boolean;
};

type UserBuilder<S extends BuilderState> = {
    state: S;
    data: Partial<{ name: string; email: string; age: number }>;
};

function createBuilder(): UserBuilder<{ hasName: false; hasEmail: false; hasAge: false }> {
    return { state: { hasName: false, hasEmail: false, hasAge: false }, data: {} };
}

function withName<S extends BuilderState>(
    builder: UserBuilder<S>,
    name: string
): UserBuilder<S & { hasName: true }> {
    return { ...builder, state: { ...builder.state, hasName: true }, data: { ...builder.data, name } };
}

function withEmail<S extends BuilderState>(
    builder: UserBuilder<S>,
    email: string
): UserBuilder<S & { hasEmail: true }> {
    return { ...builder, state: { ...builder.state, hasEmail: true }, data: { ...builder.data, email } };
}

const builder = withEmail(withName(createBuilder(), "John"), "john@example.com");
console.log("Builder data:", builder.data);

// Solution 5: Exhaustive Pattern Matching
console.log("\n--- Exhaustive Matching ---");

type Result<T, E> = { type: "ok"; value: T } | { type: "err"; error: E };

function match<T, E, R>(
    result: Result<T, E>,
    handlers: { ok: (value: T) => R; err: (error: E) => R }
): R {
    switch (result.type) {
        case "ok":
            return handlers.ok(result.value);
        case "err":
            return handlers.err(result.error);
    }
}

const result: Result<number, string> = { type: "ok", value: 42 };
const message = match(result, {
    ok: (v) => `Success: ${v}`,
    err: (e) => `Error: ${e}`
});
console.log(message);

// Solution 6: Discriminated Union Factory
console.log("\n--- Union Factory ---");

type ActionCreator<T extends string, P = void> = P extends void
    ? { type: T }
    : { type: T; payload: P };

function createAction<T extends string>(type: T): ActionCreator<T>;
function createAction<T extends string, P>(type: T, payload: P): ActionCreator<T, P>;
function createAction<T extends string, P>(type: T, payload?: P) {
    return payload === undefined ? { type } : { type, payload };
}

const increment = createAction("INCREMENT");
const addTodo = createAction("ADD_TODO", { text: "Learn TypeScript" });

console.log("Actions:", increment, addTodo);

// Solution 7: Conditional Props
console.log("\n--- Conditional Props ---");

type BaseProps = { id: string };
type WithLabel = BaseProps & { variant: "labeled"; label: string };
type WithIcon = BaseProps & { variant: "icon"; icon: string };
type WithBoth = BaseProps & { variant: "both"; label: string; icon: string };

type ButtonProps = WithLabel | WithIcon | WithBoth;

function renderButton(props: ButtonProps): string {
    switch (props.variant) {
        case "labeled":
            return `Button: ${props.label}`;
        case "icon":
            return `Button: [${props.icon}]`;
        case "both":
            return `Button: [${props.icon}] ${props.label}`;
    }
}

console.log(renderButton({ id: "1", variant: "both", label: "Save", icon: "💾" }));

// Solution 8: Type-Safe Event Emitter
console.log("\n--- Event Emitter ---");

type Events = {
    login: { userId: string };
    logout: { userId: string };
    error: { message: string };
};

type EventEmitter<E extends Record<string, unknown>> = {
    on<K extends keyof E>(event: K, handler: (data: E[K]) => void): void;
    emit<K extends keyof E>(event: K, data: E[K]): void;
};

function createEmitter<E extends Record<string, unknown>>(): EventEmitter<E> {
    const handlers: Partial<Record<keyof E, Function[]>> = {};
    return {
        on(event, handler) {
            (handlers[event] ??= []).push(handler);
        },
        emit(event, data) {
            handlers[event]?.forEach(h => h(data));
        }
    };
}

const emitter = createEmitter<Events>();
emitter.on("login", (data) => console.log("Login:", data.userId));
emitter.emit("login", { userId: "user123" });

console.log("Advanced patterns complete!");
