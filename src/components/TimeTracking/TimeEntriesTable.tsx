import React, { useState } from 'react';
import { TimeEntry } from '../../types/timeTracking';
import { Edit2, Trash2, Save, X, Clock, DollarSign, Calendar, User } from 'lucide-react';

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TimeEntry>) => void;
  formatDuration: (seconds: number) => string;
}

const TimeEntriesTable: React.FC<TimeEntriesTableProps> = ({
  entries,
  onDelete,
  onUpdate,
  formatDuration,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TimeEntry>>({});
  const [sortField, setSortField] = useState<keyof TimeEntry>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const entriesPerPage = 10;

  const handleSort = (field: keyof TimeEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);

  const startEdit = (entry: TimeEntry) => {
    setEditingId(entry.id);
    setEditData({
      taskName: entry.taskName,
      project: entry.project,
      description: entry.description,
      hourlyRate: entry.hourlyRate,
      billable: entry.billable,
    });
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  const calculateTotal = (entry: TimeEntry): number => {
    return (entry.duration / 3600) * entry.hourlyRate;
  };

  const SortableHeader: React.FC<{ field: keyof TimeEntry; children: React.ReactNode }> = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <span className="text-orange-500">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Time Entries Yet</h3>
        <p className="text-gray-500">Start tracking your time to see entries here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Recent Time Entries</h2>
          <div className="text-sm text-gray-500">
            {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader field="taskName">Task</SortableHeader>
              <SortableHeader field="project">Project</SortableHeader>
              <SortableHeader field="startTime">Start Time</SortableHeader>
              <SortableHeader field="endTime">End Time</SortableHeader>
              <SortableHeader field="duration">Duration</SortableHeader>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="hourlyRate">Rate</SortableHeader>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      value={editData.taskName || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, taskName: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <div>
                      <p className="font-medium text-gray-800">{entry.taskName}</p>
                      {entry.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{entry.description}</p>
                      )}
                    </div>
                  )}
                </td>
                
                <td className="py-4 px-6">
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      value={editData.project || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, project: e.target.value }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {entry.project}
                    </span>
                  )}
                </td>
                
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {entry.startTime.toLocaleTimeString()}
                </td>
                
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {entry.endTime ? entry.endTime.toLocaleTimeString() : 'In Progress'}
                </td>
                
                <td className="py-4 px-6">
                  <span className="font-mono text-sm font-medium text-gray-800">
                    {formatDuration(entry.duration)}
                  </span>
                </td>
                
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {entry.date.toLocaleDateString()}
                </td>
                
                <td className="py-4 px-6">
                  {editingId === entry.id ? (
                    <input
                      type="number"
                      value={editData.hourlyRate || 0}
                      onChange={(e) => setEditData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      step="0.01"
                    />
                  ) : (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">
                        {entry.hourlyRate.toFixed(2)}
                      </span>
                    </div>
                  )}
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">
                      {calculateTotal(entry).toFixed(2)}
                    </span>
                  </div>
                  {entry.billable && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                      Billable
                    </span>
                  )}
                </td>
                
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {editingId === entry.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(entry.id)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, sortedEntries.length)} of {sortedEntries.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this time entry? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeEntriesTable;