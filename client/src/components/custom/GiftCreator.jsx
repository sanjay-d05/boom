import React, { useState } from 'react';

function GiftCreator({ currentUser, creatorName, videoTitle, onGiftSuccess }) {
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const predefinedAmounts = [10, 50, 100];

  const userBalance = currentUser.walletBalance || 0;

  const handleGiftClick = () => {
    setShowGiftOptions(true);
    setGiftAmount('');
    setError('');
    setSuccessMsg('');
  };

  const handleConfirmGift = () => {
    const amount = Number(giftAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid gift amount.');
      return;
    }

    if (amount > userBalance) {
      setError('Insufficient wallet balance.');
      return;
    }

    // Deduct amount (simulate deduction)
    // If you have backend API, call it here to update balance & log gift
    // For demo, just call onGiftSuccess

    setShowGiftOptions(false);
    setError('');
    setSuccessMsg(`You gifted ₹${amount} to ${creatorName} for "${videoTitle}"`);

    // Call parent callback to update wallet balance, log, etc
    onGiftSuccess(amount);

    console.log(`User ${currentUser.username} gifted ₹${amount} to Creator ${creatorName} for Video ${videoTitle}`);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleGiftClick}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Gift the Creator
      </button>

      {showGiftOptions && (
        <div className="mt-2 p-4 border rounded bg-gray-100 max-w-xs">
          <p>Select an amount or enter custom value:</p>

          <div className="flex gap-2 mt-2">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setGiftAmount(amt.toString())}
                className={`px-3 py-1 rounded border ${
                  giftAmount == amt ? 'bg-purple-600 text-white' : ''
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <input
            type="number"
            min="1"
            placeholder="Custom amount"
            value={giftAmount}
            onChange={(e) => setGiftAmount(e.target.value)}
            className="mt-2 px-2 py-1 border rounded w-full"
          />

          {error && <p className="text-red-600 mt-1">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowGiftOptions(false)}
              className="px-3 py-1 rounded border"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmGift}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Send Gift
            </button>
          </div>
        </div>
      )}

      {successMsg && <p className="mt-2 text-green-700">{successMsg}</p>}
    </div>
  );
}

export default GiftCreator;
