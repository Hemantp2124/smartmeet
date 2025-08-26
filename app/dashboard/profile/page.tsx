'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { SignOutButton } from '@/app/components/Auth/SignOutButton';

export default function ProfilePage() {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://i.pravatar.cc/100?img=12',
    role: 'Premium Member',
    joinedDate: 'Joined June 2023',
  });
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
  });
  const router = useRouter();



  const handleDelete = () => {
    setIsDeleting(true);

    setTimeout(() => {
      setIsDeleting(false);
      setConfirmationText('');
      toast.success('Account deleted successfully');
      
      // In a real app, you would handle the actual account deletion here
      // and then redirect to the login page
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    }, 1500);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      name: editForm.name,
      email: editForm.email
    }));
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // In a real app, you would handle the actual logout here
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const requiredPhrase = 'delete my account';
  const isValid = confirmationText.toLowerCase().trim() === requiredPhrase;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">


      {/* Profile Card */}
      <div className="p-6 max-w-sm w-full glass rounded-3xl space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border-2 border-white/20"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-xs bg-white text-black px-2 py-1 rounded">Change</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl font-medium hover:opacity-90 transition"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium">{user.joinedDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-green-400 font-medium">Active</p>
                </div>
              </div>
              
              <button 
                onClick={handleEdit}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl font-medium hover:opacity-90 transition"
              >
                Edit Profile
              </button>

              <SignOutButton />
            </div>
          </div>
        )}

        {/* Delete Section */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-red-400 mb-2 font-medium">
            Danger Zone
          </p>
          <p className="text-xs text-gray-400 mb-3">
            To delete your account, type <span className="text-red-500 font-medium">"{requiredPhrase}"</span>.
          </p>

          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder='Type "delete my account" to confirm'
            className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-red-500"
          />

          <button
            onClick={handleDelete}
            disabled={!isValid || isDeleting}
            className={`mt-3 w-full py-2 px-4 rounded-xl font-medium transition ${
              isValid
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-500/10 text-red-400 cursor-not-allowed'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
