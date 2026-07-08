/**
 * Lab 083: DOM Modification
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Modify DOM content and structure:
 * 
 * Content:
 * - textContent, innerText, innerHTML
 * 
 * Structure:
 * - createElement, createTextNode
 * - appendChild, insertBefore
 * - removeChild, remove
 * - replaceChild, replaceWith
 * - cloneNode
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Modify element content
 * 2. Create and insert elements
 * 3. Remove and replace elements
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Modifying Text Content
console.log("--- Text Content ---");

/*
<div id="myDiv">Original <span>text</span></div>

const div = document.getElementById("myDiv");

// textContent - all text, ignores HTML
console.log("textContent:", div.textContent); // "Original text"
div.textContent = "New text"; // Replaces everything

// innerText - visible text only (respects CSS)
console.log("innerText:", div.innerText);

// innerHTML - includes HTML tags
console.log("innerHTML:", div.innerHTML); // "Original <span>text</span>"
div.innerHTML = "New <strong>HTML</strong>"; // Parses HTML
*/

// Solution 2: Creating Elements
console.log("\n--- Creating Elements ---");

/*
// Create element
const newDiv = document.createElement("div");
newDiv.id = "newDiv";
newDiv.className = "container";
newDiv.textContent = "Hello World";

// Create text node
const textNode = document.createTextNode("Some text");

// Create from HTML string
const template = document.createElement("template");
template.innerHTML = '<div class="card"><h2>Title</h2></div>';
const cardElement = template.content.firstChild;
*/

// Solution 3: Appending Elements
console.log("\n--- Appending Elements ---");

/*
const parent = document.getElementById("parent");
const child = document.createElement("div");

// appendChild - adds to end
parent.appendChild(child);

// append - can add multiple, including text
parent.append(child1, child2, "text");

// prepend - adds to beginning
parent.prepend(child);

// insertBefore - insert before reference node
parent.insertBefore(newChild, referenceChild);
*/

// Solution 4: Insert Adjacent
console.log("\n--- Insert Adjacent ---");

/*
const element = document.getElementById("target");

// insertAdjacentHTML
element.insertAdjacentHTML("beforebegin", "<p>Before</p>");
element.insertAdjacentHTML("afterbegin", "<p>First child</p>");
element.insertAdjacentHTML("beforeend", "<p>Last child</p>");
element.insertAdjacentHTML("afterend", "<p>After</p>");

// insertAdjacentElement
element.insertAdjacentElement("beforebegin", newElement);

// insertAdjacentText
element.insertAdjacentText("afterend", "Plain text");

// Positions:
// beforebegin: Before the element
// afterbegin: Inside, before first child
// beforeend: Inside, after last child
// afterend: After the element
*/

// Solution 5: Removing Elements
console.log("\n--- Removing Elements ---");

/*
const element = document.getElementById("toRemove");

// Modern way - remove()
element.remove();

// Old way - removeChild()
element.parentNode.removeChild(element);

// Remove all children
while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
}

// Or simply
parent.innerHTML = "";

// Or replaceChildren with nothing
parent.replaceChildren();
*/

// Solution 6: Replacing Elements
console.log("\n--- Replacing Elements ---");

/*
const oldElement = document.getElementById("old");
const newElement = document.createElement("div");
newElement.textContent = "New content";

// Modern way - replaceWith()
oldElement.replaceWith(newElement);

// Old way - replaceChild()
oldElement.parentNode.replaceChild(newElement, oldElement);

// Replace multiple children
parent.replaceChildren(child1, child2, child3);
*/

// Solution 7: Cloning Elements
console.log("\n--- Cloning Elements ---");

/*
const original = document.getElementById("original");

// Shallow clone (element only)
const shallowClone = original.cloneNode(false);

// Deep clone (with all descendants)
const deepClone = original.cloneNode(true);

// Clone and modify
const clone = original.cloneNode(true);
clone.id = "cloned";
document.body.appendChild(clone);
*/

// Solution 8: Document Fragment
console.log("\n--- Document Fragment ---");

/*
// Efficient for adding multiple elements
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const li = document.createElement("li");
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);
}

// Single DOM update
document.getElementById("list").appendChild(fragment);
*/

// Solution 9: Building Complex Structures
console.log("\n--- Complex Structures ---");

/*
function createCard(title, content) {
    const card = document.createElement("div");
    card.className = "card";
    
    const header = document.createElement("h2");
    header.textContent = title;
    
    const body = document.createElement("p");
    body.textContent = content;
    
    card.append(header, body);
    return card;
}

const card = createCard("My Title", "My content");
document.body.appendChild(card);
*/

// Simulated example for Node.js
console.log("\nSimulated DOM Modification:");

class MockElement {
    constructor(tag) {
        this.tagName = tag;
        this.children = [];
        this.textContent = "";
    }
    
    appendChild(child) {
        this.children.push(child);
        return child;
    }
    
    toString() {
        const childStr = this.children.map(c => c.toString()).join("");
        return `<${this.tagName}>${this.textContent}${childStr}</${this.tagName}>`;
    }
}

const div = new MockElement("div");
const p = new MockElement("p");
p.textContent = "Hello World";
div.appendChild(p);
console.log("Created:", div.toString());

