'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getUsersServerAction,
  createUserServerAction,
  updateUserServerAction,
  deleteUserServerAction,
} from '../actions/users';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ServerCrudPage() {
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
      const data = await getUsersServerAction(1, 100);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
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
      const result = await createUserServerAction(formData);
      setSuccess(result.message);
      setFormData({ name: '', email: '', role: 'user' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
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
      const result = await updateUserServerAction({
        id: editingUser.id,
        ...formData,
      });
      setSuccess(result.message);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'user' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
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
      const result = await deleteUserServerAction(id);
      setSuccess(result.message);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-block mb-6 text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRUD Operations with Server Actions
          </h1>
          <p className="text-gray-600 mb-6">
            Full Create, Read, Update, Delete using &apos;use server&apos; functions
          </p>

          {/* Explanation Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-purple-900 mb-4">🔍 How Server Actions Work</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">CREATE</span>
                  Create User
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  When you submit the form, the client directly calls <code className="bg-gray-100 px-1 rounded">createUserServerAction()</code>. 
                  Next.js automatically handles the server communication!
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: Calls function marked with &apos;use server&apos;</li>
                  <li>• Next.js: Automatically creates a POST endpoint</li>
                  <li>• Server: Function executes, validates data</li>
                  <li>• Database: Prisma creates new record</li>
                  <li>• Return: Data automatically serialized to client</li>
                </ul>
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <strong>No axios needed!</strong> Just call the function like any other TypeScript function.
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">READ</span>
                  Read Users
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  The table fetches data by calling <code className="bg-gray-100 px-1 rounded">getUsersServerAction()</code>. 
                  It looks like a regular function call, but executes on the server!
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: Calls function with parameters (page, limit)</li>
                  <li>• Next.js: Routes to server-side execution</li>
                  <li>• Server: Function queries database with Prisma</li>
                  <li>• Return: Results automatically sent back to client</li>
                </ul>
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <strong>Type-safe!</strong> TypeScript knows the exact return type automatically.
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-yellow-700 mb-2 flex items-center">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-2">UPDATE</span>
                  Update User
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Click "Edit" to modify a user. The form calls <code className="bg-gray-100 px-1 rounded">updateUserServerAction()</code> 
                  with the updated data object.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: Calls function with ID and updated fields</li>
                  <li>• Next.js: Handles serialization automatically</li>
                  <li>• Server: Validates and updates in database</li>
                  <li>• Return: Updated user returned to client</li>
                </ul>
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <strong>Less code!</strong> No need to manually construct HTTP requests.
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs mr-2">DELETE</span>
                  Delete User
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Click "Delete" to remove a user. Simply call <code className="bg-gray-100 px-1 rounded">deleteUserServerAction(id)</code> 
                  with the user ID. That&apos;s it!
                </p>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• Client: Calls function with just the user ID</li>
                  <li>• Next.js: Securely executes on server</li>
                  <li>• Server: Validates and deletes from database</li>
                  <li>• Return: Success message sent back</li>
                </ul>
                <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                  <strong>Secure by default!</strong> Database logic never exposed to client.
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-900">
                <strong>💡 Key Point:</strong> Server Actions feel like regular functions but run on the server! 
                Next.js handles all the HTTP communication, serialization, and type safety automatically. 
                You just write <code className="bg-white px-1 rounded">await functionName()</code> and it works!
              </p>
            </div>

            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-900">
                <strong>⚡ Performance Note:</strong> Server Actions can be optimized by Next.js for progressive 
                enhancement and work even without JavaScript enabled (when used with forms)!
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
                            className="text-purple-600 hover:text-purple-800 font-medium"
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
