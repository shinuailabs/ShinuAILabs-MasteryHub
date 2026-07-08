/**
 * Lab 079: Unicode and Encoding
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript strings are UTF-16 encoded.
 * 
 * Key concepts:
 * - Code points vs code units
 * - Surrogate pairs for emoji
 * - String normalization
 * - Encoding/decoding
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Work with Unicode characters
 * 2. Handle emoji correctly
 * 3. Encode/decode strings
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Unicode Characters
console.log("--- Unicode Characters ---");

// Unicode escape
console.log("\\u0041:", "\u0041"); // A
console.log("\\u00E9:", "\u00E9"); // é

// Code point escape (ES6)
console.log("\\u{1F600}:", "\u{1F600}"); // 😀

// Named characters
console.log("Symbols: © ® ™ € £ ¥");

// Solution 2: Code Points
console.log("\n--- Code Points ---");

const str = "A😀B";

// charCodeAt returns UTF-16 code unit
console.log("charCodeAt(0):", str.charCodeAt(0)); // 65 (A)
console.log("charCodeAt(1):", str.charCodeAt(1)); // 55357 (high surrogate)
console.log("charCodeAt(2):", str.charCodeAt(2)); // 56832 (low surrogate)

// codePointAt returns full code point
console.log("codePointAt(0):", str.codePointAt(0)); // 65 (A)
console.log("codePointAt(1):", str.codePointAt(1)); // 128512 (😀)

// Solution 3: String Length Issues
console.log("\n--- Length Issues ---");

const emoji = "😀";
console.log("Emoji:", emoji);
console.log("length:", emoji.length); // 2 (surrogate pair!)

const text = "Hello 👋 World";
console.log("Text:", text);
console.log("length:", text.length); // 14 (not 13!)

// Correct character count
const charCount = [...text].length;
console.log("Actual chars:", charCount); // 13

// Solution 4: Iterating Unicode
console.log("\n--- Iterating ---");

const withEmoji = "Hi👋";

// Wrong: for loop with index
console.log("Wrong iteration:");
for (let i = 0; i < withEmoji.length; i++) {
    console.log(`  ${i}: ${withEmoji[i]}`);
}

// Correct: for...of
console.log("Correct iteration:");
for (const char of withEmoji) {
    console.log(`  ${char}`);
}

// Solution 5: String from Code Points
console.log("\n--- From Code Points ---");

// fromCharCode (UTF-16)
console.log("fromCharCode(65):", String.fromCharCode(65));

// fromCodePoint (full Unicode)
console.log("fromCodePoint(128512):", String.fromCodePoint(128512));
console.log("fromCodePoint(65, 66, 67):", String.fromCodePoint(65, 66, 67));

// Solution 6: Normalization
console.log("\n--- Normalization ---");

// Same character, different representations
const e1 = "é";           // Single code point
const e2 = "e\u0301";     // e + combining accent

console.log("e1:", e1, "length:", e1.length);
console.log("e2:", e2, "length:", e2.length);
console.log("e1 === e2:", e1 === e2); // false!

// Normalize for comparison
console.log("Normalized equal:", e1.normalize() === e2.normalize());

// Solution 7: Base64 Encoding
console.log("\n--- Base64 ---");

// Encode
const original = "Hello World";
const encoded = btoa(original);
console.log("Encoded:", encoded);

// Decode
const decoded = atob(encoded);
console.log("Decoded:", decoded);

// For Unicode strings
function encodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16))));
}

function decodeUnicode(str) {
    return decodeURIComponent(atob(str).split("").map(c =>
        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
}

const unicodeStr = "Hello 世界 👋";
const unicodeEncoded = encodeUnicode(unicodeStr);
console.log("Unicode encoded:", unicodeEncoded);
console.log("Unicode decoded:", decodeUnicode(unicodeEncoded));

// Solution 8: URL Encoding
console.log("\n--- URL Encoding ---");

const url = "https://example.com/search?q=hello world&lang=日本語";

// encodeURIComponent (for query params)
console.log("encodeURIComponent:", encodeURIComponent("hello world"));

// encodeURI (for full URLs)
console.log("encodeURI:", encodeURI(url));

// Decode
console.log("decodeURI:", decodeURI(encodeURI(url)));

// Solution 9: Emoji Handling
console.log("\n--- Emoji Handling ---");

function getEmojis(str) {
    return [...str].filter(char => {
        const codePoint = char.codePointAt(0);
        return codePoint > 0x1F000;
    });
}

const message = "Hello 👋 World 🌍 !";
console.log("Emojis:", getEmojis(message));

// Count emojis
const emojiRegex = /\p{Emoji}/gu;
const emojiCount = (message.match(emojiRegex) || []).length;
console.log("Emoji count:", emojiCount);

// Solution 10: Text Encoder/Decoder
console.log("\n--- TextEncoder/Decoder ---");

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytes = encoder.encode("Hello");
console.log("Encoded bytes:", bytes);

const text2 = decoder.decode(bytes);
console.log("Decoded text:", text2);

