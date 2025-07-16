import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import StatsCard from '../components/common/StatsCard';
import { useSystem } from '../contexts/SystemContext';

const { FiCpu, FiHardDrive, FiActivity, FiWifi } = FiIcons;

const SystemMonitoringPage = () => {
  const { systemStats } = useSystem();
  const [historicalData, setHistoricalData] = useState({
    cpu: [],
    memory: [],
    disk: [],
    network: []
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();

      setHistoricalData(prev => ({
        cpu: [...prev.cpu.slice(-19), { time: timeLabel, value: systemStats.cpu }],
        memory: [...prev.memory.slice(-19), { time: timeLabel, value: systemStats.memory }],
        disk: [...prev.disk.slice(-19), { time: timeLabel, value: systemStats.disk }],
        network: [...prev.network.slice(-19), { time: timeLabel, in: systemStats.network.in, out: systemStats.network.out }]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [systemStats]);

  const cpuChartOptions = {
    title: { text: 'CPU Usage (%)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: historicalData.cpu.map(d => d.time),
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      data: historicalData.cpu.map(d => d.value),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3, color: '#3b82f6' },
      lineStyle: { color: '#3b82f6' }
    }]
  };

  const memoryChartOptions = {
    title: { text: 'Memory Usage (%)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: historicalData.memory.map(d => d.time),
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      data: historicalData.memory.map(d => d.value),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3, color: '#10b981' },
      lineStyle: { color: '#10b981' }
    }]
  };

  const diskChartOptions = {
    title: { text: 'Disk Usage (%)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: historicalData.disk.map(d => d.time),
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      data: historicalData.disk.map(d => d.value),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.3, color: '#f59e0b' },
      lineStyle: { color: '#f59e0b' }
    }]
  };

  const networkChartOptions = {
    title: { text: 'Network Traffic (KB/s)', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Incoming', 'Outgoing'], top: 30 },
    xAxis: {
      type: 'category',
      data: historicalData.network.map(d => d.time),
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value', min: 0 },
    series: [
      {
        name: 'Incoming',
        data: historicalData.network.map(d => d.in),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#8b5cf6' }
      },
      {
        name: 'Outgoing',
        data: historicalData.network.map(d => d.out),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#ef4444' }
      }
    ]
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">System Monitoring</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="CPU Usage"
            value={`${systemStats.cpu.toFixed(1)}%`}
            icon={FiCpu}
            color="blue"
          />
          <StatsCard
            title="Memory Usage"
            value={`${systemStats.memory.toFixed(1)}%`}
            icon={FiActivity}
            color="green"
          />
          <StatsCard
            title="Disk Usage"
            value={`${systemStats.disk.toFixed(1)}%`}
            icon={FiHardDrive}
            color="yellow"
          />
          <StatsCard
            title="Network I/O"
            value={`${(systemStats.network.in + systemStats.network.out).toFixed(0)} KB/s`}
            icon={FiWifi}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ReactECharts option={cpuChartOptions} style={{ height: '300px' }} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ReactECharts option={memoryChartOptions} style={{ height: '300px' }} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ReactECharts option={diskChartOptions} style={{ height: '300px' }} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ReactECharts option={networkChartOptions} style={{ height: '300px' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemMonitoringPage;