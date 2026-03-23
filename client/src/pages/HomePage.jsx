import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Map, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto mb-6">
          Find the perfect local tutor right in your neighborhood.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Tutorly connects students and parents with top-rated college students nearby for face-to-face learning.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto">
          <Link to="/search" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-blue-200 transition-all">
            <Search size={20} />
            Search Near Me
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-medium shadow-sm transition-all">
            Become a Tutor
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Location Based</h3>
          <p className="text-gray-600">Discover tutors within a 10km radius of your home or school.</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Top College Talent</h3>
          <p className="text-gray-600">Learn from motivated college students who excel in their fields.</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Map size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Interactive Map View</h3>
          <p className="text-gray-600">See exactly how close your potential tutors are using our interactive map.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
