import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Plus, Upload } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddEquipment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    price_per_day: '',
    location: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  const equipmentTypes = [
    'Tractor', 'Harvester', 'Seeder', 'Plough', 'Irrigation', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.description || !formData.price_per_day || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price_per_day <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending equipment data:', formData);
      const response = await api.post('/api/equipment', formData);
      console.log('Equipment response:', response.data);
      toast.success('Equipment added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Equipment error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Failed to add equipment';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Equipment</h1>
        <p className="text-gray-600 mt-2">
          List your farm equipment for farmers to rent
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., John Deere Tractor 5075E"
            />
          </div>

          {/* Equipment Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select equipment type</option>
              {equipmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Describe your equipment, its features, condition, and any special requirements..."
            />
          </div>

          {/* Price per Day */}
          <div>
            <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700 mb-2">
              Price per Day (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                id="price_per_day"
                name="price_per_day"
                required
                min="0"
                step="0.01"
                value={formData.price_per_day}
                onChange={handleChange}
                className="input-field pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Village, District, State"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                className="btn-secondary px-4 py-2"
                onClick={() => setFormData({ ...formData, image_url: '' })}
              >
                Clear
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Provide a direct link to an image of your equipment
            </p>
          </div>

          {/* Preview */}
          {formData.image_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Equipment preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center text-gray-500">
                  <Upload className="h-8 w-8 mr-2" />
                  <span>Invalid image URL</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Equipment...' : 'Add Equipment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="card mt-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Tips for better listings:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use clear, descriptive names for your equipment</li>
          <li>• Include detailed descriptions with specifications and condition</li>
          <li>• Set competitive pricing based on market rates</li>
          <li>• Provide clear location information</li>
          <li>• Add high-quality images to attract more renters</li>
        </ul>
      </div>
    </div>
  );
};

export default AddEquipment;

