import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Save, Loader2, Crown } from 'lucide-react';
import { useAuth } from '../../Hooks/useAuth';

const ProfilePage = () => {
  const { user, profileData, updateUserProfile, isAuthLoading, signOutUser, userRole } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  const [leetcodeProfile, setLeetcodeProfile] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || '');
      setEmail(user.email || '');
    }
    if (profileData) {
      setPhoneNumber(profileData.phoneNumber || '');
      setRole(profileData.role || '');
      setGithubProfile(profileData.githubProfile || '');
      setLeetcodeProfile(profileData.leetcodeProfile || '');
    }
  }, [user, profileData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccessMessage('');
    try {
      await updateUserProfile({ phoneNumber, role, githubProfile, leetcodeProfile });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Profile update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      setError('Logout failed');
    }
  };

  const handleUpgrade = async () => {
    try {
      await updateUserProfile({ role: 'premium' });
      setSuccessMessage('Successfully upgraded to Premium!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Upgrade failed: ${err.message}`);
    }
  };

  const handleManageSubscription = () => {
    navigate('/pricing');
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600">
          Please <Link to="/" className="text-blue-500 hover:underline">log in</Link> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Account</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex justify-center items-center overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-gray-600" />}
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-2">{user?.displayName || 'User Name'}</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6">Account Information</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <input type="email" className="w-full px-3 py-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-2">Phone Number</label>
              <input type="tel" className="w-full px-3 py-2 border rounded-md" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-2">GitHub Profile</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" value={githubProfile} onChange={(e) => setGithubProfile(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-2">LeetCode Profile</label>
              <input type="text" className="w-full px-3 py-2 border rounded-md" value={leetcodeProfile} onChange={(e) => setLeetcodeProfile(e.target.value)} />
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Subscription</h3>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Crown size={24} className="text-yellow-500" />
              <h4 className="text-lg font-medium">{userRole === 'premium' ? 'Premium' : 'Standard'}</h4>
              <span className={`px-3 py-1 text-xs rounded-full ${userRole === 'premium' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                {userRole === 'premium' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-3">
              {userRole !== 'premium' && (
                <button onClick={handleUpgrade} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Upgrade to Premium
                </button>
              )}
              <button onClick={handleManageSubscription} className="px-4 py-2 bg-gray-200 rounded-md">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className={`flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md ${isUpdating ? 'opacity-70' : ''}`}
          >
            {isUpdating ? <><Loader2 size={16} className="animate-spin" /><span>Updating...</span></> : <><Save size={16} /><span>Save Profile</span></>}
          </button>
          <button onClick={handleLogout} className="px-6 py-2 bg-gray-200 rounded-md">Log Out</button>
        </div>

        {(error || successMessage) && (
          <div className="mt-4">
            {error && <p className="text-red-600">{error}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
