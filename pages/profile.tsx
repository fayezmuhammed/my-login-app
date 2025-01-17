'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { MemberData } from '../types/api';

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/members/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMember(data.data);
          } else {
            setError(data.message);
          }
        })
        .catch(() => setError('Failed to load profile'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/login');
      } else {
        setError('Logout failed');
      }
    } catch {
      setError('An error occurred during logout');
    }
  };

  const handleViewProfile = () => {
    router.push(`/profile/${member?.id}/details`);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold text-red-500">Error: {error}</div>
    </div>
  );

  if (!member) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold">No member found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logout */}
      <div className="p-4 flex justify-end bg-white border-b">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 overflow-hidden rounded-full bg-blue-100">
              <Image
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">
              {member.name}
            </h1>
            
            <p className="text-sm text-gray-600">
              Membership ID: {member.id}
            </p>
            
            <div className="w-full text-center">
              <p className="text-gray-700">
                <span className="font-medium">Country: </span>
                {member.country}
              </p>
            </div>
            
            <div className="w-full text-center">
              <p className="text-gray-700">
                <span className="font-medium">Member Since: </span>
                {member.expirationDate}
              </p>
            </div>
            
            <button
              onClick={handleViewProfile}
              className="w-full px-4 py-2 mt-4 text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

