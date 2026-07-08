/**
 * Lab 096: Form Events
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Form-related events:
 * 
 * Input events:
 * - input: Value changed (real-time)
 * - change: Value committed
 * 
 * Focus events:
 * - focus, blur
 * - focusin, focusout (bubble)
 * 
 * Form events:
 * - submit, reset
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle form submission
 * 2. Validate input in real-time
 * 3. Manage focus states
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Note: This code is meant to run in a browser environment

// Solution 1: Input vs Change
console.log("--- Input vs Change ---");

/*
const input = document.getElementById("textInput");

// Fires on every keystroke
input.addEventListener("input", (event) => {
    console.log("Input:", event.target.value);
});

// Fires when value is committed (blur or Enter)
input.addEventListener("change", (event) => {
    console.log("Change:", event.target.value);
});
*/

// Solution 2: Focus Events
console.log("\n--- Focus Events ---");

/*
const input = document.getElementById("myInput");

// focus/blur don't bubble
input.addEventListener("focus", () => {
    console.log("Input focused");
    input.classList.add("focused");
});

input.addEventListener("blur", () => {
    console.log("Input blurred");
    input.classList.remove("focused");
});

// focusin/focusout bubble (good for delegation)
form.addEventListener("focusin", (event) => {
    console.log("Focus in:", event.target.name);
});

form.addEventListener("focusout", (event) => {
    console.log("Focus out:", event.target.name);
});
*/

// Solution 3: Form Submission
console.log("\n--- Form Submission ---");

/*
const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log("Form data:", data);
    
    // Validate
    if (!validateForm(data)) {
        return;
    }
    
    // Submit via fetch
    fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
});
*/

// Solution 4: Real-time Validation
console.log("\n--- Real-time Validation ---");

/*
const emailInput = document.getElementById("email");
const errorSpan = document.getElementById("emailError");

emailInput.addEventListener("input", (event) => {
    const value = event.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
    if (value && !isValid) {
        errorSpan.textContent = "Invalid email format";
        emailInput.classList.add("invalid");
    } else {
        errorSpan.textContent = "";
        emailInput.classList.remove("invalid");
    }
});
*/

// Solution 5: Select and Checkbox Events
console.log("\n--- Select and Checkbox ---");

/*
// Select dropdown
const select = document.getElementById("country");
select.addEventListener("change", (event) => {
    console.log("Selected:", event.target.value);
    console.log("Text:", event.target.options[event.target.selectedIndex].text);
});

// Checkbox
const checkbox = document.getElementById("agree");
checkbox.addEventListener("change", (event) => {
    console.log("Checked:", event.target.checked);
});

// Radio buttons
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener("change", (event) => {
        if (event.target.checked) {
            console.log("Selected:", event.target.value);
        }
    });
});
*/

// Solution 6: Form Reset
console.log("\n--- Form Reset ---");

/*
form.addEventListener("reset", (event) => {
    // Optionally prevent reset
    if (!confirm("Are you sure you want to reset?")) {
        event.preventDefault();
        return;
    }
    
    console.log("Form reset");
    
    // Clear custom state
    document.querySelectorAll(".error").forEach(el => {
        el.textContent = "";
    });
});
*/

// Solution 7: Input Masking
console.log("\n--- Input Masking ---");

/*
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    
    if (value.length > 0) {
        value = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        event.target.value = !value[2] ? value[1] 
            : `(${value[1]}) ${value[2]}${value[3] ? `-${value[3]}` : ""}`;
    }
});
*/

// Solution 8: Auto-save
console.log("\n--- Auto-save ---");

/*
let saveTimeout;

form.addEventListener("input", () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const formData = new FormData(form);
        localStorage.setItem("formDraft", JSON.stringify(Object.fromEntries(formData)));
        console.log("Auto-saved");
    }, 1000);
});

// Restore on load
window.addEventListener("load", () => {
    const draft = localStorage.getItem("formDraft");
    if (draft) {
        const data = JSON.parse(draft);
        Object.entries(data).forEach(([name, value]) => {
            const field = form.elements[name];
            if (field) field.value = value;
        });
    }
});
*/

// Simulated example for Node.js
console.log("\nSimulated Form Events:");

class MockForm {
    constructor() {
        this.fields = {};
        this.listeners = {};
    }
    
    setField(name, value) {
        const oldValue = this.fields[name];
        this.fields[name] = value;
        this.emit("input", { name, value, oldValue });
        if (oldValue !== value) {
            this.emit("change", { name, value, oldValue });
        }
    }
    
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    
    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }
    
    submit() {
        this.emit("submit", { data: this.fields });
    }
}

const form = new MockForm();
form.on("input", (e) => console.log(`Input: ${e.name} = ${e.value}`));
form.on("submit", (e) => console.log("Submit:", e.data));

form.setField("username", "john");
form.setField("email", "john@example.com");
form.submit();

