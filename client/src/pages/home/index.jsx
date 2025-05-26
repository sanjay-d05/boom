import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import HomeDownBar from '@/components/custom/homenavbar'
import { Authcontext } from '@/context/AuthContext'
import LongFormCard from '@/modals/LongFormCard'
import ShortFormCard from '@/modals/ShortFormCard'
import axios from 'axios'

function Home() {
  const { currentFeed, setCurrentFeed, feedData, setFeedData } = useContext(Authcontext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const scrollTimeoutRef = useRef(null)

  useEffect(() => {
    const fetchFeeds = async () => {
      const response = await axios.get('/feeds')
      setFeedData(response.data)
      setCurrentIndex(0)
    }
    fetchFeeds()
  }, [setFeedData])

  const filteredFeeds =
    currentFeed === 'all'
      ? feedData
      : feedData.filter(video => video.videoType === currentFeed)

  const changeIndex = (newIndex) => {
    if (newIndex === currentIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setIsTransitioning(false)
    }, 400) // duration of fade out
  }

  const onWheel = useCallback((e) => {
    e.preventDefault() // prevent default scrolling behavior

    if (scrollTimeoutRef.current) return // throttle scroll

    scrollTimeoutRef.current = setTimeout(() => {
      scrollTimeoutRef.current = null
    }, 600) // throttle duration

    if (e.deltaY > 0) {
      // scroll down => next video
      changeIndex(Math.min(currentIndex + 1, filteredFeeds.length - 1))
    } else if (e.deltaY < 0) {
      // scroll up => prev video
      changeIndex(Math.max(currentIndex - 1, 0))
    }
  }, [currentIndex, filteredFeeds.length])

  if (filteredFeeds.length === 0) {
    return (
      <div className='h-[100vh] w-full flex flex-col items-center justify-center'>
        <p className="text-center text-gray-500">No videos to display.</p>
        <HomeDownBar />
      </div>
    )
  }

  const video = filteredFeeds[currentIndex]

  return (
    <div
      className='h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden select-none bg-[#f9fafb]'
      onWheel={onWheel}
      style={{ touchAction: 'none' }} // disables default touch scroll
    >
      <div
        className={`w-full max-w-md px-4 transition-opacity duration-400  ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        key={video._id}
      >
        {video.videoType === 'short-form' ? (
          <ShortFormCard video={video} />
        ) : (
          <LongFormCard video={video} />
        )}
      </div>
      <HomeDownBar />
    </div>
  )
}

export default Home
