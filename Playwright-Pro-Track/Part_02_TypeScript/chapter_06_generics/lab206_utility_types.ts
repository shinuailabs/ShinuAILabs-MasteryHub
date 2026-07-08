/**
 * Lab 206: Utility Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Built-in TypeScript utility types:
 * 
 * - Partial, Required, Readonly
 * - Pick, Omit, Record
 * - Extract, Exclude
 * - ReturnType, Parameters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use built-in utility types
 * 2. Combine utility types
 * 3. Create custom utilities
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Partial
console.log("--- Partial ---");

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// All properties become optional
type PartialUser = Partial<User>;

function updateUser(id: number, updates: Partial<User>): void {
    console.log(`Updating user ${id} with:`, updates);
}

updateUser(1, { name: "John" });
updateUser(2, { email: "new@example.com", age: 31 });

// Solution 2: Required
console.log("\n--- Required ---");

interface Config {
    host?: string;
    port?: number;
    ssl?: boolean;
}

// All properties become required
type RequiredConfig = Required<Config>;

const config: RequiredConfig = {
    host: "localhost",
    port: 3000,
    ssl: false
};

console.log("Config:", config);

// Solution 3: Readonly
console.log("\n--- Readonly ---");

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
    id: 1,
    name: "John",
    email: "john@example.com",
    age: 30
};

// user.name = "Jane"; // Error: readonly
console.log("Readonly user:", user);

// Solution 4: Pick
console.log("\n--- Pick ---");

// Select specific properties
type UserCredentials = Pick<User, "email" | "name">;
type UserIdentity = Pick<User, "id" | "name">;

const credentials: UserCredentials = {
    email: "john@example.com",
    name: "John"
};

console.log("Credentials:", credentials);

// Solution 5: Omit
console.log("\n--- Omit ---");

// Exclude specific properties
type UserWithoutId = Omit<User, "id">;
type PublicUser = Omit<User, "email" | "age">;

const newUser: UserWithoutId = {
    name: "Jane",
    email: "jane@example.com",
    age: 25
};

console.log("New user:", newUser);

// Solution 6: Record
console.log("\n--- Record ---");

// Create object type with specific keys
type UserRoles = Record<string, string[]>;
type StatusMap = Record<"pending" | "active" | "completed", number>;

const roles: UserRoles = {
    admin: ["read", "write", "delete"],
    user: ["read"]
};

const statusCounts: StatusMap = {
    pending: 5,
    active: 10,
    completed: 20
};

console.log("Roles:", roles);
console.log("Status counts:", statusCounts);

// Solution 7: Extract and Exclude
console.log("\n--- Extract and Exclude ---");

type AllTypes = string | number | boolean | null | undefined;

// Extract types that match
type StringOrNumber = Extract<AllTypes, string | number>;

// Exclude types that match
type NonNullTypes = Exclude<AllTypes, null | undefined>;

const value1: StringOrNumber = "hello";
const value2: NonNullTypes = true;

console.log("Extracted:", value1);
console.log("Excluded:", value2);

// Solution 8: ReturnType and Parameters
console.log("\n--- ReturnType and Parameters ---");

function createUser(name: string, age: number): User {
    return { id: Date.now(), name, email: "", age };
}

// Get return type of function
type CreateUserReturn = ReturnType<typeof createUser>;

// Get parameter types
type CreateUserParams = Parameters<typeof createUser>;

const params: CreateUserParams = ["John", 30];
console.log("Params:", params);

// Solution 9: NonNullable
console.log("\n--- NonNullable ---");

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;

const definite: DefiniteString = "hello";
console.log("Definite:", definite);

// Solution 10: Combining Utility Types
console.log("\n--- Combining Types ---");

// Partial + Pick
type PartialUserName = Partial<Pick<User, "name" | "email">>;

// Readonly + Omit
type ReadonlyUserWithoutId = Readonly<Omit<User, "id">>;

// Required + Pick
type RequiredCredentials = Required<Pick<Config, "host" | "port">>;

// Custom combination
type UpdateUserDTO = Partial<Omit<User, "id">> & { id: number };

const update: UpdateUserDTO = {
    id: 1,
    name: "Updated Name"
};

console.log("Update DTO:", update);

// Solution 11: Custom Utility Types
console.log("\n--- Custom Utilities ---");

// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Deep partial
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type UserWithOptionalEmail = PartialBy<User, "email">;

const userOptEmail: UserWithOptionalEmail = {
    id: 1,
    name: "John",
    age: 30
    // email is optional
};

console.log("Optional email user:", userOptEmail);

// Solution 12: Practical Example
console.log("\n--- Practical Example ---");

interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

// Response types for different operations
type GetUserResponse = ApiResponse<User>;
type GetUsersResponse = ApiResponse<User[]>;
type CreateUserRequest = Omit<User, "id">;
type UpdateUserRequest = Partial<Omit<User, "id">>;

const createRequest: CreateUserRequest = {
    name: "John",
    email: "john@example.com",
    age: 30
};

console.log("Create request:", createRequest);

