# Part 08: Enums

## 📚 Overview
Enums allow defining a set of named constants, making code more readable and maintainable.

---

## 🎯 Key Concepts

### 1. Numeric Enums

```typescript
// Basic numeric enum (auto-incremented from 0)
enum Direction {
  North,  // 0
  South,  // 1
  East,   // 2
  West    // 3
}

let dir: Direction = Direction.North;
console.log(dir);  // 0

// Custom starting value
enum Status {
  Pending = 1,
  Approved,   // 2
  Rejected    // 3
}

// Custom values
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500
}
```

### 2. String Enums

```typescript
enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST"
}

let dir: Direction = Direction.North;
console.log(dir);  // "NORTH"

// More readable in logs and debugging
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warning = "WARNING",
  Error = "ERROR"
}

function log(level: LogLevel, message: string): void {
  console.log(`[${level}] ${message}`);
}

log(LogLevel.Error, "Something went wrong");
// [ERROR] Something went wrong
```

### 3. Heterogeneous Enums

```typescript
// Mix of string and numeric (not recommended)
enum Mixed {
  No = 0,
  Yes = "YES"
}

// Better to stick with one type
```

### 4. Computed Enums

```typescript
enum FileAccess {
  None,
  Read = 1 << 1,      // 2
  Write = 1 << 2,     // 4
  ReadWrite = Read | Write,  // 6
  Admin = ReadWrite | 1 << 3  // 14
}

// Check permissions with bitwise AND
function hasReadAccess(access: FileAccess): boolean {
  return (access & FileAccess.Read) === FileAccess.Read;
}
```

### 5. Const Enums

```typescript
// Const enums are inlined at compile time
const enum Direction {
  North,
  South,
  East,
  West
}

let dir = Direction.North;
// Compiles to: let dir = 0;

// Benefits:
// - No runtime overhead
// - Smaller bundle size
// Limitations:
// - Cannot use reverse mapping
// - Cannot iterate over values
```

### 6. Reverse Mapping

```typescript
enum Status {
  Pending,
  Approved,
  Rejected
}

// Numeric enums have reverse mapping
console.log(Status.Pending);    // 0
console.log(Status[0]);         // "Pending"

// String enums do NOT have reverse mapping
enum Color {
  Red = "RED",
  Green = "GREEN"
}
// Color["RED"] is undefined
```

### 7. Enum as Type

```typescript
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

interface User {
  name: string;
  role: UserRole;
}

const user: User = {
  name: "John",
  role: UserRole.Admin
};

function checkAccess(role: UserRole): boolean {
  return role === UserRole.Admin;
}
```

### 8. Alternatives to Enums

```typescript
// Union of literals (often preferred)
type Direction = "north" | "south" | "east" | "west";

// Object as const
const Direction = {
  North: "NORTH",
  South: "SOUTH",
  East: "EAST",
  West: "WEST"
} as const;

type Direction = typeof Direction[keyof typeof Direction];
// "NORTH" | "SOUTH" | "EAST" | "WEST"

// Benefits over enums:
// - No runtime code generated
// - Works better with tree-shaking
// - More flexible
```

### 9. Enum Iteration

```typescript
enum Color {
  Red,
  Green,
  Blue
}

// Get all keys (includes reverse mappings for numeric)
const keys = Object.keys(Color);
// ["0", "1", "2", "Red", "Green", "Blue"]

// Filter to get only names
const names = Object.keys(Color).filter(k => isNaN(Number(k)));
// ["Red", "Green", "Blue"]

// Get all values
const values = Object.values(Color).filter(v => typeof v === "number");
// [0, 1, 2]

// For string enums (simpler)
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

Object.values(Status);  // ["ACTIVE", "INACTIVE"]
```

---

## 💻 Practice Exercises

1. Create numeric and string enums
2. Use enums for HTTP status codes
3. Implement permission flags with bitwise enums
4. Compare enums vs literal unions
5. Iterate over enum values

---

## ✅ Best Practices

- ✅ Use string enums for readability
- ✅ Use const enums for performance
- ✅ Consider literal unions as alternative
- ✅ Use PascalCase for enum names
- ❌ Avoid heterogeneous enums
- ❌ Don't rely on numeric values

---

## 📝 Quick Reference

```typescript
// Numeric enum
enum Status { Pending, Active, Done }

// String enum
enum Color { Red = "RED", Blue = "BLUE" }

// Const enum (inlined)
const enum Dir { Up, Down }

// Alternative: literal union
type Status = "pending" | "active" | "done";

// Alternative: const object
const Status = {
  Pending: "PENDING",
  Active: "ACTIVE"
} as const;
```

