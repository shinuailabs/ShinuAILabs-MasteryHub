/**
 * Lab 522: Data Builders
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using builder pattern for test data:
 * 
 * - Builder pattern
 * - Fluent interface
 * - Default values
 * - Validation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create data builders
 * 2. Use fluent interface
 * 3. Add validation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: User Builder
interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'guest';
    isActive: boolean;
}

class UserBuilder {
    private user: Partial<User> = {};
    
    constructor() {
        // Set defaults
        this.user = {
            id: Math.random().toString(36).substring(7),
            username: 'default_user',
            email: 'default@test.com',
            password: 'Default123!',
            role: 'user',
            isActive: true,
        };
    }
    
    withId(id: string): this {
        this.user.id = id;
        return this;
    }
    
    withUsername(username: string): this {
        this.user.username = username;
        return this;
    }
    
    withEmail(email: string): this {
        this.user.email = email;
        return this;
    }
    
    withPassword(password: string): this {
        this.user.password = password;
        return this;
    }
    
    withRole(role: User['role']): this {
        this.user.role = role;
        return this;
    }
    
    asAdmin(): this {
        this.user.role = 'admin';
        return this;
    }
    
    asGuest(): this {
        this.user.role = 'guest';
        return this;
    }
    
    inactive(): this {
        this.user.isActive = false;
        return this;
    }
    
    build(): User {
        return this.user as User;
    }
}

// Solution 2: Product Builder
interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    description: string;
}

class ProductBuilder {
    private product: Partial<Product> = {};
    
    constructor() {
        this.product = {
            id: Math.random().toString(36).substring(7),
            name: 'Default Product',
            price: 9.99,
            category: 'General',
            stock: 100,
            description: 'A default product',
        };
    }
    
    withName(name: string): this {
        this.product.name = name;
        return this;
    }
    
    withPrice(price: number): this {
        this.product.price = price;
        return this;
    }
    
    withCategory(category: string): this {
        this.product.category = category;
        return this;
    }
    
    withStock(stock: number): this {
        this.product.stock = stock;
        return this;
    }
    
    outOfStock(): this {
        this.product.stock = 0;
        return this;
    }
    
    withDescription(description: string): this {
        this.product.description = description;
        return this;
    }
    
    build(): Product {
        return this.product as Product;
    }
}

// Solution 3: Order Builder
interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

class OrderBuilder {
    private order: Partial<Order> = {};
    private items: OrderItem[] = [];
    
    constructor() {
        this.order = {
            id: Math.random().toString(36).substring(7),
            status: 'pending',
        };
    }
    
    forUser(userId: string): this {
        this.order.userId = userId;
        return this;
    }
    
    addItem(productId: string, quantity: number, price: number): this {
        this.items.push({ productId, quantity, price });
        return this;
    }
    
    withStatus(status: Order['status']): this {
        this.order.status = status;
        return this;
    }
    
    build(): Order {
        const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return {
            ...this.order,
            items: this.items,
            total,
        } as Order;
    }
}

// Solution 4: Builder Factory
class TestDataBuilders {
    static user(): UserBuilder {
        return new UserBuilder();
    }
    
    static product(): ProductBuilder {
        return new ProductBuilder();
    }
    
    static order(): OrderBuilder {
        return new OrderBuilder();
    }
}

// Solution 5: Usage Examples
const adminUser = TestDataBuilders.user()
    .withUsername('admin')
    .withEmail('admin@test.com')
    .asAdmin()
    .build();

const expensiveProduct = TestDataBuilders.product()
    .withName('Premium Laptop')
    .withPrice(1999.99)
    .withCategory('Electronics')
    .build();

const sampleOrder = TestDataBuilders.order()
    .forUser(adminUser.id)
    .addItem('prod1', 2, 29.99)
    .addItem('prod2', 1, 49.99)
    .withStatus('processing')
    .build();

// Solution 6: Export
export {
    User,
    Product,
    Order,
    OrderItem,
    UserBuilder,
    ProductBuilder,
    OrderBuilder,
    TestDataBuilders,
};

