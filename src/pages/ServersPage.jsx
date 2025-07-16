import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSystem } from '../contexts/SystemContext';
import ReactECharts from 'echarts-for-react';
import Modal from '../components/common/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const { FiServer, FiActivity, FiHardDrive, FiCpu, FiWifi, FiPlus, FiEdit2, FiTrash2 } = FiIcons;

const ServersPage = () => {
  const { servers, addServer, removeServer } = useSystem();
  const [showModal, setShowModal] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServerIcon = (role) => {
    switch (role) {
      case 'web':
        return FiServer;
      case 'database':
        return FiHardDrive;
      case 'api':
        return FiWifi;
      default:
        return FiServer;
    }
  };

  const createResourceChart = (server, metric) => {
    const value = server[metric];
    const color =
      value > 80 ? '#ef4444' : value > 60 ? '#f59e0b' : '#10b981';

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          itemStyle: {
            color: color,
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          progress: {
            show: true,
            roundCap: true,
            width: 18
          },
          pointer: {
            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 12,
            length: '75%',
            offsetCenter: [0, '5%']
          },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            splitNumber: 2,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            length: 12,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 30,
            color: '#999',
            fontSize: 20
          },
          title: {
            show: false
          },
          detail: {
            backgroundColor: '#fff',
            borderColor: '#999',
            borderWidth: 2,
            width: '60%',
            lineHeight: 40,
            height: 40,
            borderRadius: 8,
            offsetCenter: [0, '35%'],
            valueAnimation: true,
            formatter: function (value) {
              return '{value|' + value.toFixed(1) + '}{unit|%}';
            },
            rich: {
              value: {
                fontSize: 50,
                fontWeight: 'bolder',
                color: color
              },
              unit: {
                fontSize: 20,
                color: '#999',
                padding: [0, 0, -20, 10]
              }
            }
          },
          data: [
            {
              value: value,
              name: metric.toUpperCase()
            }
          ]
        }
      ]
    };
  };

  const handleAddServer = () => {
    setEditingServer(null);
    reset({
      name: '',
      ip: '',
      role: 'web',
      status: 'online'
    });
    setShowModal(true);
  };

  const handleEditServer = (server) => {
    setEditingServer(server);
    reset({
      name: server.name,
      ip: server.ip,
      role: server.role,
      status: server.status
    });
    setShowModal(true);
  };

  const handleDeleteServer = (serverId) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      removeServer(serverId);
      toast.success('Server removed successfully');
    }
  };

  const onSubmit = (data) => {
    if (editingServer) {
      // Update existing server
      const updatedServer = {
        ...editingServer,
        ...data
      };
      // This would typically be a server update function
      toast.success(`Server "${data.name}" updated successfully`);
    } else {
      // Add new server with random stats
      const newServer = {
        id: Date.now(),
        ...data,
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        uptime: '0d 0h 5m'
      };
      addServer(newServer);
      toast.success(`Server "${data.name}" added successfully`);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Server Management</h1>
          <button
            onClick={handleAddServer}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Server
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {servers.map((server) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SafeIcon
                      icon={getServerIcon(server.role)}
                      className="w-5 h-5 text-blue-600"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{server.name}</h3>
                    <p className="text-sm text-gray-500">{server.ip}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    server.status
                  )}`}
                >
                  {server.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Uptime</span>
                  <span className="font-medium">{server.uptime}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Role</span>
                  <span className="font-medium capitalize">{server.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="h-24">
                    <ReactECharts
                      option={createResourceChart(server, 'cpu')}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <SafeIcon icon={FiCpu} className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-600">CPU</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-24">
                    <ReactECharts
                      option={createResourceChart(server, 'memory')}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <SafeIcon icon={FiActivity} className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-600">Memory</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-24">
                    <ReactECharts
                      option={createResourceChart(server, 'disk')}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <SafeIcon icon={FiHardDrive} className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-600">Disk</span>
                  </div>
                </div>
              </div>

              {/* Admin actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditServer(server)}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Server"
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteServer(server.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete Server"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingServer ? 'Edit Server' : 'Add New Server'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
            <input
              type="text"
              {...register('name', { required: 'Server name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter server name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
            <input
              type="text"
              {...register('ip', { 
                required: 'IP address is required',
                pattern: {
                  value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
                  message: 'Enter a valid IP address'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="192.168.1.1"
            />
            {errors.ip && <p className="text-red-500 text-sm mt-1">{errors.ip.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="web">Web Server</option>
              <option value="database">Database Server</option>
              <option value="api">API Server</option>
              <option value="storage">Storage Server</option>
              <option value="backup">Backup Server</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="online">Online</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingServer ? 'Update Server' : 'Add Server'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServersPage;