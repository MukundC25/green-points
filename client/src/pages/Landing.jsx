import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Gift, TrendingUp, Users, Award } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Recycle,
      title: 'Submit E-Waste',
      description: 'Upload photos of your electronic waste and get instant point calculations based on type and condition.'
    },
    {
      icon: Gift,
      title: 'Earn Green Points',
      description: 'Receive points for every item you recycle. More valuable items and better conditions earn more points.'
    },
    {
      icon: Award,
      title: 'Redeem Rewards',
      description: 'Use your Green Points to get discounts on eco-friendly products and sustainable services.'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your environmental impact and see how your recycling efforts contribute to sustainability.'
    }
  ];

  const stats = [
    { label: 'Items Recycled', value: '10,000+' },
    { label: 'Points Earned', value: '500K+' },
    { label: 'Active Users', value: '2,500+' },
    { label: 'CO₂ Saved', value: '50 tons' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Green Points</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your E-Waste Into
              <span className="text-primary-600"> Green Points</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join the sustainable revolution! Recycle your electronic waste responsibly 
              and earn Green Points that you can redeem for eco-friendly products and discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary btn-lg"
              >
                Start Earning Points
              </Link>
              <Link
                to="/login"
                className="btn-outline btn-lg"
              >
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to start earning Green Points and making a positive environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Together, we're making a real difference for our planet
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Earning Green Points?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already making a positive impact on the environment 
            while earning rewards for their sustainable actions.
          </p>
          <Link
            to="/register"
            className="btn-primary btn-lg"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold">Green Points</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 Green Points System. Built for a sustainable future.</p>
              <p className="text-sm mt-1">Developed by Mukund Chavan</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
