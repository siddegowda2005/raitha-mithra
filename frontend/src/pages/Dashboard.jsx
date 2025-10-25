import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tractor, Calendar, Star, Plus, Eye, MapPin, DollarSign } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isFarmer, isOwner } = useAuth();
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      console.log('User data available, fetching dashboard data...');
      fetchDashboardData();
    } else {
      console.log('No user data available, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Fetching dashboard data...');
      console.log('User:', user);
      console.log('Token:', token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Fetch bookings
      console.log('Fetching bookings...');
      const bookingsResponse = await api.get('/api/bookings');
      const bookings = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [];
      console.log('Bookings fetched:', bookings);
      
      // Fetch equipment (if owner)
      let equipment = [];
      if (isOwner) {
        try {
          console.log('Fetching equipment for owner...');
          const equipmentResponse = await api.get('/api/equipment/owner/my-equipment');
          equipment = Array.isArray(equipmentResponse.data) ? equipmentResponse.data : [];
          console.log('Equipment fetched:', equipment);
        } catch (equipmentError) {
          console.error('Error fetching equipment:', equipmentError);
          toast.error('Failed to load equipment data');
        }
      }

      // Calculate stats
      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const totalEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0);

      setStats({
        totalEquipment: equipment.length,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalEarnings
      });

      // Sort bookings by date (newest first) and take the first 5
      const sortedBookings = [...bookings].sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
      setRecentBookings(sortedBookings.slice(0, 5));
      
      // Sort equipment by date (newest first) and take the first 5
      const sortedEquipment = [...equipment].sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
      setRecentEquipment(sortedEquipment.slice(0, 5));
      
      console.log('Dashboard data loaded successfully');
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Set default values to prevent UI errors
      setStats({
        totalEquipment: 0,
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        totalEarnings: 0
      });
      setRecentBookings([]);
      setRecentEquipment([]);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-600 text-lg mb-4">Error loading dashboard</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show empty state if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-600">Please log in to view dashboard</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          {isFarmer 
            ? "Ready to find the perfect equipment for your farming needs?" 
            : "Manage your equipment and rental requests efficiently."
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Tractor className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isFarmer && (
            <>
              <Link
                to="/equipment"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Tractor className="h-6 w-6 text-primary-600 mr-3" />
                <span className="font-medium">Browse Equipment</span>
              </Link>
              <Link
                to="/my-bookings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Calendar className="h-6 w-6 text-primary-600 mr-3" />
                <span className="font-medium">View Bookings</span>
              </Link>
            </>
          )}
          
          {isOwner && (
            <>
              <Link
                to="/add-equipment"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Plus className="h-6 w-6 text-primary-600 mr-3" />
                <span className="font-medium">Add Equipment</span>
              </Link>
              <Link
                to="/my-bookings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Calendar className="h-6 w-6 text-primary-600 mr-3" />
                <span className="font-medium">Manage Requests</span>
              </Link>
            </>
          )}
          
          <Link
            to="/equipment"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Eye className="h-6 w-6 text-primary-600 mr-3" />
            <span className="font-medium">View All Equipment</span>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              to="/my-bookings"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Tractor className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {booking.equipment_id?.name || 'Equipment'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{booking.total_amount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Equipment (Owner Only) */}
      {isOwner && recentEquipment.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Equipment</h2>
            <Link
              to="/add-equipment"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Add New
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEquipment.map((equipment) => (
              <div key={equipment._id} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <Link to={`/equipment/${equipment.slug || equipment._id}`} className="block">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Tractor className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{equipment.name}</h3>
                        <p className="text-sm text-gray-600">{equipment.type}</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {equipment.location}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{equipment.price_per_day}/day
                  </span>
                </div>
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    equipment.availability_status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {equipment.availability_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
