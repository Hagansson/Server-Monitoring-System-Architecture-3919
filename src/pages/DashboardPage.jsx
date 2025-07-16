import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import StatsCard from '../components/common/StatsCard';
import { useSystem } from '../contexts/SystemContext';
import ReactECharts from 'echarts-for-react';

const { FiServer, FiActivity, FiAlertTriangle, FiUsers } = FiIcons;

const DashboardPage = () => {
  const { systemStats, servers } = useSystem();

  const onlineServers = servers.filter(s => s.status === 'online').length;
  const warningServers = servers.filter(s => s.status === 'warning').length;
  const errorServers = servers.filter(s => s.status === 'error').length;

  const cpuChartOptions = {
    title: { text: 'CPU Usage', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] },
    yAxis: { type: 'value', max: 100 },
    series: [{
      data: [45, 52, 48, 67, 73, 65],
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 }
    }]
  };

  const memoryChartOptions = {
    title: { text: 'Memory Usage', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] },
    yAxis: { type: 'value', max: 100 },
    series: [{
      data: [62, 58, 65, 71, 78, 82],
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3 }
    }]
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Online Servers"
            value={onlineServers}
            icon={FiServer}
            color="green"
            trend={{ positive: true, value: '+2 from yesterday' }}
          />
          <StatsCard
            title="CPU Usage"
            value={`${systemStats.cpu.toFixed(1)}%`}
            icon={FiActivity}
            color="blue"
          />
          <StatsCard
            title="Memory Usage"
            value={`${systemStats.memory.toFixed(1)}%`}
            icon={FiActivity}
            color="purple"
          />
          <StatsCard
            title="Warnings"
            value={warningServers}
            icon={FiAlertTriangle}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ReactECharts option={cpuChartOptions} style={{ height: '300px' }} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ReactECharts option={memoryChartOptions} style={{ height: '300px' }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Server Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {servers.map((server) => (
                  <tr key={server.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{server.name}</div>
                        <div className="text-sm text-gray-500">{server.ip}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        server.status === 'online' ? 'bg-green-100 text-green-800' :
                        server.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {server.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {server.cpu.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {server.memory.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {server.uptime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;