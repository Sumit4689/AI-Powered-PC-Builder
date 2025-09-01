import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import AdminService from '../services/AdminService';

function AdminDashboard({ isDarkMode, toggleTheme }) {
    const [users, setUsers] = useState([]);
    const [builds, setBuilds] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            try {
                // Use AdminService instead of direct fetch calls
                const [usersData, buildsData] = await Promise.all([
                    AdminService.getAllUsers(),
                    AdminService.getAllBuilds()
                ]);
                
                setUsers(usersData);
                setBuilds(buildsData);
            } catch (apiError) {
                throw new Error(apiError.message || 'Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure? This will delete the user and all their builds.')) {
            try {
                // Use AdminService instead of direct fetch
                await AdminService.deleteUser(userId);
                fetchData(); // Refresh data
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleDeleteBuild = async (buildId) => {
        if (window.confirm('Are you sure you want to delete this build?')) {
            try {
                // Use AdminService instead of direct fetch
                await AdminService.deleteBuild(buildId);
                fetchData(); // Refresh data
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Admin Dashboard</h1>

                {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                    activeTab === 'users'
                                        ? 'border-[var(--accent)] text-[var(--accent)]'
                                        : 'border-transparent text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab('builds')}
                                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                    activeTab === 'builds'
                                        ? 'border-[var(--accent)] text-[var(--accent)]'
                                        : 'border-transparent text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                Builds
                            </button>
                        </nav>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeTab === 'users' ? (
                            <div className="bg-[var(--card-background)] rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.map(user => (
                                            <tr key={user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">
                                                    {user.isAdmin ? 'Admin' : 'User'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={user.isAdmin}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-[var(--card-background)] rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Build Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Cost</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {builds.map(build => (
                                            <tr key={build._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{build.buildName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">{build.user?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[var(--text-primary)]">₹{build.totalCost?.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteBuild(build._id)}
                                                        className="text-red-600 hover:text-red-900"
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
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;