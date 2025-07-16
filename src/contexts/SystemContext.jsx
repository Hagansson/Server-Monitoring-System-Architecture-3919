import React, { createContext, useContext, useState, useEffect } from 'react';
import { systemService } from '../services/systemService';

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: { in: 0, out: 0 }
  });
  const [servers, setServers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSystemStats = async () => {
    try {
      const stats = await systemService.getSystemStats();
      setSystemStats(stats);
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  const fetchServers = async () => {
    try {
      setLoading(true);
      const serverData = await systemService.getServers();
      setServers(serverData);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (filters = {}) => {
    try {
      setLoading(true);
      const logData = await systemService.getLogs(filters);
      setLogs(logData);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new server to the list
  const addServer = (newServer) => {
    setServers([...servers, newServer]);
  };

  // Remove server from the list
  const removeServer = (serverId) => {
    setServers(servers.filter(server => server.id !== serverId));
  };

  // Update existing server
  const updateServer = (serverId, serverData) => {
    setServers(servers.map(server => 
      server.id === serverId ? { ...server, ...serverData } : server
    ));
  };

  useEffect(() => {
    fetchSystemStats();
    fetchServers();
    fetchLogs();

    const interval = setInterval(fetchSystemStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    systemStats,
    servers,
    logs,
    loading,
    fetchSystemStats,
    fetchServers,
    fetchLogs,
    addServer,
    removeServer,
    updateServer
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};