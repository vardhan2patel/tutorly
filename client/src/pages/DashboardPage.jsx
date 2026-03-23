import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIncomingRequests, updateRequestStatus, getMyRequests } from '../services/requestService'; // Added getMyRequests
import { getMyTutorProfile } from '../services/tutorService'; // Removed getTutorProfile
import { getMyBookings, updateBookingStatus } from '../services/bookingService'; // New imports
import { CheckCircle, XCircle, Clock, BookOpen, User, Book, MessageCircle, Calendar } from 'lucide-react'; // Added new icons
import { Link } from 'react-router-dom'; // New import

const DashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]); // New state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state
  const [activeTab, setActiveTab] = useState('requests'); // New state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) return;

        if (user.role === 'tutor') {
          const [reqs, prof] = await Promise.all([
            getIncomingRequests(),
            getMyTutorProfile().catch(() => null) // Ignore 404 if no profile created yet
          ]);
          setRequests(reqs);
          setProfile(prof);
        } else { // Student role
          const [myReqs, myBookings] = await Promise.all([
            getMyRequests(),
            getMyBookings()
          ]);
          setRequests(myReqs);
          setBookings(myBookings);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      setRequests(requests.map(req => 
        req._id === id ? { ...req, status } : req
      ));
    } catch (err) {
      alert('Failed to update request');
      console.error('Failed to update request status', err);
    }
  };

  const handleUpdateBooking = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(book => 
        book._id === bookingId ? { ...book, status } : book
      ));
    } catch (err) {
      console.error('Failed to update booking status', err);
      alert('Failed to update booking status');
    }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!user) return <div className="text-center py-20">Please log in to view your dashboard.</div>;


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-gray-600 mt-1">Manage your Tutorly activity from your central hub.</p>
      </div>

      {/* Tabs for Student/Tutor */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2
              ${activeTab === 'requests' ? 'border-brand-500 text-brand-600 bg-brand-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Clock size={18}/> {user.role === 'tutor' ? 'Student Requests' : 'My Requests'}
          </button>
          
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2
              ${activeTab === 'bookings' ? 'border-brand-500 text-brand-600 bg-brand-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Calendar size={18}/> Bookings
          </button>

          {user.role === 'tutor' && (
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-2
                ${activeTab === 'profile' ? 'border-brand-500 text-brand-600 bg-brand-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <User size={18}/> Profile
            </button>
          )}
        </nav>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {user.role === 'tutor' ? 'Student Requests' : 'My Requests'}
              </h2>
              
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                    {user.role === 'tutor' ? 'No requests yet. Make sure your profile is active!' : 'You haven\'t sent any requests yet.'}
                  </div>
                ) : (
                  requests.map(req => (
                    <div key={req._id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-brand-200 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-bold text-gray-900">{user.role === 'tutor' ? req.student.name : req.tutor.name}</p>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{req.message}</p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <Clock size={12}/> 
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        {req.status === 'accepted' && (
                          <Link 
                            to={`/messages/${req._id}`} // Assuming message ID is request ID for now
                            className="bg-brand-100 hover:bg-brand-200 text-brand-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                          >
                            <MessageCircle size={16}/> Message
                          </Link>
                        )}
                        {user.role === 'tutor' && req.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(req._id, 'accepted')}
                              className="bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                            >
                              <CheckCircle size={16} /> Accept
                            </button>
                            <button 
                              onClick={() => handleStatusChange(req._id, 'declined')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm"
                            >
                              <XCircle size={16} /> Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 px-2 flex items-center gap-2">
                 <Calendar size={28} className="text-brand-500"/>
                 My Tutoring Sessions
              </h2>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-soft">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">You don't have any bookings yet.</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                       <h3 className="font-bold text-lg text-gray-900">
                         {user.role === 'student' ? booking.tutor?.name : booking.student?.name}
                       </h3>
                       <p className="text-brand-600 font-semibold">{new Date(booking.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                       <p className="text-gray-500 text-sm">{booking.durationMinutes} Minutes</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'}`}
                      >
                        {booking.status}
                      </span>
                      
                      {user.role === 'tutor' && booking.status === 'pending' && (
                        <div className="flex gap-2">
                           <button onClick={() => handleUpdateBooking(booking._id, 'confirmed')} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-semibold transition-colors">Accept</button>
                           <button onClick={() => handleUpdateBooking(booking._id, 'cancelled')} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 text-sm font-semibold transition-colors">Decline</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar Status (Tutors Only) */}
        {user?.role === 'tutor' && activeTab === 'profile' && (
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 h-min sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Overview</h2>
            
            {profile ? (
              <>
                <div className={`p-4 rounded-2xl flex items-center gap-3 mb-6 font-medium ${profile.isActive ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-yellow-50 text-yellow-800 border border-yellow-100'}`}>
                  <div className={`w-3 h-3 rounded-full ${profile.isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                  {profile.isActive ? 'Profile is Visible' : 'Profile is Hidden'}
                </div>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span>Subjects:</span>
                    <span className="font-semibold text-gray-900">{profile.subjects.length}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span>Experience:</span>
                    <span className="font-semibold text-gray-900">{profile.experienceYears} Years</span>
                  </div>
                </div>

                <button className="w-full mt-8 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-colors">
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">You haven't set up your tutor profile yet. Students cannot find you until you do.</p>
                <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold transition-colors">
                  Create Profile Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
