# Part 10: Modules

## 📚 Overview
TypeScript modules help organize code into separate files with explicit imports and exports.

---

## 🎯 Key Concepts

### 1. Named Exports

```typescript
// math.ts
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export interface MathResult {
  value: number;
  operation: string;
}

export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}
```

### 2. Named Imports

```typescript
// Import specific exports
import { PI, add, multiply } from "./math";

console.log(PI);
console.log(add(2, 3));

// Rename imports
import { add as sum, multiply as mult } from "./math";

console.log(sum(2, 3));

// Import types
import { MathResult } from "./math";
import type { MathResult } from "./math";  // Type-only import
```

### 3. Default Exports

```typescript
// user.ts
export default class User {
  constructor(public name: string) {}
}

// Alternative syntax
class User {
  constructor(public name: string) {}
}
export default User;

// Import default
import User from "./user";
const user = new User("John");

// Import default with named
import User, { UserRole } from "./user";
```

### 4. Re-exports

```typescript
// index.ts - barrel file
export { add, multiply } from "./math";
export { User } from "./user";
export { default as Config } from "./config";

// Re-export all
export * from "./math";

// Re-export with rename
export { add as sum } from "./math";

// Usage
import { add, User, Config } from "./index";
```

### 5. Namespace Imports

```typescript
// Import all as namespace
import * as math from "./math";

console.log(math.PI);
console.log(math.add(2, 3));

// Useful for modules with many exports
import * as utils from "./utils";
utils.formatDate(new Date());
utils.parseJSON("{}");
```

### 6. Dynamic Imports

```typescript
// Dynamic import returns Promise
async function loadModule() {
  const math = await import("./math");
  console.log(math.add(2, 3));
}

// Conditional loading
async function loadFeature(feature: string) {
  if (feature === "charts") {
    const { Chart } = await import("./charts");
    return new Chart();
  }
}

// With type assertion
const module = await import("./math") as typeof import("./math");
```

### 7. Module Resolution

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",  // or "bundler"
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@utils/*": ["utils/*"]
    }
  }
}

// Usage with path aliases
import { formatDate } from "@/utils/date";
import { User } from "@utils/user";

// Relative imports
import { helper } from "./helper";
import { config } from "../config";
```

### 8. Declaration Files

```typescript
// types.d.ts - Type declarations
declare module "my-library" {
  export function doSomething(): void;
  export const version: string;
}

// Global declarations
declare global {
  interface Window {
    myApp: {
      version: string;
    };
  }
}

// Ambient modules
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}
```

### 9. Module Patterns

```typescript
// Barrel pattern (index.ts)
// src/components/index.ts
export { Button } from "./Button";
export { Input } from "./Input";
export { Modal } from "./Modal";

// Usage
import { Button, Input, Modal } from "./components";

// Feature module pattern
// src/features/auth/index.ts
export { AuthProvider } from "./AuthProvider";
export { useAuth } from "./useAuth";
export type { AuthState, User } from "./types";

// Lazy loading pattern
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

// Service pattern
// src/services/api.ts
class ApiService {
  private static instance: ApiService;
  
  static getInstance(): ApiService {
    if (!this.instance) {
      this.instance = new ApiService();
    }
    return this.instance;
  }
}

export default ApiService.getInstance();
```

---

## 💻 Practice Exercises

1. Create modules with named exports
2. Use barrel files for organization
3. Implement dynamic imports
4. Configure path aliases
5. Create declaration files

---

## ✅ Best Practices

- ✅ Use named exports for most cases
- ✅ Use barrel files for clean imports
- ✅ Use path aliases for deep imports
- ✅ Use type-only imports when possible
- ❌ Avoid circular dependencies
- ❌ Don't mix default and named exports

---

## 📝 Quick Reference

```typescript
// Named export
export const x = 1;
export function fn() {}

// Named import
import { x, fn } from "./module";

// Default export
export default class X {}

// Default import
import X from "./module";

// Namespace import
import * as mod from "./module";

// Re-export
export { x } from "./module";
export * from "./module";

// Dynamic import
const mod = await import("./module");
```

