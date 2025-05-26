import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Authcontext } from '@/context/AuthContext'
import axios from 'axios'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'

function Login({buttonText}) {

  const {loginData , setLoginData , navigate} = useContext(Authcontext) ;

  const loginUser = async(e) => {
    e.preventDefault() ;
    const {email , password} = loginData ;
    try {
      const response = await axios.post('/login' , {
        email , password
      })
      if(response.data.error){
        toast.error(response.data.error)
      }else{
        toast.success('Login Successful !') ;
        setLoginData({email : '' , password:''}) ;
        navigate('/home')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className='w-full sm:w-[28rem]'>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your credentails email and password to Signin !</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={loginUser}>

          <div className="mb-3">
              <Label className={'mb-1'}>Email</Label>
              <Input
              type='email'
              placeholder='abc@gmail.com ....'
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData , email : e.target.value})}
              />
          </div>

          <div className="mb-3">
              <Label className={'mb-1'}>Password</Label>
              <Input
              type='password'
              placeholder='xxxxxxxx ....'
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData , password : e.target.value})}
              />
          </div>

          <Button type='submit' className='mt-4 w-full sticky bottom-0 bg-black text-white'>
            {buttonText || 'Submit'}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}

export default Login