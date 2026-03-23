import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Star } from 'lucide-react';
import { getNearbyTutors } from '../services/tutorService';
import { SUBJECT_OPTIONS, CLASS_LEVEL_OPTIONS } from '../utils/constants';

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    subject: '',
    classLevel: '',
    maxDistance: 10000 // 10km default
  });

  const handleLocationSearch = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getNearbyTutors(latitude, longitude, filters);
          setTutors(data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch nearby tutors');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Search Header */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-6 items-end justify-between">
        <div className="flex-1 w-full relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location Detection</label>
          <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl flex items-center gap-3">
             <MapPin className="text-brand-600" size={24}/>
             <div>
                <p className="font-medium text-brand-900">Find Tutors Near Me</p>
                <p className="text-sm text-brand-700">We'll use your browser's location to find tutors within {filters.maxDistance / 1000}km.</p>
             </div>
          </div>
        </div>
        
        <button 
          onClick={handleLocationSearch}
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg w-full md:w-auto md:min-w-[200px] h-min flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? 'Locating...' : (
            <>
              <Search size={20} />
              Search Tutors
            </>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 text-gray-500 font-medium mr-4">
          <Filter size={18} /> Filters:
        </div>
        
        <select 
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          value={filters.subject}
          onChange={(e) => setFilters({...filters, subject: e.target.value})}
        >
          <option value="">All Subjects</option>
          {SUBJECT_OPTIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>

        <select 
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          value={filters.classLevel}
          onChange={(e) => setFilters({...filters, classLevel: e.target.value})}
        >
          <option value="">All Class Levels</option>
          {CLASS_LEVEL_OPTIONS.map(level => <option key={level} value={level}>{level}</option>)}
        </select>

        <select 
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          value={filters.maxDistance}
          onChange={(e) => setFilters({...filters, maxDistance: e.target.value})}
        >
          <option value={5000}>Within 5 km</option>
          <option value={10000}>Within 10 km</option>
          <option value={20000}>Within 20 km</option>
          <option value={50000}>Within 50 km</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 mx-auto text-center border border-red-100 font-medium">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutors.map(tutor => (
          <div key={tutor._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft card-hover flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-2xl shadow-sm">
                {tutor.user.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1 border border-gray-200">
                <MapPin size={14} className="text-brand-500" />
                {(tutor.distance / 1000).toFixed(1)} km
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-2xl text-gray-900 tracking-tight">{tutor.user.name}</h3>
              {tutor.numReviews > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-yellow-500" />
                  {tutor.averageRating.toFixed(1)} ({tutor.numReviews})
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4 mt-2">
              {tutor.subjects.slice(0, 3).map(sub => (
                <span key={sub} className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                  {sub}
                </span>
              ))}
              {tutor.subjects.length > 3 && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                  +{tutor.subjects.length - 3} more
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-8 flex-grow line-clamp-3">{tutor.bio}</p>
            
            <Link 
              to={`/tutor/${tutor.user._id}`} 
              className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl transition-colors border border-gray-200 mt-auto"
            >
              View Full Profile
            </Link>
          </div>
        ))}

        {tutors.length === 0 && !loading && !error && (
          <div className="col-span-full py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6 border border-gray-100">
              <MapPin size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to find a tutor?</h3>
            <p className="text-gray-500 max-w-md mx-auto">Click the search button above to find amazing local tutors in your immediate area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
