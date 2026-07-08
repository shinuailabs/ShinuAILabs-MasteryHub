/**
 * Lab 520: Environment Data
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing environment-specific data:
 * 
 * - Environment variables
 * - Config files
 * - Environment switching
 * - Secrets management
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Load environment data
 * 2. Switch environments
 * 3. Handle secrets
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Environment Types
type Environment = 'dev' | 'staging' | 'prod';

interface EnvironmentConfig {
    baseUrl: string;
    apiUrl: string;
    timeout: number;
    credentials: {
        username: string;
        password: string;
    };
}

// Solution 2: Environment Configurations
const environments: Record<Environment, EnvironmentConfig> = {
    dev: {
        baseUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3001/api',
        timeout: 30000,
        credentials: {
            username: 'dev_user',
            password: 'dev_pass',
        },
    },
    staging: {
        baseUrl: 'https://staging.example.com',
        apiUrl: 'https://staging-api.example.com',
        timeout: 45000,
        credentials: {
            username: 'staging_user',
            password: 'staging_pass',
        },
    },
    prod: {
        baseUrl: 'https://example.com',
        apiUrl: 'https://api.example.com',
        timeout: 60000,
        credentials: {
            username: 'prod_user',
            password: 'prod_pass',
        },
    },
};

// Solution 3: Environment Manager
class EnvironmentManager {
    private currentEnv: Environment;
    
    constructor() {
        this.currentEnv = (process.env.TEST_ENV as Environment) || 'dev';
    }
    
    getConfig(): EnvironmentConfig {
        return environments[this.currentEnv];
    }
    
    getEnvironment(): Environment {
        return this.currentEnv;
    }
    
    setEnvironment(env: Environment) {
        this.currentEnv = env;
    }
    
    get baseUrl(): string {
        return this.getConfig().baseUrl;
    }
    
    get apiUrl(): string {
        return this.getConfig().apiUrl;
    }
    
    get timeout(): number {
        return this.getConfig().timeout;
    }
}

// Solution 4: Environment Variables Helper
class EnvVars {
    static get(key: string, defaultValue?: string): string {
        const value = process.env[key];
        if (value === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw new Error(`Environment variable ${key} is not set`);
        }
        return value;
    }
    
    static getNumber(key: string, defaultValue?: number): number {
        const value = process.env[key];
        if (value === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw new Error(`Environment variable ${key} is not set`);
        }
        return parseInt(value, 10);
    }
    
    static getBoolean(key: string, defaultValue?: boolean): boolean {
        const value = process.env[key];
        if (value === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw new Error(`Environment variable ${key} is not set`);
        }
        return value.toLowerCase() === 'true';
    }
}

// Solution 5: Secrets Manager
class SecretsManager {
    private secrets: Map<string, string> = new Map();
    
    loadFromEnv(keys: string[]) {
        for (const key of keys) {
            const value = process.env[key];
            if (value) {
                this.secrets.set(key, value);
            }
        }
    }
    
    get(key: string): string {
        const value = this.secrets.get(key);
        if (!value) {
            throw new Error(`Secret ${key} not found`);
        }
        return value;
    }
    
    has(key: string): boolean {
        return this.secrets.has(key);
    }
}

// Solution 6: Config Builder
class ConfigBuilder {
    private config: Partial<EnvironmentConfig> = {};
    
    withBaseUrl(url: string): this {
        this.config.baseUrl = url;
        return this;
    }
    
    withApiUrl(url: string): this {
        this.config.apiUrl = url;
        return this;
    }
    
    withTimeout(timeout: number): this {
        this.config.timeout = timeout;
        return this;
    }
    
    withCredentials(username: string, password: string): this {
        this.config.credentials = { username, password };
        return this;
    }
    
    build(): EnvironmentConfig {
        return this.config as EnvironmentConfig;
    }
}

// Solution 7: Export
export {
    Environment,
    EnvironmentConfig,
    environments,
    EnvironmentManager,
    EnvVars,
    SecretsManager,
    ConfigBuilder,
};

