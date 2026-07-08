/**
 * Lab 078: String Formatting
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Formatting strings for display:
 * 
 * - Number formatting
 * - Currency formatting
 * - Date formatting
 * - Padding and alignment
 * - Internationalization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Format numbers and currency
 * 2. Format dates
 * 3. Create aligned output
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Number Formatting
console.log("--- Number Formatting ---");

const num = 1234567.89;

// toLocaleString
console.log("US:", num.toLocaleString("en-US"));
console.log("German:", num.toLocaleString("de-DE"));
console.log("Indian:", num.toLocaleString("en-IN"));

// toFixed
console.log("toFixed(2):", num.toFixed(2));
console.log("toFixed(0):", num.toFixed(0));

// toPrecision
console.log("toPrecision(4):", num.toPrecision(4));

// Solution 2: Currency Formatting
console.log("\n--- Currency ---");

const price = 1234.56;

const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
}).format(price);
console.log("USD:", usd);

const eur = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
}).format(price);
console.log("EUR:", eur);

const jpy = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY"
}).format(price);
console.log("JPY:", jpy);

// Solution 3: Percentage Formatting
console.log("\n--- Percentage ---");

const ratio = 0.8567;

const percent = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1
}).format(ratio);
console.log("Percent:", percent);

// Solution 4: Date Formatting
console.log("\n--- Date Formatting ---");

const date = new Date();

console.log("Default:", date.toLocaleDateString());
console.log("US:", date.toLocaleDateString("en-US"));
console.log("UK:", date.toLocaleDateString("en-GB"));
console.log("ISO:", date.toISOString());

// Custom format
const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};
console.log("Full:", date.toLocaleDateString("en-US", options));

// Solution 5: Time Formatting
console.log("\n--- Time Formatting ---");

console.log("Time:", date.toLocaleTimeString());
console.log("24h:", date.toLocaleTimeString("en-GB"));

const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
};
console.log("Custom:", date.toLocaleTimeString("en-US", timeOptions));

// Solution 6: Relative Time
console.log("\n--- Relative Time ---");

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

console.log("Yesterday:", rtf.format(-1, "day"));
console.log("Tomorrow:", rtf.format(1, "day"));
console.log("Last week:", rtf.format(-1, "week"));
console.log("In 3 months:", rtf.format(3, "month"));

// Solution 7: Padding and Alignment
console.log("\n--- Padding ---");

function formatTable(data) {
    const maxName = Math.max(...data.map(r => r.name.length));
    const maxPrice = Math.max(...data.map(r => r.price.toFixed(2).length));
    
    return data.map(row => {
        const name = row.name.padEnd(maxName);
        const price = row.price.toFixed(2).padStart(maxPrice);
        return `${name} | $${price}`;
    }).join("\n");
}

const products = [
    { name: "Apple", price: 1.5 },
    { name: "Banana", price: 0.75 },
    { name: "Orange Juice", price: 3.99 }
];

console.log(formatTable(products));

// Solution 8: Pluralization
console.log("\n--- Pluralization ---");

function pluralize(count, singular, plural = singular + "s") {
    return `${count} ${count === 1 ? singular : plural}`;
}

console.log(pluralize(1, "item"));
console.log(pluralize(5, "item"));
console.log(pluralize(1, "child", "children"));
console.log(pluralize(3, "child", "children"));

// Solution 9: File Size Formatting
console.log("\n--- File Size ---");

function formatFileSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;
    let size = bytes;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

console.log("1024:", formatFileSize(1024));
console.log("1048576:", formatFileSize(1048576));
console.log("1073741824:", formatFileSize(1073741824));

// Solution 10: Duration Formatting
console.log("\n--- Duration ---");

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(" ");
}

console.log("3661:", formatDuration(3661));
console.log("125:", formatDuration(125));
console.log("45:", formatDuration(45));

// Solution 11: Phone Number Formatting
console.log("\n--- Phone Formatting ---");

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

console.log("1234567890:", formatPhone("1234567890"));
console.log("123-456-7890:", formatPhone("123-456-7890"));

