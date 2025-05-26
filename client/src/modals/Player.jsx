import React, { useContext, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { Authcontext } from '@/context/AuthContext';

function Player() {
  const { feedData, setFeedData, location, loginCredentials, setLoginCredentials } = useContext(Authcontext);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [showGiftOptions, setShowGiftOptions] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [giftError, setGiftError] = useState('');
  const [giftSuccess, setGiftSuccess] = useState('');

  const userID = location.pathname?.split('/')[2];
  const rawTitle = location.pathname?.split('/')[3];
  const userTitle = decodeURIComponent(rawTitle);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await axios.get('/feeds');
        setFeedData(res.data);
      } catch (error) {
        console.error('Error fetching feeds:', error);
      }
    };
    fetchFeeds();
  }, []);

  useEffect(() => {
    if (feedData.length > 0) {
      const match = feedData.find(video => video.uploadedBy === userID && video.title === userTitle);
      if (match) {
        setCurrentVideo(match);
        fetchComments(match._id);
      }
    }
  }, [feedData]);

  const fetchComments = async (videoId) => {
    try {
      const res = await axios.get(`/videos/${videoId}/comments`);
      setComments(res.data); // already sorted in backend
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    const commentToAdd = {
      username: loginCredentials.username,
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    try {
      // Optimistically update UI
      setComments(prev => [commentToAdd, ...prev]);

      // Send to server
      await axios.post(`/videos/${currentVideo._id}/comments`, {
        username: loginCredentials.username,
        text: newComment,
      });

      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const predefinedAmounts = [10, 50, 100];

  const handleGiftClick = () => {
    setShowGiftOptions(true);
    setGiftAmount('');
    setGiftError('');
    setGiftSuccess('');
  };

  const handleConfirmGift = () => {
    const amount = Number(giftAmount);
    if (!amount || amount <= 0) {
      setGiftError('Please enter a valid gift amount.');
      return;
    }
    if (amount > (loginCredentials.wallet || 0)) {
      setGiftError('Insufficient wallet balance.');
      return;
    }

    setLoginCredentials(prev => ({
      ...prev,
      wallet: prev.wallet - amount,
    }));

    setShowGiftOptions(false);
    setGiftError('');
    setGiftSuccess(`You gifted ₹${amount} to ${currentVideo.uploadedBy} for "${currentVideo.title}".`);
  };

  return (
    <div className="pt-20 flex flex-col md:flex-row justify-between items-start w-full h-screen overflow-hidden">
      <div className="w-full md:w-1/2 p-4 h-[50vh] md:h-full flex justify-center items-center bg-black">
        {currentVideo ? (
          <ReactPlayer
            url={currentVideo.shortFormUrl || currentVideo.longFormUrl}
            controls
            width="100%"
            height="100%"
          />
        ) : (
          <p className="text-white">Loading video...</p>
        )}
      </div>

      <div className="w-full md:w-1/2 h-full overflow-y-auto px-6 py-4 space-y-6">
        {currentVideo && (
          <>
            <div>
              <h2 className="text-xl font-bold">{currentVideo.title}</h2>
              <p className="text-sm text-gray-600">{currentVideo.description}</p>
              <p className="text-sm text-blue-600 mt-2">Uploaded by: {currentVideo.uploadedBy}</p>
              {currentVideo.videoType === 'long-form' && (
                <p className="text-sm text-green-700">Price: ₹{currentVideo.longFormPricing}</p>
              )}
              <p className="mt-1 text-gray-700">
                Your Wallet Balance: ₹{loginCredentials.wallet ?? 0}
              </p>
            </div>

            <div>
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
                        className={`px-3 py-1 rounded border ${giftAmount == amt ? 'bg-purple-600 text-white' : ''}`}
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

                  {giftError && <p className="text-red-600 mt-1">{giftError}</p>}

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

              {giftSuccess && <p className="mt-2 text-green-700">{giftSuccess}</p>}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Comments</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 border p-2 rounded bg-gray-50">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="bg-white p-2 rounded shadow-sm">
                      <p className="text-sm text-blue-600 font-medium">{comment.username}</p>
                      <p className="text-gray-700">{comment.text}</p>
                      <p className="text-xs text-gray-400">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No comments yet.</p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded border border-gray-300"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={handlePostComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Player;
