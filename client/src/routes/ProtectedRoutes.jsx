import { Authcontext } from '@/context/AuthContext'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoutes({children}) {

    const {accessToken} = useContext(Authcontext) ;

    if(!accessToken){
        return <Navigate to="/unauthorized" replace />;
    }

  return children ;

}

export default ProtectedRoutes ;