/**
 * Lab 250: Module Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for modules:
 * 
 * - Organization patterns
 * - Import/export guidelines
 * - Avoiding pitfalls
 * - Performance tips
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply module best practices
 * 2. Organize code effectively
 * 3. Avoid common mistakes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: File Organization
console.log("--- File Organization ---");

// One concept per file
// user.service.ts - UserService class
// user.types.ts - User interfaces
// user.utils.ts - User utility functions

// Group by feature, not type
// Good:
// users/
//   user.service.ts
//   user.controller.ts
//   user.types.ts

// Avoid:
// services/
//   user.service.ts
//   product.service.ts
// controllers/
//   user.controller.ts

console.log("Organize by feature, not file type");

// Solution 2: Import Organization
console.log("\n--- Import Organization ---");

// Order imports consistently:
// 1. Node built-ins
// 2. External packages
// 3. Internal aliases (@/)
// 4. Relative imports
// 5. Type imports

// Example:
// import fs from 'fs';
// import path from 'path';
//
// import express from 'express';
// import lodash from 'lodash';
//
// import { config } from '@/config';
// import { logger } from '@/utils';
//
// import { helper } from './helper';
// import { utils } from '../utils';
//
// import type { User } from './types';

console.log("Consistent import ordering");

// Solution 3: Export Guidelines
console.log("\n--- Export Guidelines ---");

// Prefer named exports
export function processData(data: unknown): unknown {
    return data;
}

// Use default for main export
// export default class UserService { }

// Export types separately
export interface DataConfig {
    format: string;
}

// Re-export from index files
// export { UserService } from './user.service';

console.log("Named exports for utilities, default for main");

// Solution 4: Avoiding Circular Dependencies
console.log("\n--- Circular Dependencies ---");

// Problem:
// a.ts imports b.ts
// b.ts imports a.ts

// Solutions:
// 1. Extract shared code to third module
// 2. Use dependency injection
// 3. Restructure module boundaries
// 4. Use type-only imports

// import type { User } from './user'; // Won't cause circular

console.log("Extract shared code to avoid circles");

// Solution 5: Barrel File Guidelines
console.log("\n--- Barrel Files ---");

// Keep barrels shallow
// index.ts should only re-export

// Good:
// export { UserService } from './user.service';
// export type { User } from './user.types';

// Avoid:
// export * from './everything'; // Hurts tree-shaking

// Don't put logic in barrel files

console.log("Shallow barrels, explicit exports");

// Solution 6: Path Aliases
console.log("\n--- Path Aliases ---");

// Configure in tsconfig.json:
// "paths": {
//     "@/*": ["src/*"],
//     "@components/*": ["src/components/*"]
// }

// Benefits:
// - Cleaner imports
// - Easier refactoring
// - No ../../../ chains

// import { Button } from '@components/Button';
// vs
// import { Button } from '../../../components/Button';

console.log("Use path aliases for cleaner imports");

// Solution 7: Side Effects
console.log("\n--- Side Effects ---");

// Avoid side effects in modules
// Bad:
// console.log('Module loaded'); // Runs on import
// setupGlobalState();

// Good:
// export function init() {
//     setupGlobalState();
// }

// Mark side-effect-free in package.json:
// "sideEffects": false
// or
// "sideEffects": ["*.css"]

console.log("Minimize side effects for tree-shaking");

// Solution 8: Type-Only Imports
console.log("\n--- Type-Only Imports ---");

// Use type-only imports when possible
// import type { User } from './types';

// Benefits:
// - Clearer intent
// - Avoids circular dependencies
// - Smaller bundles

// TypeScript 4.5+ verbatimModuleSyntax
// Forces explicit type imports

console.log("Use 'import type' for types");

// Solution 9: Module Boundaries
console.log("\n--- Module Boundaries ---");

// Define clear public APIs
// Internal implementation details stay private

// users/
//   index.ts        <- Public API
//   user.service.ts <- Implementation
//   user.repo.ts    <- Internal
//   user.utils.ts   <- Internal

// Only export what consumers need
// export { UserService } from './user.service';
// Don't export internal utilities

console.log("Clear boundaries with barrel files");

// Solution 10: Summary
console.log("\n--- Best Practices Summary ---");

const practices = [
    "✓ One concept per file",
    "✓ Organize by feature",
    "✓ Consistent import order",
    "✓ Prefer named exports",
    "✓ Use path aliases",
    "✓ Shallow barrel files",
    "✓ Type-only imports",
    "✓ Clear module boundaries",
    "✓ Avoid side effects",
    "✓ Watch for circular deps",
    "✗ Don't export * from large modules",
    "✗ Don't put logic in index.ts",
    "✗ Don't over-nest directories"
];

practices.forEach(p => console.log(p));

// TypeScript is now complete!
console.log("\n=== TypeScript Section Complete! ===");
console.log("Labs 151-250: TypeScript Fundamentals");

