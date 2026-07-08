# Part 10: Events

## 📚 Overview
Events allow JavaScript to respond to user interactions and browser actions.

---

## 🎯 Key Concepts

### 1. Event Basics

```javascript
// addEventListener (preferred)
element.addEventListener("click", function(event) {
  console.log("Clicked!");
});

// Arrow function
element.addEventListener("click", (e) => {
  console.log("Clicked!");
});

// Remove listener
const handler = () => console.log("Click");
element.addEventListener("click", handler);
element.removeEventListener("click", handler);

// Options
element.addEventListener("click", handler, {
  once: true,      // Remove after first trigger
  capture: true,   // Capture phase
  passive: true    // Won't call preventDefault
});
```

### 2. Event Propagation

```javascript
// Three phases:
// 1. Capture - from window to target
// 2. Target - at the target element
// 3. Bubble - from target back to window

// Stop propagation
element.addEventListener("click", (e) => {
  e.stopPropagation();  // Stop bubbling
});

// Stop immediate propagation
element.addEventListener("click", (e) => {
  e.stopImmediatePropagation();  // Stop all handlers
});

// Prevent default behavior
link.addEventListener("click", (e) => {
  e.preventDefault();  // Don't navigate
});
```

### 3. Event Delegation

```javascript
// Instead of adding listeners to each item...
// Add one listener to parent

const list = document.querySelector("ul");

list.addEventListener("click", (e) => {
  // Check if clicked element is a list item
  if (e.target.matches("li")) {
    console.log("Clicked:", e.target.textContent);
  }
  
  // Or use closest for nested elements
  const item = e.target.closest("li");
  if (item) {
    console.log("Clicked item:", item);
  }
});

// Benefits:
// - Works for dynamically added elements
// - Better performance (fewer listeners)
// - Cleaner code
```

### 4. Mouse Events

```javascript
element.addEventListener("click", handler);      // Single click
element.addEventListener("dblclick", handler);   // Double click
element.addEventListener("mousedown", handler);  // Button pressed
element.addEventListener("mouseup", handler);    // Button released
element.addEventListener("mousemove", handler);  // Mouse moved
element.addEventListener("mouseenter", handler); // Enter element
element.addEventListener("mouseleave", handler); // Leave element
element.addEventListener("mouseover", handler);  // Enter (bubbles)
element.addEventListener("mouseout", handler);   // Leave (bubbles)
element.addEventListener("contextmenu", handler); // Right click

// Event properties
element.addEventListener("click", (e) => {
  e.clientX;  // X relative to viewport
  e.clientY;  // Y relative to viewport
  e.pageX;    // X relative to document
  e.pageY;    // Y relative to document
  e.button;   // 0=left, 1=middle, 2=right
});
```

### 5. Keyboard Events

```javascript
element.addEventListener("keydown", handler);  // Key pressed
element.addEventListener("keyup", handler);    // Key released
element.addEventListener("keypress", handler); // Deprecated

// Event properties
document.addEventListener("keydown", (e) => {
  e.key;       // "a", "Enter", "Escape"
  e.code;      // "KeyA", "Enter", "Escape"
  e.altKey;    // Alt pressed?
  e.ctrlKey;   // Ctrl pressed?
  e.shiftKey;  // Shift pressed?
  e.metaKey;   // Cmd/Win pressed?
  
  // Common patterns
  if (e.key === "Enter") { }
  if (e.key === "Escape") { }
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    saveDocument();
  }
});
```

### 6. Form Events

```javascript
// Input events
input.addEventListener("input", handler);   // Value changed
input.addEventListener("change", handler);  // Value committed
input.addEventListener("focus", handler);   // Got focus
input.addEventListener("blur", handler);    // Lost focus

// Form events
form.addEventListener("submit", (e) => {
  e.preventDefault();  // Prevent page reload
  const data = new FormData(form);
  // Process form data
});

form.addEventListener("reset", handler);

// Select events
select.addEventListener("change", (e) => {
  console.log(e.target.value);
});
```

### 7. Window Events

```javascript
// Load events
window.addEventListener("load", handler);           // All loaded
window.addEventListener("DOMContentLoaded", handler); // DOM ready
window.addEventListener("beforeunload", handler);   // Before leave

// Resize and scroll
window.addEventListener("resize", handler);
window.addEventListener("scroll", handler);

// Visibility
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("Tab hidden");
  }
});

// Online/offline
window.addEventListener("online", handler);
window.addEventListener("offline", handler);
```

### 8. Custom Events

```javascript
// Create custom event
const event = new CustomEvent("userLogin", {
  detail: { userId: 123, username: "john" },
  bubbles: true,
  cancelable: true
});

// Dispatch event
element.dispatchEvent(event);

// Listen for custom event
element.addEventListener("userLogin", (e) => {
  console.log("User logged in:", e.detail.username);
});
```

---

## 💻 Practice Exercises

1. Implement click handlers
2. Use event delegation for lists
3. Handle keyboard shortcuts
4. Build form validation
5. Create custom events

---

## ✅ Best Practices

- ✅ Use event delegation
- ✅ Remove listeners when done
- ✅ Use `once: true` for one-time events
- ✅ Debounce scroll/resize handlers
- ❌ Don't use inline handlers
- ❌ Avoid excessive listeners

---

## 📝 Quick Reference

```javascript
// Add listener
element.addEventListener("event", handler)

// Remove listener
element.removeEventListener("event", handler)

// Event object
e.target          // Element that triggered
e.currentTarget   // Element with listener
e.preventDefault()
e.stopPropagation()

// Delegation
parent.addEventListener("click", (e) => {
  if (e.target.matches(selector)) { }
})
```

