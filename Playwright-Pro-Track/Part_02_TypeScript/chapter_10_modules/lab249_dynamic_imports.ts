/**
 * Lab 249: Dynamic Imports
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Dynamic import() for lazy loading:
 *
 * - import() syntax
 * - Code splitting
 * - Conditional loading
 * - Error handling
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use dynamic imports
 * 2. Implement lazy loading
 * 3. Handle import errors
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Dynamic Import
console.log("--- Basic Dynamic Import ---");

// Static import (loaded immediately)
// import { heavy } from './heavy-module';

// Dynamic import (loaded on demand)
async function loadModule(): Promise<void> {
    // const module = await import('./heavy-module');
    // module.heavy();
    console.log("Module would be loaded dynamically");
}

loadModule();

// Solution 2: Conditional Loading
console.log("\n--- Conditional Loading ---");

async function loadFeature(featureName: string): Promise<void> {
    if (featureName === "charts") {
        // const { ChartLibrary } = await import('./charts');
        console.log("Charts module loaded");
    } else if (featureName === "maps") {
        // const { MapLibrary } = await import('./maps');
        console.log("Maps module loaded");
    }
}

loadFeature("charts");

// Solution 3: Code Splitting
console.log("\n--- Code Splitting ---");

// Bundlers (Webpack, Vite) create separate chunks
// for dynamic imports

// Routes example
const routes = {
    "/home": () => import("./pages/home" as any).catch(() => ({ default: {} })),
    "/about": () => import("./pages/about" as any).catch(() => ({ default: {} })),
    "/contact": () => import("./pages/contact" as any).catch(() => ({ default: {} }))
};

async function loadRoute(path: string): Promise<void> {
    const loader = routes[path as keyof typeof routes];
    if (loader) {
        // const module = await loader();
        // render(module.default);
        console.log(`Route ${path} would be loaded`);
    }
}

loadRoute("/home");

// Solution 4: Type-Safe Dynamic Imports
console.log("\n--- Type-Safe Imports ---");

// Define expected module shape
interface MathModule {
    add: (a: number, b: number) => number;
    subtract: (a: number, b: number) => number;
}

async function loadMath(): Promise<MathModule> {
    // const module = await import('./math') as MathModule;
    // return module;

    // Simulated
    return {
        add: (a, b) => a + b,
        subtract: (a, b) => a - b
    };
}

loadMath().then(math => {
    console.log("add(2, 3):", math.add(2, 3));
});

// Solution 5: Error Handling
console.log("\n--- Error Handling ---");

async function safeImport<T>(modulePath: string): Promise<T | null> {
    try {
        // const module = await import(modulePath);
        // return module as T;
        console.log(`Would import: ${modulePath}`);
        return null;
    } catch (error) {
        console.error(`Failed to load module: ${modulePath}`, error);
        return null;
    }
}

safeImport("./optional-module");

// Solution 6: Loading Indicators
console.log("\n--- Loading Indicators ---");

async function loadWithIndicator(): Promise<void> {
    console.log("Loading...");

    try {
        // Simulate async load
        await new Promise(resolve => setTimeout(resolve, 100));
        // const module = await import('./heavy-module');
        console.log("Loaded!");
    } catch (error) {
        console.log("Failed to load");
    }
}

loadWithIndicator();

// Solution 7: Preloading Modules
console.log("\n--- Preloading ---");

// Preload on hover/focus for faster navigation
function preloadModule(modulePath: string): void {
    // import(modulePath); // Starts loading but doesn't await
    console.log(`Preloading: ${modulePath}`);
}

// Usage: onMouseEnter={() => preloadModule('./heavy-page')}

preloadModule("./next-page");

// Solution 8: Dynamic Import with Variables
console.log("\n--- Variable Paths ---");

// Note: Bundlers need hints for variable paths
async function loadLocale(locale: string): Promise<object> {
    // Webpack magic comment for chunk naming
    // const messages = await import(
    //     /* webpackChunkName: "locale-[request]" */
    //     `./locales/${locale}.json`
    // );

    console.log(`Loading locale: ${locale}`);
    return { greeting: "Hello" };
}

loadLocale("en");

// Solution 9: React Lazy Loading
console.log("\n--- React Pattern ---");

// React.lazy for component lazy loading
// const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Usage in JSX:
// <Suspense fallback={<Loading />}>
//     <LazyComponent />
// </Suspense>

console.log("React.lazy for component splitting");

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "✓ Use for large/optional features",
    "✓ Split routes into chunks",
    "✓ Add loading indicators",
    "✓ Handle import errors",
    "✓ Preload on user intent",
    "✓ Use magic comments for chunk names",
    "✗ Don't overuse (adds complexity)",
    "✗ Don't dynamic import small modules"
];

practices.forEach(p => console.log(p));

// Example: Feature flag based loading
async function loadFeatureIfEnabled(
    featureFlag: boolean
): Promise<void> {
    if (featureFlag) {
        // const { Feature } = await import('./experimental-feature');
        // Feature.init();
        console.log("Experimental feature loaded");
    }
}

loadFeatureIfEnabled(true);
