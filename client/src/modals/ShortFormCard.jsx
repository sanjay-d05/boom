import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ShortFormCard = ({ video, small }) => {
  const videoRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          entry.isIntersecting ? videoRef.current.play() : videoRef.current.pause();
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link to={`/player/${video.uploadedBy}/${video.title}`}>
      <div
        className="rounded-xl border shadow"
        style={{
          maxWidth: small ? '320px' : '450px',
          margin: '0 auto',
          overflow: 'hidden', // prevent content overflow
          background: 'white',
        }}
      >
        <video
          ref={videoRef}
          src={video.shortFormUrl}
          muted
          loop
          playsInline
          className="w-full rounded-t-xl"
          style={{
            height: small ? '280px' : '400px',
            objectFit: 'cover',
            display: 'block',
            margin: 0,
            padding: 0,
          }}
        />
        <div className="p-2"> {/* padding only around text */}
          <p className="text-sm text-gray-500 mt-2">{video.uploadedBy}</p>
          <p className="mt-2 font-semibold">{video.title}</p>
          <p>{video.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ShortFormCard;
