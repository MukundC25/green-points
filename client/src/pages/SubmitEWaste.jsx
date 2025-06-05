import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pointsService } from '../services/pointsService';
import { Upload, Calculator, Coins, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SubmitEWaste = () => {
  const [formData, setFormData] = useState({
    type: '',
    condition: '',
    quantity: 1,
    weight: '',
    description: '',
    imageUrl: ''
  });
  const [estimatedPoints, setEstimatedPoints] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const itemTypes = [
    'Smartphone',
    'Laptop',
    'Tablet',
    'Battery',
    'Charger',
    'Headphones',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Cable',
    'Other'
  ];

  const conditions = [
    { value: 'Working', label: 'Working', description: 'Device is fully functional' },
    { value: 'Repairable', label: 'Repairable', description: 'Device has minor issues but can be fixed' },
    { value: 'Dead', label: 'Dead', description: 'Device is not working and cannot be repaired' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 1 :
              name === 'weight' ? parseFloat(value) || '' : value
    });
  };

  const calculatePoints = async () => {
    if (!formData.type || !formData.condition || !formData.quantity) {
      return;
    }

    setLoading(true);
    try {
      const response = await pointsService.calculatePoints({
        type: formData.type,
        condition: formData.condition,
        quantity: formData.quantity,
        weight: formData.weight
      });
      
      setEstimatedPoints(response.estimatedPoints);
      setBreakdown(response.breakdown);
    } catch (error) {
      console.error('Failed to calculate points:', error);
      toast.error('Failed to calculate points');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePoints();
  }, [formData.type, formData.condition, formData.quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await pointsService.submitEWaste(formData);
      
      await refreshUser(); // Update user data
      
      toast.success(response.message);
      
      // Show success modal or redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit e-waste:', error);
      const message = error.response?.data?.message || 'Failed to submit e-waste';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit E-Waste</h1>
        <p className="text-gray-600">
          Upload details about your electronic waste and earn Green Points for responsible recycling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select item type</option>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <div className="space-y-3">
                  {conditions.map((condition) => (
                    <label key={condition.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={formData.condition === condition.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        required
                      />
                      <div>
                        <div className="font-medium text-gray-900">{condition.label}</div>
                        <div className="text-sm text-gray-500">{condition.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input"
                  placeholder="Number of items"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) - Optional
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input"
                  placeholder="Weight in kilograms (e.g., 2.5)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  💡 Earn +2 points per kg! Heavier items get bonus points.
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  placeholder="Additional details about the item(s)..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Provide a URL to an image of your e-waste item
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.type || !formData.condition}
                className="w-full btn-primary flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit E-Waste
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Points Calculator Section */}
        <div className="space-y-6">
          {/* Points Estimate */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Points Calculator</h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="loading-spinner mr-2"></div>
                <span className="text-gray-600">Calculating...</span>
              </div>
            ) : estimatedPoints !== null ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Coins className="h-8 w-8 text-primary-600" />
                    <span className="text-3xl font-bold text-primary-600">
                      {estimatedPoints}
                    </span>
                  </div>
                  <p className="text-gray-600">Estimated Green Points</p>
                </div>

                {breakdown && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base points:</span>
                      <span className="font-medium">{breakdown.basePoints}</span>
                    </div>
                    {breakdown.conditionBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition bonus:</span>
                        <span className="font-medium text-green-600">+{breakdown.conditionBonus}</span>
                      </div>
                    )}
                    {breakdown.quantityBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity bonus:</span>
                        <span className="font-medium text-green-600">+{breakdown.quantityBonus}</span>
                      </div>
                    )}
                    {breakdown.weightBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight bonus:</span>
                        <span className="font-medium text-green-600">+{breakdown.weightBonus}</span>
                      </div>
                    )}
                    {breakdown.frequencyBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency bonus:</span>
                        <span className="font-medium text-green-600">+{breakdown.frequencyBonus}</span>
                      </div>
                    )}
                    {breakdown.bonusPoints > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Special bonus:</span>
                        <span className="font-medium text-green-600">+{breakdown.bonusPoints}</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-primary-600">{breakdown.total}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Fill in the form to see estimated points</p>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Your Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-700">Current Balance:</span>
                <span className="font-medium text-primary-900">{user?.greenPoints || 0} points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-700">User Level:</span>
                <span className="font-medium text-primary-900">{user?.userFrequency || 'First-time'}</span>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">⚠️ Important Notice</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              The points shown above are <strong>estimated</strong> based on your submission details.
              Final Green Points will be awarded only after physical verification of your e-waste items
              by our certified team. Once verified, points will be credited to your wallet and available
              for redemption.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tips to Earn More Points</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Working devices earn more points</li>
              <li>• Submit multiple items for quantity bonus</li>
              <li>• Add weight for +2 points per kg</li>
              <li>• Regular users get frequency bonuses</li>
              <li>• Rare items like laptops earn extra points</li>
              <li>• Use points within 24hrs for 2X value!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitEWaste;
