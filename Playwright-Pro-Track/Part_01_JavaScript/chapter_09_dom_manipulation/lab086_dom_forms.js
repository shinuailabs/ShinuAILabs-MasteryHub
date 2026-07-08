/**
 * Lab 086: DOM Forms
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with form elements:
 * 
 * - Accessing form elements
 * - Getting/setting values
 * - Form validation
 * - Form submission
 * - Different input types
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access form elements
 * 2. Get and set input values
 * 3. Validate form data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Accessing Forms
console.log("--- Accessing Forms ---");

/*
<form id="myForm" name="userForm">
    <input name="username" type="text">
    <input name="email" type="email">
</form>

// By ID
const form = document.getElementById("myForm");

// By name
const formByName = document.forms["userForm"];
const formByIndex = document.forms[0];

// Access form elements
const username = form.elements["username"];
const email = form.elements.email;
*/

// Solution 2: Input Values
console.log("\n--- Input Values ---");

/*
// Text input
const textInput = document.getElementById("textInput");
console.log("Value:", textInput.value);
textInput.value = "New value";

// Checkbox
const checkbox = document.getElementById("checkbox");
console.log("Checked:", checkbox.checked);
checkbox.checked = true;

// Radio buttons
const radios = document.querySelectorAll('input[name="gender"]');
let selectedValue;
radios.forEach(radio => {
    if (radio.checked) selectedValue = radio.value;
});

// Select dropdown
const select = document.getElementById("select");
console.log("Selected value:", select.value);
console.log("Selected text:", select.options[select.selectedIndex].text);

// Multiple select
const multiSelect = document.getElementById("multiSelect");
const selectedOptions = [...multiSelect.selectedOptions].map(opt => opt.value);
*/

// Solution 3: Form Data
console.log("\n--- Form Data ---");

/*
const form = document.getElementById("myForm");

// Using FormData
const formData = new FormData(form);

// Get values
console.log("Username:", formData.get("username"));
console.log("Email:", formData.get("email"));

// Iterate all entries
for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
}

// Convert to object
const formObject = Object.fromEntries(formData);

// Convert to JSON
const jsonData = JSON.stringify(formObject);
*/

// Solution 4: Form Validation
console.log("\n--- Form Validation ---");

/*
const form = document.getElementById("myForm");

// Check validity
const input = document.getElementById("email");
console.log("Valid:", input.checkValidity());
console.log("Validation message:", input.validationMessage);

// Custom validation
input.setCustomValidity("Please enter a valid email");

// Clear custom validation
input.setCustomValidity("");

// Form-level validation
if (form.checkValidity()) {
    // Form is valid
} else {
    // Form is invalid
    form.reportValidity(); // Show validation messages
}
*/

// Solution 5: Validation Constraints
console.log("\n--- Validation Constraints ---");

/*
<input type="text" required minlength="3" maxlength="20">
<input type="number" min="0" max="100">
<input type="email" pattern="[a-z]+@[a-z]+\.[a-z]+">

const input = document.getElementById("input");

// Validity state
const validity = input.validity;
console.log("valueMissing:", validity.valueMissing);
console.log("typeMismatch:", validity.typeMismatch);
console.log("patternMismatch:", validity.patternMismatch);
console.log("tooShort:", validity.tooShort);
console.log("tooLong:", validity.tooLong);
console.log("rangeUnderflow:", validity.rangeUnderflow);
console.log("rangeOverflow:", validity.rangeOverflow);
*/

// Solution 6: Form Submission
console.log("\n--- Form Submission ---");

/*
const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default submission
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    
    // Submit via fetch
    fetch("/api/submit", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
});

// Programmatic submission
form.submit();

// Reset form
form.reset();
*/

// Solution 7: Dynamic Form Elements
console.log("\n--- Dynamic Forms ---");

/*
function addFormField(form, name, type = "text") {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.id = name;
    
    const label = document.createElement("label");
    label.htmlFor = name;
    label.textContent = name;
    
    form.appendChild(label);
    form.appendChild(input);
}

// Enable/disable fields
input.disabled = true;
input.readOnly = true;

// Show/hide fields
fieldContainer.style.display = condition ? "block" : "none";
*/

// Simulated example for Node.js
console.log("\nSimulated Form Handling:");

class MockForm {
    constructor() {
        this.elements = {};
    }
    
    addField(name, value) {
        this.elements[name] = { value, name };
    }
    
    getFormData() {
        const data = {};
        for (const [name, element] of Object.entries(this.elements)) {
            data[name] = element.value;
        }
        return data;
    }
    
    validate() {
        const errors = [];
        for (const [name, element] of Object.entries(this.elements)) {
            if (!element.value) {
                errors.push(`${name} is required`);
            }
        }
        return { valid: errors.length === 0, errors };
    }
}

const form = new MockForm();
form.addField("username", "john");
form.addField("email", "john@example.com");
console.log("Form data:", form.getFormData());
console.log("Validation:", form.validate());

