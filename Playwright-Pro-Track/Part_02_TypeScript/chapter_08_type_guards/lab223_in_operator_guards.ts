/**
 * Lab 223: in Operator Type Guards
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using 'in' operator for property checks:
 * 
 * - Property existence
 * - Discriminating objects
 * - Interface narrowing
 * - Optional properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use in operator guards
 * 2. Discriminate object types
 * 3. Handle optional properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic in Operator
console.log("--- Basic in Operator ---");

interface Fish {
    swim(): void;
}

interface Bird {
    fly(): void;
}

function move(animal: Fish | Bird): void {
    if ("swim" in animal) {
        animal.swim();
    } else {
        animal.fly();
    }
}

const fish: Fish = { swim: () => console.log("Swimming") };
const bird: Bird = { fly: () => console.log("Flying") };

move(fish);
move(bird);

// Solution 2: Multiple Properties
console.log("\n--- Multiple Properties ---");

interface Car {
    drive(): void;
    wheels: number;
}

interface Boat {
    sail(): void;
    propeller: boolean;
}

interface Plane {
    fly(): void;
    wings: number;
}

type Vehicle = Car | Boat | Plane;

function operate(vehicle: Vehicle): void {
    if ("drive" in vehicle) {
        console.log(`Driving with ${vehicle.wheels} wheels`);
        vehicle.drive();
    } else if ("sail" in vehicle) {
        console.log("Sailing");
        vehicle.sail();
    } else {
        console.log(`Flying with ${vehicle.wings} wings`);
        vehicle.fly();
    }
}

operate({ drive: () => {}, wheels: 4 });
operate({ sail: () => {}, propeller: true });
operate({ fly: () => {}, wings: 2 });

// Solution 3: API Response Types
console.log("\n--- API Response Types ---");

interface SuccessResponse {
    data: unknown;
    status: "success";
}

interface ErrorResponse {
    error: string;
    code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
    if ("data" in response) {
        console.log("Success:", response.data);
    } else {
        console.log(`Error ${response.code}: ${response.error}`);
    }
}

handleResponse({ data: { id: 1 }, status: "success" });
handleResponse({ error: "Not found", code: 404 });

// Solution 4: Optional vs Required
console.log("\n--- Optional Properties ---");

interface BasicUser {
    name: string;
    email: string;
}

interface AdminUser {
    name: string;
    email: string;
    adminLevel: number;
    permissions: string[];
}

type User = BasicUser | AdminUser;

function describeUser(user: User): void {
    console.log(`User: ${user.name}`);
    
    if ("adminLevel" in user) {
        console.log(`Admin Level: ${user.adminLevel}`);
        console.log(`Permissions: ${user.permissions.join(", ")}`);
    }
}

describeUser({ name: "John", email: "john@example.com" });
describeUser({ name: "Admin", email: "admin@example.com", adminLevel: 1, permissions: ["read", "write"] });

// Solution 5: Nested Property Checks
console.log("\n--- Nested Properties ---");

interface WithAddress {
    address: {
        street: string;
        city: string;
    };
}

interface WithoutAddress {
    location: string;
}

type Contact = WithAddress | WithoutAddress;

function getLocation(contact: Contact): string {
    if ("address" in contact) {
        return `${contact.address.street}, ${contact.address.city}`;
    }
    return contact.location;
}

console.log(getLocation({ address: { street: "123 Main", city: "NYC" } }));
console.log(getLocation({ location: "Remote" }));

// Solution 6: Method Checks
console.log("\n--- Method Checks ---");

interface Serializable {
    serialize(): string;
}

interface Printable {
    print(): void;
}

type Document = Serializable | Printable | (Serializable & Printable);

function processDocument(doc: Document): void {
    if ("serialize" in doc) {
        console.log("Serialized:", doc.serialize());
    }
    if ("print" in doc) {
        doc.print();
    }
}

const doc1: Serializable = { serialize: () => '{"type":"doc"}' };
const doc2: Printable = { print: () => console.log("Printing...") };
const doc3: Serializable & Printable = {
    serialize: () => '{"type":"full"}',
    print: () => console.log("Full print")
};

processDocument(doc1);
processDocument(doc2);
processDocument(doc3);

// Solution 7: Event Handling
console.log("\n--- Event Handling ---");

interface MouseEvent {
    type: "mouse";
    x: number;
    y: number;
    button: string;
}

interface KeyboardEvent {
    type: "keyboard";
    key: string;
    ctrlKey: boolean;
}

interface TouchEvent {
    type: "touch";
    touches: { x: number; y: number }[];
}

type UIEvent = MouseEvent | KeyboardEvent | TouchEvent;

function handleEvent(event: UIEvent): void {
    if ("button" in event) {
        console.log(`Mouse ${event.button} at (${event.x}, ${event.y})`);
    } else if ("key" in event) {
        console.log(`Key: ${event.key}${event.ctrlKey ? " (Ctrl)" : ""}`);
    } else if ("touches" in event) {
        console.log(`Touch with ${event.touches.length} points`);
    }
}

handleEvent({ type: "mouse", x: 100, y: 200, button: "left" });
handleEvent({ type: "keyboard", key: "Enter", ctrlKey: false });
handleEvent({ type: "touch", touches: [{ x: 0, y: 0 }] });

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

interface TextNode {
    type: "text";
    content: string;
}

interface ElementNode {
    type: "element";
    tag: string;
    children: Node[];
}

interface CommentNode {
    type: "comment";
    text: string;
}

type Node = TextNode | ElementNode | CommentNode;

function renderNode(node: Node): string {
    if ("content" in node) {
        return node.content;
    }
    if ("children" in node) {
        const children = node.children.map(renderNode).join("");
        return `<${node.tag}>${children}</${node.tag}>`;
    }
    return `<!-- ${node.text} -->`;
}

const tree: ElementNode = {
    type: "element",
    tag: "div",
    children: [
        { type: "text", content: "Hello " },
        { type: "element", tag: "strong", children: [{ type: "text", content: "World" }] }
    ]
};

console.log(renderNode(tree));

