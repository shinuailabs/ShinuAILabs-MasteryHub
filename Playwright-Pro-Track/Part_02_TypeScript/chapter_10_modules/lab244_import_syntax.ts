/**
 * Lab 244: Import Syntax
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Various import syntaxes:
 * 
 * - Named imports
 * - Default imports
 * - Namespace imports
 * - Side-effect imports
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use different import types
 * 2. Rename imports
 * 3. Combine import styles
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Named Imports
console.log("--- Named Imports ---");

// Import specific exports
// import { add, subtract } from './math';

// Import with rename
// import { add as sum, subtract as minus } from './math';

// Import multiple
// import { PI, E, add, subtract, multiply } from './math';

// Simulating
const mathModule = {
    PI: 3.14159,
    E: 2.71828,
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b
};

const { PI, add } = mathModule;
console.log("PI:", PI);
console.log("add(2, 3):", add(2, 3));

// Solution 2: Default Imports
console.log("\n--- Default Imports ---");

// Import default export
// import Logger from './Logger';

// Import with any name
// import MyLogger from './Logger';

// Import default and named
// import Logger, { LogLevel, LogConfig } from './Logger';

class Logger {
    log(msg: string): void {
        console.log(`[LOG] ${msg}`);
    }
}

const logger = new Logger();
logger.log("Default import example");

// Solution 3: Namespace Imports
console.log("\n--- Namespace Imports ---");

// Import all as namespace
// import * as Math from './math';
// Math.add(1, 2);
// Math.PI;

// Useful for modules with many exports
// import * as Utils from './utils';

const MathUtils = {
    PI: 3.14159,
    add: (a: number, b: number) => a + b,
    multiply: (a: number, b: number) => a * b
};

console.log("MathUtils.PI:", MathUtils.PI);
console.log("MathUtils.add:", MathUtils.add(2, 3));

// Solution 4: Side-Effect Imports
console.log("\n--- Side-Effect Imports ---");

// Import for side effects only
// import './polyfills';
// import './styles.css';

// No bindings, just executes module
// Useful for:
// - Polyfills
// - CSS imports
// - Global setup

console.log("Side-effect imports execute module code");

// Solution 5: Type-Only Imports
console.log("\n--- Type-Only Imports ---");

// Import types only (TypeScript 3.8+)
// import type { User, Config } from './types';

// These are erased in JavaScript output
// Useful for:
// - Avoiding circular dependencies
// - Explicit type imports
// - Smaller bundles

interface User {
    id: number;
    name: string;
}

// import type { User } from './types';
const user: User = { id: 1, name: "John" };
console.log("User:", user);

// Solution 6: Dynamic Imports
console.log("\n--- Dynamic Imports ---");

// Lazy loading with import()
// const module = await import('./heavy-module');

// Conditional loading
// if (needFeature) {
//     const { feature } = await import('./feature');
//     feature();
// }

async function loadModule(): Promise<void> {
    // const { default: Logger } = await import('./Logger');
    console.log("Dynamic import would load here");
}

loadModule();

// Solution 7: Import Assertions
console.log("\n--- Import Assertions ---");

// Import JSON (requires resolveJsonModule)
// import data from './data.json';

// Import with assertion (newer syntax)
// import data from './data.json' assert { type: 'json' };

// Import CSS modules
// import styles from './styles.module.css';

console.log("Import assertions for special file types");

// Solution 8: Combining Import Styles
console.log("\n--- Combining Styles ---");

// Default + named
// import React, { useState, useEffect } from 'react';

// Default + namespace
// import React, * as ReactDOM from 'react-dom';

// Rename default
// import { default as MyComponent } from './Component';

// Multiple sources
// import { a } from './a';
// import { b } from './b';
// import { c } from './c';

console.log("Various combinations possible");

// Solution 9: Import Organization
console.log("\n--- Import Organization ---");

// Recommended order:
// 1. Node built-ins
// import fs from 'fs';
// import path from 'path';

// 2. External packages
// import express from 'express';
// import lodash from 'lodash';

// 3. Internal modules
// import { config } from '@/config';
// import { utils } from '@/utils';

// 4. Relative imports
// import { helper } from './helper';
// import { Component } from '../components';

// 5. Type imports
// import type { User } from './types';

console.log("Import organization best practices");

// Solution 10: Common Patterns
console.log("\n--- Common Patterns ---");

// React component
// import React, { FC, useState } from 'react';

// Node.js
// import express, { Request, Response } from 'express';

// Utility library
// import { map, filter, reduce } from 'lodash';

// Testing
// import { describe, it, expect } from 'vitest';

// Path aliases
// import { Button } from '@components/Button';
// import { useAuth } from '@hooks/useAuth';

const patterns = [
    "React: import React, { hooks } from 'react'",
    "Express: import express, { types } from 'express'",
    "Lodash: import { specific, functions } from 'lodash'",
    "Testing: import { describe, it } from 'vitest'"
];

patterns.forEach(p => console.log(p));

