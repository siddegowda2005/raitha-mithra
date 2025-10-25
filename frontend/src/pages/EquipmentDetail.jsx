import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tractor, MapPin, DollarSign, Calendar, Star, User, Phone, Clock } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EquipmentDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isFarmer } = useAuth();
  const navigate = useNavigate();
  
  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchEquipmentDetails();
    fetchReviews();
  }, [id]);

  const fetchEquipmentDetails = async () => {
    try {
      // The backend route handles both ID and slug formats
      const response = await api.get(`/api/equipment/${id}`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Only fetch reviews if we have the equipment data with a valid ID
      if (equipment && equipment._id) {
        const response = await api.get(`/api/reviews/equipment/${equipment._id}`);
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to book equipment');
      navigate('/login');
      return;
    }

    if (!isFarmer) {
      toast.error('Only farmers can book equipment');
      return;
    }

    if (!bookingData.start_date || !bookingData.end_date) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      const totalAmount = calculateTotal();
      console.log('Submitting booking with data:', {
        equipment_id: equipment._id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date
        // Note: total_amount is calculated on the server
      });
      
      const response = await api.post('/api/bookings', {
        equipment_id: equipment._id, // Use the actual equipment ID from the fetched data
        start_date: bookingData.start_date,
        end_date: bookingData.end_date
        // Removed total_amount as it's calculated in the backend pre-save hook
      });

      toast.success('Booking request submitted successfully!');
      setShowBookingForm(false);
      setBookingData({ start_date: '', end_date: '' });
      
      // Refresh equipment details to update availability
      fetchEquipmentDetails();
    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'Failed to submit booking';
      
      if (error.response) {
        // Handle validation errors
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        console.error('Error response:', error.response.data);
      }
      
      toast.error(errorMessage);
    }
  };

  const calculateDays = () => {
    if (bookingData.start_date && bookingData.end_date) {
      const start = new Date(bookingData.start_date);
      const end = new Date(bookingData.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    return days * (equipment?.price_per_day || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Equipment not found</h2>
        <p className="text-gray-600">The equipment you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Equipment Header */}
      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipment Image */}
          <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            {equipment.image_url ? (
              <img
                src={equipment.image_url}
                alt={equipment.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Tractor className="h-24 w-24 text-gray-400" />
            )}
          </div>

          {/* Equipment Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {equipment.name}
              </h1>
              <p className="text-lg text-gray-600 capitalize">
                {equipment.type}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {equipment.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <span>{equipment.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-5 w-5 mr-3" />
                <span className="text-2xl font-bold text-primary-600">
                  ₹{equipment.price_per_day}
                </span>
                <span className="ml-2">per day</span>
              </div>

              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  equipment.availability_status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {equipment.availability_status}
                </span>
              </div>
            </div>

            {/* Owner Info */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Equipment Owner</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{equipment.owner_id?.name}</p>
                  <p className="text-sm text-gray-600">{equipment.owner_id?.location}</p>
                </div>
              </div>
            </div>

            {/* Booking Button */}
            {equipment.availability_status === 'available' && isFarmer && (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full btn-primary py-3 text-lg"
              >
                Book This Equipment
              </button>
            )}

            {!isFarmer && (
              <p className="text-gray-600 text-center py-4">
                Only farmers can book equipment
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Equipment</h2>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingData.start_date}
                  onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingData.end_date}
                  onChange={(e) => setBookingData({ ...bookingData, end_date: e.target.value })}
                  className="input-field"
                  min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Booking Summary */}
            {calculateDays() > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span>{calculateDays()} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price per day:</span>
                  <span>₹{equipment.price_per_day}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-primary-600">₹{calculateTotal()}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {review.renter_id?.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comments}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetail;

