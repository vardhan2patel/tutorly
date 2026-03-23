import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, Clock, BookOpen, GraduationCap, ArrowLeft, CheckCircle, Star, Calendar } from 'lucide-react';
import { getTutorById } from '../services/tutorService';
import { sendContactRequest } from '../services/requestService';
import { getTutorReviews, createReview } from '../services/reviewService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const TutorProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [requestMessage, setRequestMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null); // 'success' | 'error' | null

  // New states for reviews and bookings
  const [reviews, setReviews] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  
  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const data = await getTutorById(id);
        setTutor(data);
        const reviewData = await getTutorReviews(id);
        setReviews(reviewData);
      } catch (err) {
        setError(err.response?.data?.message || 'Tutor not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id]);

  const handleContact = async (e) => {
    e.preventDefault();
    if (!user) {
      setRequestStatus('error');
      // In a real app we might redirect to login here
      return;
    }
    
    setIsSending(true);
    setRequestStatus(null);
    try {
      await sendContactRequest(id, requestMessage || 'I would like to connect about tutoring.');
      setRequestStatus('success');
      setRequestMessage('');
    } catch (err) {
      setRequestStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSending(true);
    setBookingStatus(null);
    try {
      await createBooking(id, bookingDate, 60); // default 60 mins
      setBookingStatus('success');
      setTimeout(() => setShowBooking(false), 2000);
    } catch (err) {
      setBookingStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSending(true);
    setReviewStatus(null);
    try {
      const newReview = await createReview(id, rating, comment);
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
      setReviewStatus('success');
    } catch (err) {
      setReviewStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading profile...</div>;
  if (error || !tutor) return <div className="text-center py-20 text-red-600 bg-red-50 mx-4 mt-8 rounded-xl font-medium">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/search" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
        <ArrowLeft size={16} className="mr-1" />
        Back to Search
      </Link>

      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 overflow-hidden mb-8">
        {/* Header Background */}
        <div className="h-40 bg-gradient-to-r from-brand-600 to-accent-600 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-10 -mb-10 w-32 h-32 bg-brand-300 opacity-20 rounded-full blur-xl"></div>
        </div>
        
        <div className="px-8 flex flex-col sm:flex-row gap-6 relative pb-8 border-b border-gray-50">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-float -mt-14 relative z-10">
            <div className="w-full h-full bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-4xl border border-brand-100">
              {tutor.user.name.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1 pt-3 sm:pt-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{tutor.user.name}</h1>
                <div className="flex flex-wrap items-center text-gray-600 mt-2 gap-x-6 gap-y-2 font-medium">
                  {tutor.distance > 0 && <span className="flex items-center gap-1.5"><MapPin size={18} className="text-brand-500"/> {(tutor.distance / 1000).toFixed(1)} km away</span>}
                  <span className="flex items-center gap-1.5"><GraduationCap size={18} className="text-accent-500"/> {tutor.experienceYears} Years Exp.</span>
                  {tutor.numReviews > 0 && (
                    <span className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                      <Star size={16} className="fill-yellow-500" />
                      {tutor.averageRating.toFixed(1)} ({tutor.numReviews} Reviews)
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-3">
                <button 
                  onClick={() => setShowBooking(!showBooking)}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Calendar size={18} /> Book Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">About Me</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{tutor.bio}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2">
                 Subjects
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {tutor.subjects.map(sub => (
                  <span key={sub} className="bg-brand-50 border border-brand-100 text-brand-800 px-4 py-2 rounded-xl border-font-semibold shadow-sm">{sub}</span>
                ))}
              </div>
            </section>
          </div>
          
          <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-accent-500"/> Class Levels
              </h3>
              <ul className="text-gray-800 space-y-2 font-semibold bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                {tutor.classLevels.map(level => (
                  <li key={level} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-400"></div>
                    {level}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={16} className="text-brand-500"/> Availability
              </h3>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                 <p className="text-gray-800 font-semibold">{tutor.availability}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Mail size={24} className="text-brand-500"/>
          Contact {tutor.user.name.split(' ')[0]}
        </h2>
        <p className="text-gray-600 mb-6">Send a request to discuss tutoring arrangements.</p>

        {requestStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 animate-slide-up">
            <CheckCircle size={48} className="text-green-500" />
            <div>
              <h3 className="font-bold text-lg">Request Sent Successfully!</h3>
              <p className="text-green-700 mt-1">The tutor will be notified and can view your request in their dashboard.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleContact} className="space-y-4">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
               <textarea 
                 rows="4"
                 value={requestMessage}
                 onChange={(e) => setRequestMessage(e.target.value)}
                 placeholder={`Hi ${tutor.user.name.split(' ')[0]}, I'm interested in tutoring...`}
                 className="w-full border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-gray-50 transition-colors"
               ></textarea>
            </div>
            
            {requestStatus === 'error' && (
              <p className="text-red-500 text-sm font-medium">Failed to send request. Make sure you are logged in as a student.</p>
            )}

            <button 
              type="submit"
              disabled={isSending || !user || user.role === 'tutor'}
              className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Request'}
            </button>
            
            {!user && <p className="text-sm text-gray-500 mt-2">You must be logged in as a Student to send requests.</p>}
          </form>
        )}
      </div>

      {/* Booking Form (Conditional) */}
      {showBooking && (
        <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8 mt-8 animate-slide-up">
           <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar size={24} className="text-brand-500"/>
            Request a Session
          </h2>
          <p className="text-gray-600 mb-6">Select a date and time for your tutoring session.</p>

          {bookingStatus === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle size={24} className="text-green-500" />
              <p className="font-semibold">Booking request sent! The tutor will confirm soon.</p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Session Date & Time</label>
                 <input 
                   type="datetime-local" 
                   required
                   value={bookingDate}
                   onChange={(e) => setBookingDate(e.target.value)}
                   className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-gray-50 outline-none"
                 />
               </div>
               
               {bookingStatus === 'error' && (
                  <p className="text-red-500 text-sm font-medium">Failed to send booking. Note: Date must be in the future.</p>
               )}

               <button 
                  type="submit"
                  disabled={isSending || !user || user.role === 'tutor'}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Confirm Request'}
                </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white rounded-[2rem] shadow-soft border border-gray-100 p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Star size={24} className="text-yellow-500 fill-yellow-500"/>
          Reviews ({reviews.length})
        </h2>

        {/* Leave Review Form */}
        {user && user.role === 'student' && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Leave a Review</h3>
            {reviewStatus === 'success' ? (
               <p className="text-green-600 font-medium">Thank you for your review!</p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-semibold text-gray-700">Rating:</label>
                  <select 
                    value={rating} 
                    onChange={e => setRating(e.target.value)}
                    className="border border-gray-200 rounded-lg p-2 bg-white"
                  >
                    {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
                </div>
                <textarea 
                   required
                   rows="3"
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                   placeholder="How was your experience?"
                   className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                ></textarea>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        )}

        {/* Review List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to leave one!</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{review.student?.name || 'Student'}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-200"} 
                    />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default TutorProfilePage;
