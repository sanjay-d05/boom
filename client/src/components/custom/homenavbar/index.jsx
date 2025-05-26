import { Button } from '@/components/ui/button';
import { Authcontext } from '@/context/AuthContext';
import React, { useContext } from 'react' ;
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaPhotoVideo } from "react-icons/fa";
import { TbArrowBarBoth } from "react-icons/tb";

function HomeDownBar() {

  const {currentFeed , setCurrentFeed} = useContext(Authcontext) ;

  const navs = [
    {
      icon : <BiSolidMoviePlay size={30}/>,
      title : 'Long-Form Videos' ,
      value :'long-form'
    },
    {
      icon : <TbArrowBarBoth size={30}/>,
      title : 'All Videos',
      value :'all'
    },
    {
      icon : <FaPhotoVideo size={30}/>,
      title : 'Short-Form Videos' ,
      value : 'short-form'
    },
  ]
  

  return (
    <div className='fixed bottom-3 flex justify-center items-center gap-3'>
      {navs.map((nav,index) => (
        <Button 
        key={index} 
        title={nav.title}
        onClick={() => setCurrentFeed(nav.value)}
        >
          {nav.icon}
        </Button>
      ))}
    </div>
  )
}

export default HomeDownBar