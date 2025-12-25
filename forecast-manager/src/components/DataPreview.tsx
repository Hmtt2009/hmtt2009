import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getDataFrame } from '../python/pyodide';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DataPreview() {
  const { pyodideReady } = useGameStore();
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
  const [dataFrame, setDataFrame] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const rowsPerPage = 20;
  const totalPages = Math.ceil(dataFrame.length / rowsPerPage);
  const startRow = currentPage * rowsPerPage;
  const endRow = Math.min(startRow + rowsPerPage, dataFrame.length);
  const currentRows = dataFrame.slice(startRow, endRow);

  const loadDataFrame = async () => {
    if (!pyodideReady) return;

    setLoading(true);
    try {
      const data = await getDataFrame('df');
      if (data && data.length > 0) {
        setDataFrame(data);
      }
    } catch (error) {
      console.error('Error loading DataFrame:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pyodideReady) {
      loadDataFrame();
    }
  }, [pyodideReady]);

  const columns = currentRows.length > 0 ? Object.keys(currentRows[0]) : [];

  // Prepare chart data
  const chartData = dataFrame.slice(0, 100).map((row, idx) => ({
    index: idx,
    quantity: row.quantity || 0,
    value: row.value || 0,
  }));

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Data Preview
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeTab === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeTab === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Chart
          </button>
          <button
            onClick={loadDataFrame}
            disabled={!pyodideReady || loading}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'table' ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              {currentRows.length === 0 ? (
                <div className="p-4 text-slate-500 italic text-center">
                  No data available. Run code with a DataFrame to see data here.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 sticky top-0">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-700"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800 hover:bg-slate-800/50"
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="px-4 py-2 text-slate-300 font-mono text-xs"
                          >
                            {String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Showing {startRow + 1}-{endRow} of {dataFrame.length} rows
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-slate-300">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-4">
            {chartData.length === 0 ? (
              <div className="text-slate-500 italic text-center pt-8">
                No data available for chart. Run code with a DataFrame first.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="index"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '4px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
