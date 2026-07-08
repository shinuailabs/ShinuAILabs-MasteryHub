/**
 * Lab 248: Namespaces vs Modules
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding namespaces:
 * 
 * - Legacy namespace syntax
 * - When to use namespaces
 * - Modules vs namespaces
 * - Migration strategies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand namespaces
 * 2. Compare with modules
 * 3. Know when to use each
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Namespace
console.log("--- Basic Namespace ---");

namespace MathUtils {
    export const PI = 3.14159;
    
    export function add(a: number, b: number): number {
        return a + b;
    }
    
    export function multiply(a: number, b: number): number {
        return a * b;
    }
    
    // Not exported - private to namespace
    function internalHelper(): void {}
}

console.log("PI:", MathUtils.PI);
console.log("add:", MathUtils.add(2, 3));

// Solution 2: Nested Namespaces
console.log("\n--- Nested Namespaces ---");

namespace App {
    export namespace Utils {
        export function log(msg: string): void {
            console.log(`[App] ${msg}`);
        }
    }
    
    export namespace Models {
        export interface User {
            id: number;
            name: string;
        }
    }
}

App.Utils.log("Hello from nested namespace");

const user: App.Models.User = { id: 1, name: "John" };
console.log("User:", user);

// Solution 3: Namespace Aliases
console.log("\n--- Namespace Aliases ---");

namespace VeryLongNamespaceName {
    export function doSomething(): string {
        return "Done!";
    }
}

// Create alias
import Short = VeryLongNamespaceName;

console.log(Short.doSomething());

// Solution 4: Namespaces vs Modules
console.log("\n--- Namespaces vs Modules ---");

// Namespaces:
// - Single global scope
// - No file boundaries
// - Legacy pattern
// - Good for: global scripts, declaration merging

// Modules:
// - File-based scope
// - Explicit imports/exports
// - Modern standard
// - Good for: applications, libraries

console.log("Prefer modules for new code");

// Solution 5: When to Use Namespaces
console.log("\n--- When to Use Namespaces ---");

const useNamespaces = [
    "1. Global script files (no bundler)",
    "2. Declaration merging",
    "3. Augmenting external types",
    "4. Legacy codebases"
];

const useModules = [
    "1. Modern applications",
    "2. Node.js projects",
    "3. Bundled applications",
    "4. Libraries/packages"
];

console.log("Use namespaces for:");
useNamespaces.forEach(u => console.log(u));

console.log("\nUse modules for:");
useModules.forEach(u => console.log(u));

// Solution 6: Declaration Merging
console.log("\n--- Declaration Merging ---");

// Namespaces can merge with classes
class Album {
    label: Album.AlbumLabel = { name: "Default" };
}

namespace Album {
    export interface AlbumLabel {
        name: string;
    }
}

const album = new Album();
console.log("Album label:", album.label);

// Merge with function
function buildLabel(name: string): buildLabel.Label {
    return { name };
}

namespace buildLabel {
    export interface Label {
        name: string;
    }
}

console.log("Label:", buildLabel("Test"));

// Solution 7: Ambient Namespaces
console.log("\n--- Ambient Namespaces ---");

// In .d.ts files for global libraries
// declare namespace JQuery {
//     interface JQueryStatic {
//         (selector: string): JQuery;
//     }
//     interface JQuery {
//         html(): string;
//         html(content: string): JQuery;
//     }
// }
// declare const $: JQuery.JQueryStatic;

console.log("Ambient namespaces for global libs");

// Solution 8: Migration to Modules
console.log("\n--- Migration to Modules ---");

// Before (namespace):
// namespace Utils {
//     export function helper() { ... }
// }

// After (module):
// utils.ts
// export function helper() { ... }

// Import:
// import { helper } from './utils';

// Steps:
// 1. Convert namespace to module exports
// 2. Add import statements
// 3. Update references
// 4. Configure bundler

console.log("Migrate namespaces to modules");

// Solution 9: Namespace in Modules
console.log("\n--- Namespace in Modules ---");

// Can use namespace inside module
// But usually unnecessary

export namespace Validators {
    export function isEmail(str: string): boolean {
        return str.includes("@");
    }
    
    export function isPhone(str: string): boolean {
        return /^\d{10}$/.test(str);
    }
}

// Better as plain exports:
// export function isEmail(str: string): boolean { ... }
// export function isPhone(str: string): boolean { ... }

console.log("isEmail:", Validators.isEmail("test@example.com"));

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "✓ Use ES modules for new projects",
    "✓ Use namespaces for declaration merging",
    "✓ Use namespaces for global scripts",
    "✓ Migrate legacy namespaces to modules",
    "✗ Don't mix namespaces and modules",
    "✗ Don't use namespaces in bundled apps",
    "✗ Avoid deeply nested namespaces"
];

practices.forEach(p => console.log(p));

