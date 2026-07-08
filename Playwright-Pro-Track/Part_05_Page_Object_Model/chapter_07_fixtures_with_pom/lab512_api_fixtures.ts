/**
 * Lab 512: API Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating API fixtures:
 * 
 * - API client fixtures
 * - Request helpers
 * - Response handling
 * - API setup/teardown
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create API fixtures
 * 2. Build request helpers
 * 3. Handle responses
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, APIRequestContext } from '@playwright/test';

// Solution 1: API Client Class
class APIClient {
    constructor(readonly request: APIRequestContext, readonly baseURL: string) {}
    
    async get<T>(endpoint: string): Promise<T> {
        const response = await this.request.get(`${this.baseURL}${endpoint}`);
        return await response.json();
    }
    
    async post<T>(endpoint: string, data: object): Promise<T> {
        const response = await this.request.post(`${this.baseURL}${endpoint}`, { data });
        return await response.json();
    }
    
    async put<T>(endpoint: string, data: object): Promise<T> {
        const response = await this.request.put(`${this.baseURL}${endpoint}`, { data });
        return await response.json();
    }
    
    async delete(endpoint: string): Promise<void> {
        await this.request.delete(`${this.baseURL}${endpoint}`);
    }
}

// Solution 2: API Fixture
type APIFixtures = {
    apiClient: APIClient;
};

const test = base.extend<APIFixtures>({
    apiClient: async ({ request }, use) => {
        const client = new APIClient(request, 'https://api.example.com');
        await use(client);
    },
});

// Solution 3: Specialized API Clients
class UserAPIClient {
    constructor(readonly client: APIClient) {}
    
    async createUser(data: { username: string; email: string }) {
        return await this.client.post('/users', data);
    }
    
    async getUser(id: string) {
        return await this.client.get(`/users/${id}`);
    }
    
    async deleteUser(id: string) {
        await this.client.delete(`/users/${id}`);
    }
}

class ProductAPIClient {
    constructor(readonly client: APIClient) {}
    
    async createProduct(data: { name: string; price: number }) {
        return await this.client.post('/products', data);
    }
    
    async getProducts() {
        return await this.client.get('/products');
    }
}

// Solution 4: Specialized API Fixtures
type SpecializedAPIFixtures = {
    userAPI: UserAPIClient;
    productAPI: ProductAPIClient;
};

const testSpecialized = base.extend<APIFixtures & SpecializedAPIFixtures>({
    apiClient: async ({ request }, use) => {
        await use(new APIClient(request, 'https://api.example.com'));
    },
    
    userAPI: async ({ apiClient }, use) => {
        await use(new UserAPIClient(apiClient));
    },
    
    productAPI: async ({ apiClient }, use) => {
        await use(new ProductAPIClient(apiClient));
    },
});

// Solution 5: API with Auth
class AuthenticatedAPIClient extends APIClient {
    constructor(request: APIRequestContext, baseURL: string, private token: string) {
        super(request, baseURL);
    }
    
    async get<T>(endpoint: string): Promise<T> {
        const response = await this.request.get(`${this.baseURL}${endpoint}`, {
            headers: { Authorization: `Bearer ${this.token}` },
        });
        return await response.json();
    }
}

type AuthAPIFixtures = {
    authAPIClient: AuthenticatedAPIClient;
};

const testWithAuth = base.extend<AuthAPIFixtures>({
    authAPIClient: async ({ request }, use) => {
        // Get token
        const loginResponse = await request.post('https://api.example.com/auth/login', {
            data: { username: 'test', password: 'test123' },
        });
        const { token } = await loginResponse.json();
        
        const client = new AuthenticatedAPIClient(request, 'https://api.example.com', token);
        await use(client);
    },
});

// Solution 6: Export
export { test, testSpecialized, testWithAuth };
export { APIClient, UserAPIClient, ProductAPIClient, AuthenticatedAPIClient };

