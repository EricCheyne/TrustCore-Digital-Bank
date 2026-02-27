import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import Navbar from '../../components/Navbar';

interface AuditLog {
  id: number;
  serviceName: string;
  action: string;
  username: string;
  details: string;
  timestamp: string;
}

export default function RiskAlerts() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/audit/api/audit/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  const blocked = useMemo(() => logs.filter(l => l.action.includes('BLOCKED')), [logs]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Center</h1>
          <p className="text-gray-600 mb-6">AI-driven fraud detection and transaction risk alerts.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded p-4">
              <div className="text-sm text-gray-500">Total Alerts</div>
              <div className="text-2xl font-semibold">{blocked.length}</div>
            </div>
            <div className="bg-white shadow rounded p-4">
              <div className="text-sm text-gray-500">24h New</div>
              <div className="text-2xl font-semibold">{
                blocked.filter(b => (Date.now() - new Date(b.timestamp).getTime()) < 24*3600*1000).length
              }</div>
            </div>
            <div className="bg-white shadow rounded p-4">
              <div className="text-sm text-gray-500">Blocking Policy</div>
              <div className="text-md font-medium">Risk score &gt; 0.7</div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
                ) : blocked.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center">No risk alerts</td></tr>
                ) : (
                  blocked.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
