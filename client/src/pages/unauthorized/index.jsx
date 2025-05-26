import React from 'react'
import { Link } from 'react-router-dom'

function Unauthorized() {
  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-3'>
        <p>
            404 Error , Access Denied
        </p>
        <Link className='text-blue-500 underline' to={'/'}>
        SignUp
        </Link>
    </div>
  )
}

export default Unauthorized