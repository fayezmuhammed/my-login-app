import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { MemberData } from '../types/api';

const DetailedProfile = () => {
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
            setError(data.message || 'Failed to load profile');
          }
        })
        .catch(() => setError('An error occurred while fetching the profile'))
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!member) return <div className="min-h-screen flex items-center justify-center">No member found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button and logout */}
      <div className="p-4 flex items-center justify-between bg-white border-b">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-4 text-black hover:bg-gray-100 p-1 rounded-full">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-black">MembershipID</h1>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Profile Content */}
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100">
            <Image
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold text-black">{member.name}</h2>
        </div>

        {/* Contact Details Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-xl font-semibold text-black mb-4">Contact Details</h3>
          <div className="space-y-3">
            <div className="flex">
              <span className="w-20 text-gray-600">Email:</span>
              <a href={`mailto:${member.email}`} className="text-blue-600 underline">
                {member.email}
              </a>
            </div>
            <div className="flex">
              <span className="w-20 text-gray-600">Phone:</span>
              <span className="text-black">{member.phone}</span>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-xl font-semibold text-black mb-4">Personal Details</h3>
          <div className="space-y-3">
            <div className="flex">
              <span className="w-32 text-gray-600">Father:</span>
              <span className="text-black">{member.personalDetails.father}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">Address:</span>
              <span className="text-black">{member.personalDetails.address}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">Blood Group:</span>
              <span className="text-black">{member.personalDetails.bloodGroup}</span>
            </div>
          </div>
        </div>

        {/* Other Details Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-xl font-semibold text-black mb-4">Payment History</h3>
          <div className="space-y-3">
            {member.payments.map(payment => (
              <div key={payment.year} className="flex">
                <span className="w-32 text-gray-600">Paid {payment.year}:</span>
                <span className="text-black">{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedProfile;

