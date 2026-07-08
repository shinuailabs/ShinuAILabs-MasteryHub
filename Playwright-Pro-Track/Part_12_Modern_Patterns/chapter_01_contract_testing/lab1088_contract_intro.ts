/**
 * Lab 1088: Contract Testing Introduction with Pact
 *
 * CONCEPT:
 * Contract Testing ensures that services (consumer & provider) can communicate
 * correctly by verifying their API contracts. Unlike integration tests, contract
 * tests are fast, isolated, and catch breaking changes early.
 *
 * BULLET POINTS:
 * - Consumer-Driven Contract Testing (CDC) puts consumers in control
 * - Pact is the most popular contract testing framework
 * - Contracts are JSON files describing expected interactions
 * - Provider verification ensures the API meets consumer expectations
 * - Pact Broker enables contract sharing across teams
 *
 * EXAMPLES:
 * - Frontend ↔ Backend API contracts
 * - Microservice ↔ Microservice contracts
 * - Mobile App ↔ API contracts
 */

import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import { expect } from '@playwright/test';

const { like, eachLike, string, integer } = MatchersV3;

// Define the contract between Consumer and Provider
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserApiClient {
  getUser(id: number): Promise<User>;
  getUsers(): Promise<User[]>;
}

// Consumer API Client
class UserServiceClient implements UserApiClient {
  constructor(private baseUrl: string) {}

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`);
    if (!response.ok) throw new Error(`User not found: ${id}`);
    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/api/users`);
    return response.json();
  }
}

// Pact Contract Test Setup
const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'UserService',
  dir: './pacts', // Where contract files are stored
});

// Contract Test: Get Single User
async function testGetUserContract() {
  // Define the expected interaction
  await provider
    .given('a user with ID 1 exists')
    .uponReceiving('a request for user 1')
    .withRequest({
      method: 'GET',
      path: '/api/users/1',
      headers: { Accept: 'application/json' },
    })
    .willRespondWith({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        id: integer(1),
        name: string('John Doe'),
        email: string('john@example.com'),
      },
    });

  // Execute the test
  await provider.executeTest(async (mockServer) => {
    const client = new UserServiceClient(mockServer.url);
    const user = await client.getUser(1);

    expect(user.id).toBe(1);
    expect(user.name).toBeDefined();
    expect(user.email).toContain('@');
  });
}

// Contract Test: Get All Users
async function testGetUsersContract() {
  await provider
    .given('users exist')
    .uponReceiving('a request for all users')
    .withRequest({
      method: 'GET',
      path: '/api/users',
    })
    .willRespondWith({
      status: 200,
      body: eachLike({
        id: integer(1),
        name: string('User'),
        email: string('user@example.com'),
      }),
    });

  await provider.executeTest(async (mockServer) => {
    const client = new UserServiceClient(mockServer.url);
    const users = await client.getUsers();

    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('id');
  });
}

/**
 * EXERCISE:
 * 1. Install Pact: npm install @pact-foundation/pact
 * 2. Create a contract for POST /api/users (create user)
 * 3. Create a contract for DELETE /api/users/:id
 * 4. Add error scenarios (404, 500)
 * 5. Set up Pact Broker for contract sharing
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What's the difference between contract testing and integration testing?
 * A1: Contract tests verify API shape/structure without real services.
 *     Integration tests verify actual behavior with real services.
 *     Contract tests are faster and more isolated.
 *
 * Q2: When should you use contract testing?
 * A2: When multiple teams own different services, when APIs change frequently,
 *     when you need fast feedback on breaking changes.
 */

/**
 * LEARNING:
 * - Contract testing catches API breaking changes before deployment
 * - Consumer-driven contracts ensure APIs meet actual usage needs
 * - Pact generates contracts that can be verified by providers
 * - Use Pact Broker to share contracts across teams
 *
 * ONE LINER:
 * "Contract testing: Catch API breaking changes before they break production."
 */

export { UserServiceClient, testGetUserContract, testGetUsersContract };
