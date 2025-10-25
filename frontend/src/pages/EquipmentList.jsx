import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Calendar, Tractor } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    availability_status: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.availability_status) params.append('availability_status', filters.availability_status);

      const response = await api.get(`/api/equipment?${params.toString()}`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      availability_status: ''
    });
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const equipmentTypes = [
    'Tractor', 'Harvester', 'Seeder', 'Plough', 'Irrigation', 'Other'
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available' },
    { value: 'rented', label: 'Rented' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Farm Equipment</h1>
          <p className="text-gray-600 mt-2">
            Find the perfect equipment for your farming needs
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-4 py-1 text-sm"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability_status}
                  onChange={(e) => setFilters({ ...filters, availability_status: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  {availabilityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Filter Actions */}
          {showFilters && (
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear all filters
              </button>
              <span className="text-sm text-gray-500">
                {equipment.length} equipment found
              </span>
            </div>
          )}
        </form>
      </div>

      {/* Equipment Grid */}
      {equipment.length === 0 ? (
        <div className="text-center py-20">
          <Tractor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.map((item) => (
            <div key={item._id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={`/equipment/${item.slug || item._id}`}>
                {/* Equipment Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Tractor className="h-16 w-16 text-gray-400" />
                  )}
                </div>

                {/* Equipment Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {item.type}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.location}
                    </span>
                    <span className="font-semibold text-primary-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ₹{item.price_per_day}/day
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.availability_status)}`}>
                      {item.availability_status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Owner: {item.owner_id?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
