import axios from 'axios';

class APIService {
  constructor() {
    this.endpoints = [
      {
        id: 1,
        name: 'Get Users',
        method: 'GET',
        path: '/api/users',
        description: 'Retrieve all users',
        status: 'active',
        lastTested: new Date(),
        responseTime: 145
      },
      {
        id: 2,
        name: 'Create User',
        method: 'POST',
        path: '/api/users',
        description: 'Create a new user',
        status: 'active',
        lastTested: new Date(),
        responseTime: 289
      },
      {
        id: 3,
        name: 'Get System Stats',
        method: 'GET',
        path: '/api/system/stats',
        description: 'Get system statistics',
        status: 'active',
        lastTested: new Date(),
        responseTime: 67
      }
    ];
  }

  async getEndpoints() {
    return this.endpoints;
  }

  async createEndpoint(endpointData) {
    const newEndpoint = {
      id: Date.now(),
      ...endpointData,
      status: 'active',
      lastTested: null,
      responseTime: null
    };
    this.endpoints.push(newEndpoint);
    return newEndpoint;
  }

  async updateEndpoint(id, endpointData) {
    const index = this.endpoints.findIndex(ep => ep.id === id);
    if (index !== -1) {
      this.endpoints[index] = { ...this.endpoints[index], ...endpointData };
      return this.endpoints[index];
    }
    throw new Error('Endpoint not found');
  }

  async deleteEndpoint(id) {
    const index = this.endpoints.findIndex(ep => ep.id === id);
    if (index !== -1) {
      this.endpoints.splice(index, 1);
      return { success: true };
    }
    throw new Error('Endpoint not found');
  }

  async testEndpoint(id) {
    const endpoint = this.endpoints.find(ep => ep.id === id);
    if (!endpoint) {
      throw new Error('Endpoint not found');
    }

    // Simulate API testing
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    const responseTime = Date.now() - startTime;

    const success = Math.random() > 0.1; // 90% success rate
    
    endpoint.lastTested = new Date();
    endpoint.responseTime = responseTime;
    endpoint.status = success ? 'active' : 'error';

    return {
      success,
      responseTime,
      status: success ? 200 : 500,
      response: success ? { message: 'OK' } : { error: 'Internal Server Error' }
    };
  }

  generateCSharpCode(endpoint) {
    const template = `
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ServerOverwatch.Controllers
{
    [ApiController]
    [Route("${endpoint.path}")]
    [Authorize]
    public class ${this.toPascalCase(endpoint.name)}Controller : ControllerBase
    {
        [Http${endpoint.method.charAt(0) + endpoint.method.slice(1).toLowerCase()}]
        public async Task<IActionResult> ${endpoint.method}${this.toPascalCase(endpoint.name)}()
        {
            try
            {
                // TODO: Implement your logic here
                var result = new { message = "Success", data = new object() };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}`;
    return template;
  }

  toPascalCase(str) {
    return str.replace(/\w+/g, word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).replace(/\s+/g, '');
  }
}

export const apiService = new APIService();