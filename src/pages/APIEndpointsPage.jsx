import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Modal from '../components/common/Modal';
import { apiService } from '../services/apiService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const { FiPlus, FiPlay, FiCode, FiEdit2, FiTrash2, FiCheck, FiX, FiClock } = FiIcons;

const APIEndpointsPage = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [testResults, setTestResults] = useState({});
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      const data = await apiService.getEndpoints();
      setEndpoints(data);
    } catch (error) {
      toast.error('Failed to fetch endpoints');
    }
  };

  const handleCreateEndpoint = () => {
    setEditingEndpoint(null);
    reset();
    setShowModal(true);
  };

  const handleEditEndpoint = (endpoint) => {
    setEditingEndpoint(endpoint);
    reset({
      name: endpoint.name,
      method: endpoint.method,
      path: endpoint.path,
      description: endpoint.description
    });
    setShowModal(true);
  };

  const handleDeleteEndpoint = async (endpointId) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      try {
        await apiService.deleteEndpoint(endpointId);
        setEndpoints(endpoints.filter(e => e.id !== endpointId));
        toast.success('Endpoint deleted successfully');
      } catch (error) {
        toast.error('Failed to delete endpoint');
      }
    }
  };

  const handleTestEndpoint = async (endpointId) => {
    try {
      const result = await apiService.testEndpoint(endpointId);
      setTestResults({ ...testResults, [endpointId]: result });
      
      if (result.success) {
        toast.success('Endpoint test successful');
      } else {
        toast.error('Endpoint test failed');
      }
      
      // Update endpoint status in the list
      setEndpoints(endpoints.map(ep => 
        ep.id === endpointId 
          ? { ...ep, status: result.success ? 'active' : 'error', responseTime: result.responseTime }
          : ep
      ));
    } catch (error) {
      toast.error('Failed to test endpoint');
    }
  };

  const handleGenerateCode = (endpoint) => {
    const code = apiService.generateCSharpCode(endpoint);
    setGeneratedCode(code);
    setShowCodeModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingEndpoint) {
        const updatedEndpoint = await apiService.updateEndpoint(editingEndpoint.id, data);
        setEndpoints(endpoints.map(e => e.id === editingEndpoint.id ? updatedEndpoint : e));
        toast.success('Endpoint updated successfully');
      } else {
        const newEndpoint = await apiService.createEndpoint(data);
        setEndpoints([...endpoints, newEndpoint]);
        toast.success('Endpoint created successfully');
      }
      setShowModal(false);
      reset();
    } catch (error) {
      toast.error('Failed to save endpoint');
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />;
      case 'error': return <SafeIcon icon={FiX} className="w-4 h-4 text-red-600" />;
      default: return <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-600" />;
    }
  };

  // Function to display test results in a formatted way
  const renderTestResult = (result) => {
    if (!result) return null;
    
    return (
      <pre className="text-xs bg-gray-50 p-3 rounded mt-2 max-h-32 overflow-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">API Endpoints</h1>
          <button
            onClick={handleCreateEndpoint}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Endpoint
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Endpoints ({endpoints.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {endpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{endpoint.name}</div>
                        <div className="text-sm text-gray-500">{endpoint.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(endpoint.status)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">{endpoint.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {endpoint.responseTime ? `${endpoint.responseTime}ms` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTestEndpoint(endpoint.id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Test Endpoint"
                        >
                          <SafeIcon icon={FiPlay} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleGenerateCode(endpoint)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                          title="Generate C# Code"
                        >
                          <SafeIcon icon={FiCode} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditEndpoint(endpoint)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEndpoint(endpoint.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                      {testResults[endpoint.id] && (
                        <div className="mt-2 text-xs">
                          <span className={testResults[endpoint.id].success ? "text-green-600" : "text-red-600"}>
                            {testResults[endpoint.id].success ? "Success" : "Failed"}: {testResults[endpoint.id].status}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {endpoints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No endpoints found. Create your first endpoint to get started.</p>
            </div>
          )}
        </div>
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEndpoint ? 'Edit Endpoint' : 'Add New Endpoint'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter endpoint name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select
              {...register('method', { required: 'Method is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select method</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            {errors.method && <p className="text-red-500 text-sm mt-1">{errors.method.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
            <input
              type="text"
              {...register('path', { required: 'Path is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/api/endpoint"
            />
            {errors.path && <p className="text-red-500 text-sm mt-1">{errors.path.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter endpoint description"
            />
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
              {editingEndpoint ? 'Update Endpoint' : 'Create Endpoint'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Generated C# Code"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              Copy this C# controller code and paste it into your ASP.NET Core project:
            </p>
            <SyntaxHighlighter
              language="csharp"
              style={tomorrow}
              customStyle={{
                maxHeight: '400px',
                overflow: 'auto',
                fontSize: '12px'
              }}
            >
              {generatedCode}
            </SyntaxHighlighter>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                toast.success('Code copied to clipboard');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default APIEndpointsPage;