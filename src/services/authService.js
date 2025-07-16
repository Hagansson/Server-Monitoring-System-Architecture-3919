import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock authentication service
class AuthService {
  async login(credentials) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users
    const mockUsers = [
      { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
      { id: 2, username: 'operator', password: 'operator123', role: 'operator', name: 'System Operator' },
      { id: 3, username: 'viewer', password: 'viewer123', role: 'viewer', name: 'System Viewer' }
    ];

    const user = mockUsers.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));
    return {
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
      token
    };
  }

  async validateToken(token) {
    try {
      const decoded = JSON.parse(atob(token));
      // Simulate token validation
      return { id: decoded.userId, role: decoded.role };
    } catch {
      throw new Error('Invalid token');
    }
  }

  async logout() {
    // Simulate logout
    return Promise.resolve();
  }
}

export const authService = new AuthService();