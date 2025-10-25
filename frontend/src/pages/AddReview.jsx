import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comments: ''
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/api/bookings/${bookingId}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comments.trim()) {
      toast.error('Please provide your comments');
      return;
    }

    if (formData.comments.length < 10) {
      toast.error('Comments must be at least 10 characters long');
      return;
    }

    setSubmitting(true);
    
    try {
      await api.post('/api/reviews', {
        booking_id: bookingId,
        rating: formData.rating,
        comments: formData.comments.trim()
      });

      toast.success('Review submitted successfully!');
      navigate('/my-bookings');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
        <p className="text-gray-600">The booking you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (booking.status !== 'completed') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cannot review this booking</h2>
        <p className="text-gray-600">Reviews can only be submitted for completed bookings.</p>
        <button
          onClick={() => navigate('/my-bookings')}
          className="btn-primary mt-4"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/my-bookings')}
          className="btn-secondary p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
          <p className="text-gray-600 mt-2">
            Share your experience with this equipment
          </p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900">{booking.equipment_id?.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{booking.equipment_id?.type}</p>
            <p className="text-sm text-gray-600">{booking.equipment_id?.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Duration:</span> {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Total Amount:</span> ₹{booking.total_amount}
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your experience *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formData.rating === 1 && 'Poor'}
              {formData.rating === 2 && 'Fair'}
              {formData.rating === 3 && 'Good'}
              {formData.rating === 4 && 'Very Good'}
              {formData.rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Share your experience *
            </label>
            <textarea
              id="comments"
              name="comments"
              required
              rows="6"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="input-field"
              placeholder="Tell us about your experience with this equipment. What went well? What could be improved? Any specific features you liked or disliked?"
              maxLength="500"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Minimum 10 characters required
              </p>
              <p className="text-sm text-gray-500">
                {formData.comments.length}/500
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Review Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about what you liked or didn't like</li>
              <li>• Mention the equipment's condition and performance</li>
              <li>• Share any issues you encountered</li>
              <li>• Help other farmers make informed decisions</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={submitting || formData.comments.length < 10}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;

