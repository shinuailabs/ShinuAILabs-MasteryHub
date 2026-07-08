/**
 * Lab 209: Template Literal Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * String manipulation at type level:
 * 
 * - Template literal syntax
 * - String unions
 * - Intrinsic string types
 * - Pattern matching
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create template literal types
 * 2. Use string manipulation
 * 3. Build type-safe strings
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Template Literal
console.log("--- Basic Template Literal ---");

type Greeting = `Hello, ${string}!`;

const greeting1: Greeting = "Hello, World!";
const greeting2: Greeting = "Hello, TypeScript!";

console.log(greeting1);
console.log(greeting2);

// Solution 2: Union in Template
console.log("\n--- Union in Template ---");

type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

type ColoredSize = `${Color}-${Size}`;
// "red-small" | "red-medium" | "red-large" | "green-small" | ...

const item: ColoredSize = "red-medium";
console.log("Item:", item);

// Solution 3: Intrinsic String Types
console.log("\n--- Intrinsic String Types ---");

type Name = "john";

type UpperName = Uppercase<Name>;      // "JOHN"
type LowerName = Lowercase<"JOHN">;    // "john"
type CapName = Capitalize<Name>;       // "John"
type UncapName = Uncapitalize<"John">; // "john"

// With unions
type Events = "click" | "focus" | "blur";
type UpperEvents = Uppercase<Events>;  // "CLICK" | "FOCUS" | "BLUR"

// Solution 4: Event Handler Types
console.log("\n--- Event Handler Types ---");

type EventName = "click" | "change" | "focus";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onChange" | "onFocus"

type EventHandlers = {
    [K in EventName as `on${Capitalize<K>}`]: () => void;
};

const handlers: EventHandlers = {
    onClick: () => console.log("clicked"),
    onChange: () => console.log("changed"),
    onFocus: () => console.log("focused")
};

handlers.onClick();

// Solution 5: Getter/Setter Types
console.log("\n--- Getter/Setter Types ---");

type User = {
    name: string;
    age: number;
    email: string;
};

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; getEmail: () => string }

// Solution 6: CSS Property Types
console.log("\n--- CSS Property Types ---");

type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;

const width: CSSValue = "100px";
const margin: CSSValue = "1.5rem";

console.log("Width:", width);
console.log("Margin:", margin);

// Solution 7: Route Types
console.log("\n--- Route Types ---");

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Route = `/api/${string}`;

type Endpoint = `${HttpMethod} ${Route}`;

const endpoint1: Endpoint = "GET /api/users";
const endpoint2: Endpoint = "POST /api/users";

console.log("Endpoint:", endpoint1);

// Solution 8: Extract from Template
console.log("\n--- Extract from Template ---");

type ExtractRouteParams<T extends string> = 
    T extends `${string}:${infer Param}/${infer Rest}`
        ? Param | ExtractRouteParams<`/${Rest}`>
        : T extends `${string}:${infer Param}`
            ? Param
            : never;

type Params = ExtractRouteParams<"/users/:userId/posts/:postId">;
// "userId" | "postId"

// Solution 9: Join Types
console.log("\n--- Join Types ---");

type Join<T extends string[], D extends string> = 
    T extends []
        ? ""
        : T extends [infer F extends string]
            ? F
            : T extends [infer F extends string, ...infer R extends string[]]
                ? `${F}${D}${Join<R, D>}`
                : never;

type Joined = Join<["a", "b", "c"], "-">;  // "a-b-c"

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API endpoint builder
type ApiVersion = "v1" | "v2";
type Resource = "users" | "posts" | "comments";
type ApiEndpoint = `/api/${ApiVersion}/${Resource}`;

const api: ApiEndpoint = "/api/v1/users";
console.log("API:", api);

// Environment variables
type EnvPrefix = "REACT_APP" | "NEXT_PUBLIC";
type EnvVar = `${EnvPrefix}_${Uppercase<string>}`;

// BEM class names
type Block = "button" | "card" | "modal";
type Element = "title" | "body" | "footer";
type Modifier = "active" | "disabled" | "large";

type BEMClass = 
    | Block 
    | `${Block}__${Element}` 
    | `${Block}--${Modifier}`
    | `${Block}__${Element}--${Modifier}`;

const className: BEMClass = "button__title--active";
console.log("Class:", className);

// SQL-like query types
type Table = "users" | "posts";
type SelectQuery = `SELECT * FROM ${Table}`;
type InsertQuery = `INSERT INTO ${Table}`;

const query: SelectQuery = "SELECT * FROM users";
console.log("Query:", query);

