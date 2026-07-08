/**
 * Lab 245: Module Resolution
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * How TypeScript resolves modules:
 * 
 * - Resolution strategies
 * - Path mapping
 * - baseUrl configuration
 * - Node vs Classic
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand resolution
 * 2. Configure paths
 * 3. Use baseUrl
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Relative vs Non-Relative
console.log("--- Relative vs Non-Relative ---");

// Relative imports (start with ., .., /)
// import { x } from './module';
// import { y } from '../utils/helper';
// import { z } from '/absolute/path';

// Non-relative imports
// import { a } from 'lodash';
// import { b } from '@company/shared';
// import { c } from 'src/utils';

console.log("Relative: ./module, ../utils");
console.log("Non-relative: lodash, @company/shared");

// Solution 2: Node Resolution Strategy
console.log("\n--- Node Resolution ---");

// For: import { x } from './module'
// TypeScript looks for:
// 1. ./module.ts
// 2. ./module.tsx
// 3. ./module.d.ts
// 4. ./module/package.json (types field)
// 5. ./module/index.ts
// 6. ./module/index.tsx
// 7. ./module/index.d.ts

// For: import { x } from 'module'
// TypeScript looks in node_modules:
// 1. node_modules/module.ts
// 2. node_modules/module/package.json
// 3. node_modules/module/index.ts
// 4. node_modules/@types/module

console.log("Node resolution checks multiple locations");

// Solution 3: Classic Resolution Strategy
console.log("\n--- Classic Resolution ---");

// Older strategy, rarely used
// For: import { x } from './module'
// 1. ./module.ts
// 2. ./module.d.ts

// For: import { x } from 'module'
// Walks up directory tree looking for module.ts

console.log("Classic resolution is simpler but limited");

// Solution 4: baseUrl Configuration
console.log("\n--- baseUrl ---");

// tsconfig.json:
// {
//   "compilerOptions": {
//     "baseUrl": "./src"
//   }
// }

// Now imports resolve from src/
// import { utils } from 'utils';  // src/utils
// import { api } from 'services/api';  // src/services/api

console.log("baseUrl sets root for non-relative imports");

// Solution 5: Path Mapping
console.log("\n--- Path Mapping ---");

// tsconfig.json:
// {
//   "compilerOptions": {
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["src/*"],
//       "@components/*": ["src/components/*"],
//       "@utils/*": ["src/utils/*"],
//       "@services/*": ["src/services/*"]
//     }
//   }
// }

// Usage:
// import { Button } from '@components/Button';
// import { formatDate } from '@utils/date';
// import { api } from '@services/api';

console.log("Path mapping creates aliases");

// Solution 6: Wildcard Patterns
console.log("\n--- Wildcard Patterns ---");

// Single asterisk matches any string
// "paths": {
//   "*": ["node_modules/*", "src/types/*"]
// }

// Multiple mappings for fallback
// "paths": {
//   "utils": ["src/utils/index", "shared/utils/index"]
// }

console.log("Wildcards provide flexible matching");

// Solution 7: rootDirs
console.log("\n--- rootDirs ---");

// Merge multiple directories
// tsconfig.json:
// {
//   "compilerOptions": {
//     "rootDirs": ["src", "generated"]
//   }
// }

// Files in both directories appear in same root
// Useful for generated code

console.log("rootDirs merges virtual directories");

// Solution 8: Module Resolution Debugging
console.log("\n--- Debugging Resolution ---");

// Use traceResolution to debug
// tsc --traceResolution

// Output shows:
// - What TypeScript is looking for
// - Where it's looking
// - What it found or didn't find

// Also useful:
// tsc --listFiles  // List all files in compilation

console.log("Use --traceResolution to debug");

// Solution 9: Common Configurations
console.log("\n--- Common Configs ---");

// React/Vite project:
const reactConfig = {
    compilerOptions: {
        baseUrl: ".",
        paths: {
            "@/*": ["src/*"]
        }
    }
};

// Node.js project:
const nodeConfig = {
    compilerOptions: {
        moduleResolution: "node",
        baseUrl: "./src",
        paths: {
            "@utils/*": ["utils/*"],
            "@models/*": ["models/*"]
        }
    }
};

// Monorepo:
const monorepoConfig = {
    compilerOptions: {
        baseUrl: ".",
        paths: {
            "@shared/*": ["packages/shared/src/*"],
            "@api/*": ["packages/api/src/*"]
        }
    }
};

console.log("React config:", JSON.stringify(reactConfig.compilerOptions.paths));

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "✓ Use path aliases for cleaner imports",
    "✓ Set baseUrl to project root or src",
    "✓ Use @ prefix for path aliases",
    "✓ Keep paths consistent across tools",
    "✓ Configure bundler to match paths",
    "✓ Use moduleResolution: 'node'",
    "✗ Avoid deeply nested relative imports",
    "✗ Don't mix resolution strategies"
];

practices.forEach(p => console.log(p));

// Note: Path aliases need bundler config too
// Vite: vite.config.ts resolve.alias
// Webpack: webpack.config.js resolve.alias
// Jest: moduleNameMapper

