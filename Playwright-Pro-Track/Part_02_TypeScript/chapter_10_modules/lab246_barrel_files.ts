/**
 * Lab 246: Barrel Files (Index Exports)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Barrel files for module organization:
 * 
 * - Re-exporting modules
 * - Public API definition
 * - Import simplification
 * - Trade-offs
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create barrel files
 * 2. Organize exports
 * 3. Understand trade-offs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Barrel File
console.log("--- Basic Barrel File ---");

// components/Button.ts
class Button {
    render(): string { return "<button>Click</button>"; }
}

// components/Input.ts
class Input {
    render(): string { return "<input />"; }
}

// components/Select.ts
class Select {
    render(): string { return "<select></select>"; }
}

// components/index.ts (barrel file)
// export { Button } from './Button';
// export { Input } from './Input';
// export { Select } from './Select';

// Now import from single location:
// import { Button, Input, Select } from './components';

console.log("Barrel exports multiple modules");

// Solution 2: Re-export Patterns
console.log("\n--- Re-export Patterns ---");

// Named re-export
// export { UserService } from './UserService';

// Rename on re-export
// export { UserService as UserAPI } from './UserService';

// Re-export all
// export * from './utils';

// Re-export default as named
// export { default as Logger } from './Logger';

// Re-export types
// export type { User, UserDTO } from './types';

console.log("Various re-export patterns available");

// Solution 3: Organizing by Feature
console.log("\n--- Feature Organization ---");

// users/
//   ├── user.service.ts
//   ├── user.controller.ts
//   ├── user.types.ts
//   └── index.ts

// users/index.ts
// export { UserService } from './user.service';
// export { UserController } from './user.controller';
// export type { User, CreateUserDTO } from './user.types';

// Import from feature:
// import { UserService, User } from './users';

console.log("Feature-based barrel organization");

// Solution 4: Nested Barrels
console.log("\n--- Nested Barrels ---");

// src/
//   ├── components/
//   │   ├── Button/index.ts
//   │   ├── Input/index.ts
//   │   └── index.ts
//   ├── services/
//   │   ├── api.ts
//   │   └── index.ts
//   └── index.ts

// src/index.ts (root barrel)
// export * from './components';
// export * from './services';

// Import from root:
// import { Button, ApiService } from './src';

console.log("Nested barrels for large projects");

// Solution 5: Selective Exports
console.log("\n--- Selective Exports ---");

// Don't export everything - define public API

// utils/internal.ts (not exported)
function internalHelper(): void {}

// utils/public.ts
function publicUtil(): string { return "public"; }

// utils/index.ts
// export { publicUtil } from './public';
// Don't export internalHelper

console.log("Barrel defines public API");

// Solution 6: Type-Only Re-exports
console.log("\n--- Type-Only Re-exports ---");

// types/user.ts
interface User {
    id: number;
    name: string;
}

// types/index.ts
// export type { User } from './user';
// export type { Product } from './product';

// Ensures types are erased in output
// Prevents accidental runtime imports

console.log("Type-only exports for interfaces");

// Solution 7: Barrel File Trade-offs
console.log("\n--- Trade-offs ---");

const pros = [
    "✓ Cleaner imports",
    "✓ Encapsulation of internals",
    "✓ Easy refactoring",
    "✓ Clear public API"
];

const cons = [
    "✗ Can hurt tree-shaking",
    "✗ Circular dependency risk",
    "✗ Slower compilation",
    "✗ IDE auto-import issues"
];

console.log("Pros:");
pros.forEach(p => console.log(p));

console.log("\nCons:");
cons.forEach(c => console.log(c));

// Solution 8: Tree-Shaking Considerations
console.log("\n--- Tree-Shaking ---");

// Bad for tree-shaking:
// export * from './huge-module';

// Better - explicit exports:
// export { specificFunction } from './huge-module';

// Best - direct imports when needed:
// import { specificFunction } from './huge-module/specificFunction';

// Use sideEffects: false in package.json
// to help bundlers tree-shake

console.log("Be mindful of bundle size");

// Solution 9: Avoiding Circular Dependencies
console.log("\n--- Circular Dependencies ---");

// Problem:
// a.ts imports from index.ts
// index.ts exports from a.ts
// = Circular!

// Solution 1: Import directly
// import { x } from './specific-file';

// Solution 2: Separate types
// types/index.ts for interfaces
// impl/index.ts for implementations

// Solution 3: Dependency injection
// Pass dependencies instead of importing

console.log("Avoid circular imports with barrels");

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "1. One barrel per feature/module",
    "2. Export only public API",
    "3. Use type-only exports for types",
    "4. Avoid export * for large modules",
    "5. Watch for circular dependencies",
    "6. Consider tree-shaking impact",
    "7. Keep barrels shallow (1-2 levels)",
    "8. Document exported API"
];

practices.forEach(p => console.log(p));

// Example well-organized barrel:
// export { UserService } from './user.service';
// export { UserController } from './user.controller';
// export type { User, CreateUserDTO, UpdateUserDTO } from './user.types';
// export { USER_ROLES } from './user.constants';

