import React, { useContext } from 'react' ;
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Authcontext } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function Register({buttonText}) {

  const {registerData , setRegisterData , setActiveTab} = useContext(Authcontext) ;

  const registerUser = async(e) => {
    e.preventDefault() ;
    const {username , userid , email , password} = registerData ;
    try {
      const response = await axios.post('/register' , {
        username ,
        userid ,
        email , 
        password
      })
      if(response.data.error){
        toast.error(response.data.error)
      }else{
        toast.success('Registeration Successful !')
        setRegisterData({}) ;
        setActiveTab('login')
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className='w-full sm:w-[28rem]'>
      <CardHeader>
        <CardTitle>Create a new Account</CardTitle>
        <CardDescription>Enter your details to get Started !</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={registerUser}>

          <div className="mb-3">
              <Label className={'mb-1'}>UserName</Label>
              <Input
              type='text'
              placeholder='John Doe ....'
              value={registerData.username}
              onChange={(e) => setRegisterData({...registerData , username : e.target.value})}
              />
          </div>

           <div className="mb-3">
              <Label className={'mb-1'}>UserID</Label>
              <Input
              type='text'
              placeholder='abc123...'
              value={registerData.userid}
              onChange={(e) => setRegisterData({...registerData , userid : e.target.value})}
              />
          </div>

          <div className="mb-3">
              <Label className={'mb-1'}>Email</Label>
              <Input
              type='email'
              placeholder='abc@gmail.com ....'
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData , email : e.target.value})}
              />
          </div>

          <div className="mb-3">
              <Label className={'mb-1'}>Password</Label>
              <Input
              type='password'
              placeholder='xxxxxxxx ....'
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData , password : e.target.value})}
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

export default Register