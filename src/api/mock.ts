// src/api/mock.ts
// Mock Backend API - For local testing

// Simulated user database
interface MockUser {
    id: string;
    username: string;
    password: string;
    roles: string[];
}

// Initial test accounts
const mockUsers: MockUser[] = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123',
        roles: ['admin'],
    },
    {
        id: '2',
        username: 'user',
        password: 'user123',
        roles: ['user'],
    },
];

let userIdCounter = 3;

// Generate simple mock token
function generateMockToken(user: MockUser): string {
    const payload = {
        sub: user.id,
        username: user.username,
        roles: user.roles,
        exp: Date.now() + 3600000, // 1 hour
    };
    return btoa(JSON.stringify(payload));
}

// Parse mock token
function parseMockToken(token: string): { sub: string; username: string; roles: string[] } | null {
    try {
        const payload = JSON.parse(atob(token));
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

// Mock API responses
export const mockApi = {
    login: async (username: string, password: string): Promise<{ accessToken: string }> => {
        await delay(300); // Simulate network latency

        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new Error('Invalid username or password');
        }

        return { accessToken: generateMockToken(user) };
    },

    register: async (username: string, password: string): Promise<{ accessToken: string }> => {
        await delay(300);

        if (mockUsers.some(u => u.username === username)) {
            throw new Error('This username is already registered');
        }

        const newUser: MockUser = {
            id: String(userIdCounter++),
            username,
            password,
            roles: ['user'],
        };
        mockUsers.push(newUser);

        return { accessToken: generateMockToken(newUser) };
    },

    logout: async (): Promise<void> => {
        await delay(100);
        // Mock logout - does nothing in practice
    },

    fetchMe: async (token: string): Promise<{ id: string; username: string; roles: string[] }> => {
        await delay(200);

        const payload = parseMockToken(token);
        if (!payload) {
            throw new Error('Token is invalid or expired');
        }

        return {
            id: payload.sub,
            username: payload.username,
            roles: payload.roles,
        };
    },

    refresh: async (): Promise<{ accessToken: string }> => {
        await delay(200);
        // Mock refresh - should validate refresh token in real scenarios
        throw new Error('Refresh token is invalid');
    },
};

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Print test account information
console.log('🔐 Mock login enabled! Test accounts:');
console.log('   👤 admin / admin123');
console.log('   👤 user / user123');

