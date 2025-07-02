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
    imageFile: null
  });
  const [estimatedPoints, setEstimatedPoints] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [weightRange, setWeightRange] = useState('');
  const [exactWeight, setExactWeight] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [items, setItems] = useState([]);
  const [addingItem, setAddingItem] = useState(false);
  const [showAddItemPrompt, setShowAddItemPrompt] = useState(false);
  const totalWeight = items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
  const canSubmitPickup = totalWeight >= 5;
  const [selectedDay, setSelectedDay] = useState('');

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

  const conditionOptions = [
    { value: 'Working', label: 'Working', note: 'Device is fully functional' },
    { value: 'Not Working', label: 'Not Working', note: 'Device is not working and cannot be repaired' }
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
        condition: formData.condition === 'Not Working' ? 'Dead' : formData.condition,
        quantity: formData.quantity,
        weight: exactWeight || formData.weight
      });
      
      setEstimatedPoints(response.estimatedPoints);
      setBreakdown(response.breakdown);
      setEstimatedPrice(response.estimatedPrice || null);
    } catch (error) {
      console.error('Failed to calculate points:', error);
      toast.error('Failed to calculate points');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePoints();
  }, [formData.type, formData.condition, formData.quantity, exactWeight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (weightRange === '<5') {
      const total = items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0);
      if (total !== 5) {
        toast.error('Total weight must be exactly 5kg for pickup in this category');
        return;
      }
      setSubmitting(true);
      try {
        // Submit all items as batch
        const response = await pointsService.submitEWaste(items);
        await refreshUser();
        toast.success(`${response.message} You earned ${response.points} points and estimated price is ₹${response.estimatedPrice || 'N/A'}`);
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
      return;
    } else {
      if (!formData.type || !formData.condition || !weightRange || !exactWeight) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
        const submissionData = {
          ...formData,
          weight: exactWeight
        };
        const response = await pointsService.submitEWaste(submissionData);
      
      await refreshUser(); // Update user data
      
        toast.success(`${response.message} You earned ${response.points} points and estimated price is ₹${response.estimatedPrice || estimatedPrice || 'N/A'}`);
      
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
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      imageFile: file
    });
  };

  // --- Button enable/disable logic ---
  const isPickupReady = (() => {
    if (weightRange === '<5') {
      return items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0) >= 5 && selectedDay && pickupTime;
    }
    if (weightRange === 'bulk') {
      // For bulk, require type, condition, and a minimum weight (e.g., 20kg), and pickup slot
      return formData.type && formData.condition && exactWeight && parseFloat(exactWeight) >= 20 && selectedDay && pickupTime;
    }
    // For other categories
    return formData.type && formData.condition && weightRange && exactWeight && parseFloat(exactWeight) >= 5 && selectedDay && pickupTime;
  })();

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
                  {conditionOptions.map((condition) => (
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
                        <div className="text-xs text-gray-500 mt-0.5">{condition.note}</div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight *</label>
                <div className="flex space-x-2 mb-2">
                  <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${weightRange === '<5' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => { setWeightRange('<5'); setShowAddItemPrompt(true); }}>Weight less than 5 kg</button>
                  <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${weightRange === '5-20' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => { setWeightRange('5-20'); setShowAddItemPrompt(false); }}>Weight between 5 to 20 kg</button>
                  <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${weightRange === '>20' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => { setWeightRange('>20'); setShowAddItemPrompt(false); }}>Weight more than 20 kg</button>
                  <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${weightRange === 'bulk' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => { setWeightRange('bulk'); setShowAddItemPrompt(false); }}>Bulk items (Business)</button>
                </div>
                {weightRange && weightRange !== 'bulk' && (
                <input
                  type="number"
                    min="0.1"
                  step="0.1"
                    required
                  className="input"
                    placeholder="Enter exact weight in kg"
                    value={exactWeight}
                    onChange={e => setExactWeight(e.target.value)}
                />
                )}
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

              {/* Image Upload */}
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Image (Optional)
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input"
                />
              </div>

              {/* Pickup Slot Selection */}
              {weightRange && exactWeight && parseFloat(exactWeight) >= 5 && (
                <div className="mt-4">
                  <div className="mb-2 font-semibold text-gray-700">Select Pickup Day</div>
                  <div className="flex space-x-2 mb-2">
                    {parseFloat(exactWeight) > 20 ? (
                      <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${selectedDay === 'Sunday' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => setSelectedDay('Sunday')}>Sunday</button>
                    ) : (
                      <>
                        <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${selectedDay === 'Wednesday' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => setSelectedDay('Wednesday')}>Wednesday</button>
                        <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${selectedDay === 'Friday' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => setSelectedDay('Friday')}>Friday</button>
                      </>
                    )}
                  </div>
                  {selectedDay && (
                    <div className="mb-2 font-semibold text-gray-700">Select Pickup Time</div>
                  )}
                  {selectedDay && (
                    <div className="flex space-x-2 mb-4">
                      {['10am-1pm', '1pm-4pm', '4pm-7pm'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${pickupTime === slot ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`}
                          onClick={() => setPickupTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* More Items Prompt */}
              {showAddItemPrompt && weightRange === '<5' && items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0) < 5 && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      const currentWeight = items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0);
                      const newWeight = currentWeight + parseFloat(exactWeight || 0);
                      if (!formData.type || !formData.condition || !exactWeight) {
                        toast.error('Please fill all item details');
                        return;
                      }
                      if (newWeight > 5) {
                        toast.error('Total weight for <5kg category cannot exceed 5kg.');
                        return;
                      }
                      setItems([...items, { ...formData, weight: exactWeight, estimatedPoints, estimatedPrice }]);
                      // Reset form for next item
                      setFormData({ type: '', condition: '', quantity: 1, weight: '', description: '', imageFile: null });
                      setExactWeight('');
                      setEstimatedPoints(null);
                      setEstimatedPrice(null);
                      setBreakdown(null);
                    }}
                    disabled={items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0) >= 5}
                  >
                    Add This Item
                  </button>
                  <div className="text-sm text-gray-500 mt-2">Add more items until total weight is exactly 5kg to enable pickup. (You cannot exceed 5kg in this category.)</div>
                </div>
              )}

              {/* Items List */}
              {items.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Items Added:</h4>
                  <ul className="space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx} className="border rounded p-2 flex justify-between items-center">
                        <span>{item.type} ({item.condition}) - {item.weight}kg</span>
                        <span className="text-primary-600 font-bold">{item.estimatedPoints} pts / ₹{item.estimatedPrice}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 font-medium">Total Weight: {items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0).toFixed(2)} kg</div>
                </div>
              )}

              {/* For <5kg, show slot selection when total weight >= 5kg */}
              {weightRange === '<5' && items.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0) >= 5 && (
                <div className="mt-4">
                  <div className="mb-2 font-semibold text-gray-700">Select Pickup Day</div>
                  <div className="flex space-x-2 mb-2">
                    {/* For <5kg, use same slots as 5-20kg: Wednesday/Friday */}
                    <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${selectedDay === 'Wednesday' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => setSelectedDay('Wednesday')}>Wednesday</button>
                    <button type="button" className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${selectedDay === 'Friday' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`} onClick={() => setSelectedDay('Friday')}>Friday</button>
                  </div>
                  {selectedDay && (
                    <div className="mb-2 font-semibold text-gray-700">Select Pickup Time</div>
                  )}
                  {selectedDay && (
                    <div className="flex space-x-2 mb-4">
                      {['10am-1pm', '1pm-4pm', '4pm-7pm'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`rounded-full px-4 py-2 font-medium transition-colors focus:outline-none ${pickupTime === slot ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`}
                          onClick={() => setPickupTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !isPickupReady}
                className="w-full btn-primary flex items-center justify-center mt-2"
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit for Pickup
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

                {estimatedPrice !== null && (
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Coins className="h-8 w-8 text-yellow-500" />
                      <span className="text-2xl font-bold text-yellow-600">
                        ₹{estimatedPrice}
                      </span>
                    </div>
                    <p className="text-gray-600">Estimated Price</p>
                  </div>
                )}

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
