import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class SystemService {
  async getSystemStats() {
    // Simulate real-time system stats
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: {
        in: Math.random() * 1000,
        out: Math.random() * 1000
      }
    };
  }

  async getServers() {
    // Mock server data
    return [
      {
        id: 1,
        name: 'Web Server 01',
        ip: '192.168.1.100',
        status: 'online',
        cpu: 45.2,
        memory: 67.8,
        disk: 34.5,
        uptime: '15d 4h 23m',
        role: 'web'
      },
      {
        id: 2,
        name: 'Database Server',
        ip: '192.168.1.101',
        status: 'online',
        cpu: 78.3,
        memory: 89.1,
        disk: 56.7,
        uptime: '25d 12h 45m',
        role: 'database'
      },
      {
        id: 3,
        name: 'API Server',
        ip: '192.168.1.102',
        status: 'warning',
        cpu: 91.5,
        memory: 95.2,
        disk: 87.3,
        uptime: '8d 2h 15m',
        role: 'api'
      }
    ];
  }

  async getLogs(filters = {}) {
    // Mock log data
    const logTypes = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
    const sources = ['system', 'application', 'database', 'network'];

    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      level: logTypes[Math.floor(Math.random() * logTypes.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: `Log message ${i + 1}: ${this.generateRandomLogMessage()}`,
      details: {
        userId: Math.floor(Math.random() * 1000),
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`
      }
    }));
  }

  generateRandomLogMessage() {
    const messages = [
      'User authentication successful',
      'Database connection established',
      'API endpoint called',
      'System resource threshold exceeded',
      'Cache invalidation completed',
      'Scheduled backup started',
      'Network connectivity restored',
      'SSL certificate renewed'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  async getUsers() {
    return [
      {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        role: 'admin',
        status: 'active',
        lastLogin: new Date()
      },
      {
        id: 2,
        username: 'operator',
        name: 'System Operator',
        role: 'operator',
        status: 'active',
        lastLogin: new Date()
      },
      {
        id: 3,
        username: 'viewer',
        name: 'System Viewer',
        role: 'viewer',
        status: 'active',
        lastLogin: new Date()
      }
    ];
  }

  async createUser(userData) {
    // Simulate user creation
    return {
      id: Date.now(),
      ...userData,
      status: 'active'
    };
  }

  async updateUser(id, userData) {
    // Simulate user update
    return {
      id,
      ...userData
    };
  }

  async deleteUser(id) {
    // Simulate user deletion
    return { success: true };
  }

  // New method for creating a server
  async createServer(serverData) {
    // Simulate server creation
    return {
      id: Date.now(),
      ...serverData,
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      uptime: '0d 0h 5m'
    };
  }

  // New method for updating a server
  async updateServer(id, serverData) {
    // Simulate server update
    return {
      id,
      ...serverData
    };
  }

  // New method for deleting a server
  async deleteServer(id) {
    // Simulate server deletion
    return { success: true };
  }
}

export const systemService = new SystemService();