import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Copy, Users, Gift, Share2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Referral = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarned: 0,
    recentReferrals: []
  });

  const referralCode = user?.referralCode || 'Loading...';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '📱',
      url: `https://wa.me/?text=Join Green Points and earn rewards for recycling e-waste! Use my referral code: ${referralCode} or click: ${referralLink}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?text=Join me on Green Points - earn rewards for recycling e-waste! Use code: ${referralCode}&url=${referralLink}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Email',
      icon: '📧',
      url: `mailto:?subject=Join Green Points&body=Hi! I'm using Green Points to earn rewards for recycling e-waste. Join me using my referral code: ${referralCode} or click: ${referralLink}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Refer Friends & Earn</h1>
        <p className="text-blue-100">
          Share Green Points with friends and both of you earn bonus points!
        </p>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How Referrals Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Share Your Code</h3>
            <p className="text-gray-600 text-sm">Share your unique referral code with friends and family</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Friend Joins</h3>
            <p className="text-gray-600 text-sm">They sign up using your referral code</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Both Earn Points</h3>
            <p className="text-gray-600 text-sm">You get 30 points, they get 50 welcome points</p>
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Code</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your unique referral code:</p>
              <p className="text-2xl font-bold text-primary-600">{referralCode}</p>
            </div>
            <button
              onClick={() => copyToClipboard(referralCode)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Share this link:</p>
              <p className="text-sm text-gray-800 break-all">{referralLink}</p>
            </div>
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ml-4"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Share on Social Media</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${option.color} text-white p-4 rounded-lg text-center hover:transform hover:scale-105 transition-all`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium">{option.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Total Referrals</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{referralStats.totalReferrals}</p>
          <p className="text-sm text-gray-600">Friends joined</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Points Earned</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{referralStats.totalEarned}</p>
          <p className="text-sm text-gray-600">From referrals</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Referral Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Share your code with environmentally conscious friends</li>
          <li>• Post on social media about your e-waste recycling journey</li>
          <li>• Explain how Green Points helps the environment</li>
          <li>• Both you and your friend benefit from the referral</li>
          <li>• No limit on how many friends you can refer!</li>
        </ul>
      </div>
    </div>
  );
};

export default Referral;
