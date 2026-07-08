# Part 09: DOM Manipulation

## 📚 Overview
The Document Object Model (DOM) represents the HTML structure. JavaScript can manipulate the DOM to create dynamic web pages.

---

## 🎯 Key Concepts

### 1. DOM Selection

```javascript
// By ID
const element = document.getElementById("myId");

// By class
const elements = document.getElementsByClassName("myClass");

// By tag
const divs = document.getElementsByTagName("div");

// Query selector (CSS selectors)
const first = document.querySelector(".myClass");
const all = document.querySelectorAll(".myClass");

// Modern approach - prefer querySelector
document.querySelector("#id");
document.querySelector(".class");
document.querySelector("div.class");
document.querySelector("[data-testid='login']");
```

### 2. DOM Traversal

```javascript
const element = document.querySelector(".item");

// Parent
element.parentElement;
element.parentNode;
element.closest(".container");  // Nearest ancestor

// Children
element.children;           // HTMLCollection
element.childNodes;         // NodeList (includes text)
element.firstElementChild;
element.lastElementChild;

// Siblings
element.nextElementSibling;
element.previousElementSibling;
```

### 3. DOM Modification

```javascript
// Create elements
const div = document.createElement("div");
const text = document.createTextNode("Hello");

// Add content
div.textContent = "Hello";      // Text only
div.innerHTML = "<b>Hello</b>"; // HTML (careful!)
div.innerText = "Hello";        // Visible text

// Append elements
parent.appendChild(child);
parent.append(child1, child2);  // Multiple
parent.prepend(child);          // At start
element.before(sibling);
element.after(sibling);

// Remove elements
element.remove();
parent.removeChild(child);

// Replace
parent.replaceChild(newChild, oldChild);
element.replaceWith(newElement);

// Clone
const clone = element.cloneNode(true);  // Deep clone
```

### 4. Attributes

```javascript
const element = document.querySelector("input");

// Get/Set attributes
element.getAttribute("type");
element.setAttribute("type", "text");
element.removeAttribute("disabled");
element.hasAttribute("required");

// Data attributes
element.dataset.userId;         // data-user-id
element.dataset.userId = "123";

// Common properties
element.id;
element.className;
element.value;      // For inputs
element.href;       // For links
element.src;        // For images
```

### 5. Classes and Styles

```javascript
const element = document.querySelector(".box");

// Class manipulation
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");
element.classList.contains("active");
element.classList.replace("old", "new");

// Multiple classes
element.classList.add("class1", "class2");

// Inline styles
element.style.color = "red";
element.style.backgroundColor = "blue";
element.style.cssText = "color: red; font-size: 16px;";

// Get computed styles
const styles = getComputedStyle(element);
styles.color;
```

### 6. Forms

```javascript
const form = document.querySelector("form");
const input = document.querySelector("input");

// Form values
input.value;
input.checked;      // Checkbox/radio
select.value;       // Select dropdown

// Form data
const formData = new FormData(form);
formData.get("fieldName");
Object.fromEntries(formData);

// Form validation
input.validity.valid;
input.checkValidity();
form.reportValidity();
```

### 7. Dimensions and Position

```javascript
const element = document.querySelector(".box");

// Element dimensions
element.offsetWidth;   // Width + padding + border
element.offsetHeight;
element.clientWidth;   // Width + padding
element.clientHeight;
element.scrollWidth;   // Full scrollable width
element.scrollHeight;

// Position
element.offsetTop;     // Relative to offset parent
element.offsetLeft;
element.getBoundingClientRect();  // Viewport position

// Scroll
element.scrollTop;
element.scrollLeft;
element.scrollIntoView({ behavior: "smooth" });
```

### 8. Templates

```javascript
// Template element
const template = document.querySelector("#item-template");
const clone = template.content.cloneNode(true);
clone.querySelector(".title").textContent = "New Item";
container.appendChild(clone);

// DocumentFragment (for batch operations)
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement("li");
  li.textContent = item;
  fragment.appendChild(li);
});
list.appendChild(fragment);  // Single DOM update
```

---

## 💻 Practice Exercises

1. Select and modify elements
2. Create dynamic lists
3. Build a form validator
4. Implement drag and drop
5. Create a modal component

---

## ✅ Best Practices

- ✅ Use `querySelector` for consistency
- ✅ Cache DOM references
- ✅ Use `textContent` over `innerHTML`
- ✅ Batch DOM updates with fragments
- ❌ Avoid excessive DOM manipulation
- ❌ Don't use `innerHTML` with user input

---

## 📝 Quick Reference

```javascript
// Select
document.querySelector(selector)
document.querySelectorAll(selector)

// Modify
element.textContent = "text"
element.innerHTML = "<b>html</b>"

// Classes
element.classList.add("class")
element.classList.remove("class")
element.classList.toggle("class")

// Create
document.createElement("div")
parent.appendChild(child)
element.remove()

// Attributes
element.getAttribute("attr")
element.setAttribute("attr", "value")
element.dataset.name
```

