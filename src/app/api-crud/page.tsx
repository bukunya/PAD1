'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApiCrudPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users?limit=100');
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/users', formData);
      setSuccess(response.data.message);
      setFormData({ name: '', email: '', role: 'user' });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.patch('/api/users', {
        id: editingUser.id,
        ...formData,
      });
      setSuccess(response.data.message);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'user' });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.delete(`/api/users?id=${id}`);
      setSuccess(response.data.message);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRUD Operations with API Routes
          </h1>
          <p className="text-gray-600 mb-6">
            Full Create, Read, Update, Delete using REST API endpoints
          </p>

          {/* Explanation Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">🔍 How API Routes Work</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">POST</span>
                  Create User
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  When you submit the form, your data is sent via <code className="bg-gray-100 px-1 rounded">axios.post()</code> 
                  to the <code className="bg-gray-100 px-1 rounded">/api/users</code> endpoint using the <strong>POST method</strong>.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: axios sends HTTP POST request with JSON body</li>
                  <li>• Server: API route handler validates data</li>
                  <li>• Database: Prisma creates new record</li>
                  <li>• Response: Returns created user with 201 status</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">GET</span>
                  Read Users
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  The table fetches data using <code className="bg-gray-100 px-1 rounded">axios.get()</code> 
                  from <code className="bg-gray-100 px-1 rounded">/api/users</code> using the <strong>GET method</strong>.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: axios sends HTTP GET request</li>
                  <li>• Server: API route handler queries database</li>
                  <li>• Database: Prisma finds all matching records</li>
                  <li>• Response: Returns array of users with 200 status</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-yellow-700 mb-2 flex items-center">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-2">PATCH</span>
                  Update User
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Click "Edit" to modify a user. Data is sent via <code className="bg-gray-100 px-1 rounded">axios.patch()</code> 
                  to <code className="bg-gray-100 px-1 rounded">/api/users</code> using the <strong>PATCH method</strong>.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: axios sends HTTP PATCH with updated fields</li>
                  <li>• Server: API route validates and checks existence</li>
                  <li>• Database: Prisma updates specified fields only</li>
                  <li>• Response: Returns updated user with 200 status</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs mr-2">DELETE</span>
                  Delete User
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Click "Delete" to remove a user. The ID is sent via <code className="bg-gray-100 px-1 rounded">axios.delete()</code> 
                  to <code className="bg-gray-100 px-1 rounded">/api/users?id=X</code> using the <strong>DELETE method</strong>.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: axios sends HTTP DELETE with ID in query params</li>
                  <li>• Server: API route validates ID and checks existence</li>
                  <li>• Database: Prisma permanently removes record</li>
                  <li>• Response: Returns success message with 200 status</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Key Point:</strong> Each operation uses a different HTTP method (POST, GET, PATCH, DELETE) 
                but they all go to the same <code className="bg-white px-1 rounded">/api/users</code> route. 
                Next.js automatically routes to the correct handler function based on the method!
              </p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✅ {success}
            </div>
          )}

          {/* Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingUser ? '✏️ Update User' : '➕ Create New User'}
            </h2>
            <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {editingUser ? '💾 Update User' : '➕ Create User'}
                </button>
                {editingUser && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Users Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">👥 Users List</h2>
            {loading && !users.length ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
