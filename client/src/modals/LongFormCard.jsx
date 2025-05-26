import React, { useContext, useState } from 'react';
import { Authcontext } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

import thumbnail from '../assets/thumbnail.jpg' ;

const LongFormCard = ({ video }) => {
  const { navigate, loginCredentials, updateLoginCredentials } = useContext(Authcontext);
  const [open, setOpen] = useState(false);

  const isPurchased = loginCredentials?.purchaseVideo?.includes(video._id);
  const showWatchButton = video.longFormPricing <= 0 || isPurchased;

  const handlePurchase = async () => {
    try {
      const res = await fetch('http://localhost:8000/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: loginCredentials.currentUserId,
          videoId: video._id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('❌ Purchase failed:', res.status, error.message);
        return;
      }

      const data = await res.json();
      toast.success('✅ Purchase successful');
      setOpen(false);

      // Update context with fresh wallet and purchased videos
      updateLoginCredentials({
        wallet: data.wallet,
        purchaseVideo: data.purchasedVideos,
      });

    } catch (err) {
      console.error('❌ Network or server error during purchase:', err.message);
    }
  };

  const calculateWallet = () => {
    return loginCredentials.wallet - video.longFormPricing;
  };

  return (
    <div className='rounded-xl border shadow p-2'>
      <img
        src={video.thumbnail || thumbnail}
        alt={video.title}
        className='w-full h-48 object-cover rounded'
      />
      <p className='mt-2 font-semibold'>{video.title}</p>
      <p className='text-sm text-gray-500'>{video.uploadedBy}</p>

      {showWatchButton ? (
        <button
          className='mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700'
          onClick={() => navigate(`/player/${video.uploadedBy}/${video.title}`)}
        >
          Watch
        </button>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className='bg-blue-700 text-white p-2 rounded hover:bg-red-600 mt-2'
              onClick={() => setOpen(true)}
            >
              Buy for ₹{video.longFormPricing}
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will deduct money from your wallet. You can watch the video after purchase.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p>
                Wallet Balance:{' '}
                <span className='text-blue-600'>₹ {loginCredentials.wallet}</span>
              </p>
              <p>
                Video Price:{' '}
                <span className='text-red-600'>₹ {video.longFormPricing}</span>
              </p>
              <p>
                Wallet Balance after purchase:{' '}
                <span className='text-green-700'>₹ {calculateWallet()}</span>
              </p>
              {loginCredentials.wallet < video.longFormPricing && (
                <p className='text-red-500 mt-2'>⚠️ Insufficient wallet balance</p>
              )}
              <div className='flex justify-end items-center mt-4 gap-2'>
                <Button variant='outline' onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={loginCredentials.wallet < video.longFormPricing}
                >
                  Purchase
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LongFormCard;
