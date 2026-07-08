/**
 * Lab 082: DOM Traversal
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Navigate the DOM tree using node relationships:
 * 
 * Parent:
 * - parentNode, parentElement
 * 
 * Children:
 * - childNodes, children
 * - firstChild, firstElementChild
 * - lastChild, lastElementChild
 * 
 * Siblings:
 * - nextSibling, nextElementSibling
 * - previousSibling, previousElementSibling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Navigate parent/child relationships
 * 2. Traverse siblings
 * 3. Understand Node vs Element
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Parent Navigation
console.log("--- Parent Navigation ---");

/*
<div id="grandparent">
    <div id="parent">
        <div id="child">Content</div>
    </div>
</div>

const child = document.getElementById("child");

// parentNode - any node type
console.log("parentNode:", child.parentNode);

// parentElement - only element nodes
console.log("parentElement:", child.parentElement);

// Chain to go up multiple levels
console.log("Grandparent:", child.parentElement.parentElement);
*/

// Solution 2: Children Navigation
console.log("\n--- Children Navigation ---");

/*
<ul id="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

const list = document.getElementById("list");

// childNodes - includes text nodes (whitespace)
console.log("childNodes:", list.childNodes.length);

// children - only element nodes
console.log("children:", list.children.length);

// First and last
console.log("firstChild:", list.firstChild);           // Text node (whitespace)
console.log("firstElementChild:", list.firstElementChild); // <li>Item 1</li>
console.log("lastElementChild:", list.lastElementChild);   // <li>Item 3</li>
*/

// Solution 3: Sibling Navigation
console.log("\n--- Sibling Navigation ---");

/*
<ul>
    <li id="first">First</li>
    <li id="second">Second</li>
    <li id="third">Third</li>
</ul>

const second = document.getElementById("second");

// Next sibling
console.log("nextSibling:", second.nextSibling);           // Text node
console.log("nextElementSibling:", second.nextElementSibling); // <li>Third</li>

// Previous sibling
console.log("previousElementSibling:", second.previousElementSibling); // <li>First</li>
*/

// Solution 4: Node vs Element
console.log("\n--- Node vs Element ---");

/*
Node types:
- Element (1)
- Text (3)
- Comment (8)
- Document (9)

const div = document.createElement("div");
console.log("nodeType:", div.nodeType);     // 1
console.log("nodeName:", div.nodeName);     // DIV

const text = document.createTextNode("Hello");
console.log("Text nodeType:", text.nodeType); // 3
*/

// Solution 5: Iterating Children
console.log("\n--- Iterating Children ---");

/*
const parent = document.getElementById("parent");

// Using children (elements only)
for (const child of parent.children) {
    console.log("Child:", child.tagName);
}

// Using Array methods
Array.from(parent.children).forEach((child, index) => {
    console.log(`Child ${index}:`, child.textContent);
});

// Filter specific children
const divChildren = [...parent.children].filter(
    child => child.tagName === "DIV"
);
*/

// Solution 6: Finding All Descendants
console.log("\n--- All Descendants ---");

/*
function getAllDescendants(element) {
    const descendants = [];
    
    function traverse(node) {
        for (const child of node.children) {
            descendants.push(child);
            traverse(child);
        }
    }
    
    traverse(element);
    return descendants;
}

// Or simply use querySelectorAll
const allDescendants = element.querySelectorAll("*");
*/

// Solution 7: Walking the DOM
console.log("\n--- Walking DOM ---");

/*
function walkDOM(node, callback) {
    callback(node);
    
    node = node.firstElementChild;
    while (node) {
        walkDOM(node, callback);
        node = node.nextElementSibling;
    }
}

walkDOM(document.body, (node) => {
    console.log(node.tagName);
});
*/

// Solution 8: Finding Specific Ancestors
console.log("\n--- Finding Ancestors ---");

/*
function findAncestor(element, selector) {
    while (element && !element.matches(selector)) {
        element = element.parentElement;
    }
    return element;
}

// Or use closest()
const ancestor = element.closest(".container");
*/

// Solution 9: Getting All Siblings
console.log("\n--- All Siblings ---");

/*
function getSiblings(element) {
    return [...element.parentElement.children].filter(
        child => child !== element
    );
}

function getNextSiblings(element) {
    const siblings = [];
    let sibling = element.nextElementSibling;
    while (sibling) {
        siblings.push(sibling);
        sibling = sibling.nextElementSibling;
    }
    return siblings;
}
*/

// Simulated example for Node.js
console.log("\nSimulated DOM Traversal:");

const mockTree = {
    id: "parent",
    children: [
        { id: "child1", children: [] },
        { id: "child2", children: [
            { id: "grandchild1", children: [] }
        ]},
        { id: "child3", children: [] }
    ]
};

function traverseTree(node, depth = 0) {
    console.log("  ".repeat(depth) + node.id);
    node.children.forEach(child => traverseTree(child, depth + 1));
}

traverseTree(mockTree);

