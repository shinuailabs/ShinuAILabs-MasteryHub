/**
 * Lab 088: DOM Templates
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Create reusable HTML templates:
 * 
 * Methods:
 * - Template literals
 * - <template> element
 * - DocumentFragment
 * - innerHTML
 * - cloneNode
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create templates
 * 2. Clone and populate templates
 * 3. Build dynamic content
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Template Literals
console.log("--- Template Literals ---");

function createCardHTML(data) {
    return `
        <div class="card" data-id="${data.id}">
            <h2 class="card-title">${escapeHtml(data.title)}</h2>
            <p class="card-body">${escapeHtml(data.body)}</p>
            <button class="card-btn">Read More</button>
        </div>
    `;
}

function escapeHtml(str) {
    const div = { textContent: str };
    return div.textContent;
}

// Usage
/*
const cardData = { id: 1, title: "Hello", body: "World" };
container.innerHTML = createCardHTML(cardData);
*/

// Solution 2: Template Element
console.log("\n--- Template Element ---");

/*
<template id="cardTemplate">
    <div class="card">
        <h2 class="card-title"></h2>
        <p class="card-body"></p>
        <button class="card-btn">Read More</button>
    </div>
</template>

function createCardFromTemplate(data) {
    const template = document.getElementById("cardTemplate");
    const clone = template.content.cloneNode(true);
    
    clone.querySelector(".card").dataset.id = data.id;
    clone.querySelector(".card-title").textContent = data.title;
    clone.querySelector(".card-body").textContent = data.body;
    
    return clone;
}

// Usage
const card = createCardFromTemplate({ id: 1, title: "Hello", body: "World" });
document.getElementById("container").appendChild(card);
*/

// Solution 3: Document Fragment
console.log("\n--- Document Fragment ---");

/*
function createList(items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        fragment.appendChild(li);
    });
    
    return fragment;
}

// Usage - single DOM update
const list = document.getElementById("list");
list.appendChild(createList(["Item 1", "Item 2", "Item 3"]));
*/

// Solution 4: Factory Function
console.log("\n--- Factory Function ---");

function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        if (key === "className") {
            element.className = value;
        } else if (key === "style" && typeof value === "object") {
            Object.assign(element.style, value);
        } else if (key.startsWith("on")) {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === "dataset") {
            Object.assign(element.dataset, value);
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Add children
    children.forEach(child => {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Usage (simulated)
console.log("Factory function defined");

// Solution 5: Component Pattern
console.log("\n--- Component Pattern ---");

class CardComponent {
    constructor(data) {
        this.data = data;
        this.element = null;
    }
    
    render() {
        this.element = document.createElement("div");
        this.element.className = "card";
        this.element.innerHTML = `
            <h2>${this.data.title}</h2>
            <p>${this.data.body}</p>
        `;
        this.attachEvents();
        return this.element;
    }
    
    attachEvents() {
        this.element.addEventListener("click", () => {
            console.log("Card clicked:", this.data.id);
        });
    }
    
    update(newData) {
        this.data = { ...this.data, ...newData };
        this.element.querySelector("h2").textContent = this.data.title;
        this.element.querySelector("p").textContent = this.data.body;
    }
    
    destroy() {
        this.element.remove();
    }
}

// Solution 6: List Rendering
console.log("\n--- List Rendering ---");

function renderList(container, items, renderItem) {
    // Clear existing
    container.innerHTML = "";
    
    // Create fragment for efficiency
    const fragment = document.createDocumentFragment();
    
    items.forEach((item, index) => {
        const element = renderItem(item, index);
        fragment.appendChild(element);
    });
    
    container.appendChild(fragment);
}

// Usage
/*
renderList(
    document.getElementById("userList"),
    users,
    (user) => {
        const li = document.createElement("li");
        li.textContent = user.name;
        return li;
    }
);
*/

// Solution 7: Conditional Rendering
console.log("\n--- Conditional Rendering ---");

function renderConditional(condition, trueContent, falseContent = "") {
    return condition ? trueContent : falseContent;
}

function createUserCard(user) {
    return `
        <div class="user-card">
            <h3>${user.name}</h3>
            ${renderConditional(user.isAdmin, '<span class="badge">Admin</span>')}
            ${renderConditional(user.email, `<p>Email: ${user.email}</p>`, '<p>No email</p>')}
        </div>
    `;
}

// Simulated example for Node.js
console.log("\nSimulated Template:");

const templateData = [
    { id: 1, title: "First Post", body: "Content 1" },
    { id: 2, title: "Second Post", body: "Content 2" }
];

const renderedCards = templateData.map(data => ({
    html: `<div class="card" data-id="${data.id}">
        <h2>${data.title}</h2>
        <p>${data.body}</p>
    </div>`
}));

console.log("Rendered cards:", renderedCards.length);

