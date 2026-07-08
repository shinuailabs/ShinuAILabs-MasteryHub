/**
 * Lab 1097: GraphQL Testing Basics with Playwright
 *
 * CONCEPT:
 * GraphQL is a query language for APIs that allows clients to request exactly
 * the data they need. Testing GraphQL requires understanding queries, mutations,
 * variables, and how to validate responses.
 *
 * BULLET POINTS:
 * - GraphQL uses a single endpoint (typically /graphql)
 * - Queries fetch data, Mutations modify data
 * - Variables make queries reusable and type-safe
 * - Introspection allows discovering the schema
 * - Errors are returned in a structured format
 *
 * EXAMPLES:
 * - E-commerce: Query products, mutate cart
 * - Social media: Query posts, mutate likes
 * - Dashboard: Query metrics with filters
 */

import { test, expect, APIRequestContext } from '@playwright/test';

// GraphQL Types
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  posts?: Post[];
}

interface Post {
  id: string;
  title: string;
  content: string;
}

// GraphQL Test Client
class GraphQLClient {
  constructor(
    private request: APIRequestContext,
    private endpoint: string = '/graphql'
  ) {}

  async query<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<GraphQLResponse<T>> {
    const response = await this.request.post(this.endpoint, {
      data: { query, variables },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async mutation<T>(
    mutation: string,
    variables?: Record<string, unknown>
  ): Promise<GraphQLResponse<T>> {
    return this.query<T>(mutation, variables);
  }
}

// Example Queries
const QUERIES = {
  GET_USER: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
      }
    }
  `,
  GET_USERS: `
    query GetUsers($limit: Int, $offset: Int) {
      users(limit: $limit, offset: $offset) {
        id
        name
        email
      }
    }
  `,
  GET_USER_WITH_POSTS: `
    query GetUserWithPosts($id: ID!) {
      user(id: $id) {
        id
        name
        posts {
          id
          title
        }
      }
    }
  `,
};

const MUTATIONS = {
  CREATE_USER: `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
      }
    }
  `,
  UPDATE_USER: `
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
        id
        name
        email
      }
    }
  `,
};

// Playwright Tests
test.describe('GraphQL API Testing', () => {
  let client: GraphQLClient;

  test.beforeEach(async ({ request }) => {
    client = new GraphQLClient(request, 'https://api.example.com/graphql');
  });

  test('should fetch a user by ID', async () => {
    const result = await client.query<{ user: User }>(QUERIES.GET_USER, {
      id: '1',
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.user).toBeDefined();
    expect(result.data?.user.id).toBe('1');
    expect(result.data?.user.name).toBeDefined();
  });

  test('should fetch users with pagination', async () => {
    const result = await client.query<{ users: User[] }>(QUERIES.GET_USERS, {
      limit: 10,
      offset: 0,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.users).toHaveLength(10);
  });

  test('should create a new user', async () => {
    const result = await client.mutation<{ createUser: User }>(
      MUTATIONS.CREATE_USER,
      {
        input: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data?.createUser.name).toBe('John Doe');
  });

  test('should handle GraphQL errors gracefully', async () => {
    const result = await client.query<{ user: User }>(QUERIES.GET_USER, {
      id: 'non-existent',
    });

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toContain('not found');
  });
});

/**
 * EXERCISE:
 * 1. Create a GraphQL client for your API
 * 2. Write tests for queries with nested data
 * 3. Test mutations with validation errors
 * 4. Implement schema introspection test
 * 5. Add performance assertions (response time)
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: How do you test GraphQL vs REST APIs?
 * A1: GraphQL uses POST to single endpoint, sends query in body,
 *     and returns data/errors in structured format. REST uses
 *     multiple endpoints with different HTTP methods.
 *
 * Q2: How do you handle GraphQL errors in tests?
 * A2: Check the `errors` array in response. GraphQL returns 200
 *     even for errors, so you must check the response body.
 */

/**
 * LEARNING:
 * - GraphQL testing requires understanding query/mutation syntax
 * - Always check both data and errors in responses
 * - Use variables for reusable, type-safe queries
 * - Playwright's request API works great for GraphQL
 *
 * ONE LINER:
 * "GraphQL: One endpoint, infinite possibilities, precise testing."
 */

export { GraphQLClient, QUERIES, MUTATIONS };
