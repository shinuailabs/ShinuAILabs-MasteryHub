/**
 * Lab 207: Mapped Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating types from existing types:
 * 
 * - Basic mapped types
 * - Key remapping
 * - Modifiers (+/-)
 * - Template literal keys
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create mapped types
 * 2. Use key remapping
 * 3. Apply modifiers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Mapped Type
console.log("--- Basic Mapped Type ---");

type User = {
    id: number;
    name: string;
    email: string;
};

// Map all properties to boolean
type UserFlags = {
    [K in keyof User]: boolean;
};

const flags: UserFlags = {
    id: true,
    name: false,
    email: true
};

console.log("Flags:", flags);

// Solution 2: Optional Mapped Type
console.log("\n--- Optional Mapped Type ---");

// Make all properties optional (like Partial)
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};

// Make all properties required (like Required)
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};

type OptionalUser = MyPartial<User>;
const partialUser: OptionalUser = { name: "John" };
console.log("Partial user:", partialUser);

// Solution 3: Readonly Mapped Type
console.log("\n--- Readonly Mapped Type ---");

// Make all properties readonly
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

// Remove readonly
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

type ReadonlyUser = MyReadonly<User>;
type MutableUser = Mutable<ReadonlyUser>;

// Solution 4: Key Remapping
console.log("\n--- Key Remapping ---");

// Add prefix to keys
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// Add suffix to keys
type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type UserGetters = Getters<User>;
type UserSetters = Setters<User>;

// Solution 5: Filtering Keys
console.log("\n--- Filtering Keys ---");

// Keep only string properties
type StringKeys<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};

// Keep only non-function properties
type DataOnly<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type UserStrings = StringKeys<User>;
// Result: { name: string; email: string }

// Solution 6: Conditional Mapped Types
console.log("\n--- Conditional Mapped ---");

type NullableProperties<T> = {
    [K in keyof T]: T[K] | null;
};

type NonNullableProperties<T> = {
    [K in keyof T]: NonNullable<T[K]>;
};

type NullableUser = NullableProperties<User>;

const nullableUser: NullableUser = {
    id: null,
    name: "John",
    email: null
};

console.log("Nullable user:", nullableUser);

// Solution 7: Deep Mapped Types
console.log("\n--- Deep Mapped Types ---");

type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object
        ? DeepReadonly<T[K]>
        : T[K];
};

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object
        ? DeepPartial<T[K]>
        : T[K];
};

interface NestedUser {
    id: number;
    profile: {
        name: string;
        address: {
            city: string;
            country: string;
        };
    };
}

type DeepReadonlyUser = DeepReadonly<NestedUser>;

// Solution 8: Pick and Omit Implementation
console.log("\n--- Pick and Omit ---");

type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P];
};

type UserName = MyPick<User, "name">;
type UserWithoutId = MyOmit<User, "id">;

// Solution 9: Record Implementation
console.log("\n--- Record Implementation ---");

type MyRecord<K extends keyof any, V> = {
    [P in K]: V;
};

type StatusRecord = MyRecord<"pending" | "active", number>;

const status: StatusRecord = {
    pending: 5,
    active: 10
};

console.log("Status:", status);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Form state type
type FormState<T> = {
    values: T;
    errors: { [K in keyof T]?: string };
    touched: { [K in keyof T]?: boolean };
};

// API endpoints type
type ApiEndpoints<T> = {
    [K in keyof T as `fetch${Capitalize<string & K>}`]: () => Promise<T[K]>;
} & {
    [K in keyof T as `update${Capitalize<string & K>}`]: (data: Partial<T[K]>) => Promise<T[K]>;
};

// Event handlers type
type EventHandlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type UserForm = FormState<User>;
type UserEvents = EventHandlers<User>;

const form: UserForm = {
    values: { id: 1, name: "John", email: "john@example.com" },
    errors: { email: "Invalid email" },
    touched: { name: true }
};

console.log("Form state:", form);

