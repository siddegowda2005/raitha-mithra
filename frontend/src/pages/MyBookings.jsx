import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Tractor, User, MapPin, DollarSign, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { user, isFarmer, isOwner } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking status';
      toast.error(message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/api/bookings/${bookingId}`);
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to cancel booking';
        toast.error(message);
      }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredBookings = selectedStatus 
    ? bookings.filter(booking => booking.status === selectedStatus)
    : bookings;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            {isFarmer 
              ? 'Track your equipment rental requests' 
              : 'Manage equipment rental requests from farmers'
            }
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === '' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({bookings.length})
          </button>
          {['pending', 'approved', 'completed', 'rejected', 'cancelled'].map(status => {
            const count = bookings.filter(b => b.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="card text-center py-20">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {selectedStatus 
              ? `No ${selectedStatus} bookings` 
              : 'You haven\'t made any bookings yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Equipment Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tractor className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {booking.equipment_id?.name || 'Equipment'}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">
                      {booking.equipment_id?.type || 'Type'}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.equipment_id?.location || 'Location'}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-primary-600">
                      ₹{booking.total_amount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </span>
                  </div>
                </div>

                {/* User Info & Actions */}
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="border-l pl-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {isFarmer ? 'Equipment Owner' : 'Renter'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {isFarmer 
                            ? booking.owner_id?.name || 'Owner' 
                            : booking.renter_id?.name || 'Renter'
                          }
                        </p>
                        <p className="text-xs text-gray-600">
                          {isFarmer 
                            ? booking.owner_id?.phone || 'Phone' 
                            : booking.renter_id?.phone || 'Phone'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {isOwner && booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'approved')}
                          className="btn-primary text-sm py-2 px-3 flex-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                          className="btn-danger text-sm py-2 px-3 flex-1"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {isOwner && booking.status === 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        className="btn-primary text-sm py-2 px-3 w-full"
                      >
                        Mark Complete
                      </button>
                    )}

                    {isFarmer && booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn-danger text-sm py-2 px-3 w-full"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {isFarmer && booking.status === 'completed' && (
                      <Link
                        to={`/add-review/${booking._id}`}
                        className="btn-secondary text-sm py-2 px-3 w-full flex items-center justify-center space-x-2"
                      >
                        <Star className="h-4 w-4" />
                        <span>Add Review</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

