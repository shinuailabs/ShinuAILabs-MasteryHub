/**
 * Lab 521: Data Generation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Generating test data:
 * 
 * - Random data
 * - Faker patterns
 * - Unique identifiers
 * - Realistic data
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Generate random data
 * 2. Create realistic data
 * 3. Ensure uniqueness
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Random Generators
class RandomGenerator {
    static string(length: number = 10): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static number(min: number = 0, max: number = 100): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static boolean(): boolean {
        return Math.random() > 0.5;
    }
    
    static element<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Solution 2: Data Generators
class DataGenerator {
    static email(): string {
        return `user_${RandomGenerator.string(8)}@test.com`;
    }
    
    static username(): string {
        return `user_${RandomGenerator.string(6)}`;
    }
    
    static password(): string {
        return `Pass${RandomGenerator.number(1000, 9999)}!`;
    }
    
    static phoneNumber(): string {
        return `+1${RandomGenerator.number(1000000000, 9999999999)}`;
    }
    
    static date(startYear: number = 2020, endYear: number = 2025): Date {
        const start = new Date(startYear, 0, 1).getTime();
        const end = new Date(endYear, 11, 31).getTime();
        return new Date(start + Math.random() * (end - start));
    }
}

// Solution 3: Name Generator
class NameGenerator {
    private static firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
    private static lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis'];
    
    static firstName(): string {
        return RandomGenerator.element(this.firstNames);
    }
    
    static lastName(): string {
        return RandomGenerator.element(this.lastNames);
    }
    
    static fullName(): string {
        return `${this.firstName()} ${this.lastName()}`;
    }
}

// Solution 4: Address Generator
class AddressGenerator {
    private static streets = ['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Elm St'];
    private static cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    private static states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
    
    static street(): string {
        return `${RandomGenerator.number(1, 9999)} ${RandomGenerator.element(this.streets)}`;
    }
    
    static city(): string {
        return RandomGenerator.element(this.cities);
    }
    
    static state(): string {
        return RandomGenerator.element(this.states);
    }
    
    static zipCode(): string {
        return String(RandomGenerator.number(10000, 99999));
    }
    
    static full(): { street: string; city: string; state: string; zip: string } {
        return {
            street: this.street(),
            city: this.city(),
            state: this.state(),
            zip: this.zipCode(),
        };
    }
}

// Solution 5: User Generator
interface GeneratedUser {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
}

class UserGenerator {
    static generate(overrides: Partial<GeneratedUser> = {}): GeneratedUser {
        return {
            id: RandomGenerator.uuid(),
            username: DataGenerator.username(),
            email: DataGenerator.email(),
            password: DataGenerator.password(),
            firstName: NameGenerator.firstName(),
            lastName: NameGenerator.lastName(),
            phone: DataGenerator.phoneNumber(),
            ...overrides,
        };
    }
    
    static generateMany(count: number): GeneratedUser[] {
        return Array.from({ length: count }, () => this.generate());
    }
}

// Solution 6: Product Generator
interface GeneratedProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

class ProductGenerator {
    private static categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
    
    static generate(overrides: Partial<GeneratedProduct> = {}): GeneratedProduct {
        return {
            id: RandomGenerator.uuid(),
            name: `Product ${RandomGenerator.string(5)}`,
            price: RandomGenerator.number(1, 1000) + 0.99,
            category: RandomGenerator.element(this.categories),
            inStock: RandomGenerator.boolean(),
            ...overrides,
        };
    }
}

// Solution 7: Export
export {
    RandomGenerator,
    DataGenerator,
    NameGenerator,
    AddressGenerator,
    UserGenerator,
    ProductGenerator,
    GeneratedUser,
    GeneratedProduct,
};

