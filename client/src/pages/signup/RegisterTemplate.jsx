import React, { useContext } from 'react'
import Login from './Login'
import Register from './Register'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Authcontext } from '@/context/AuthContext'

function RegisterTemplate() {

    const {activeTab , setActiveTab} = useContext(Authcontext) ;

  return (
    <div className='h-[100vh] w-[100vw] flex justify-center items-center overflow-auto'>
         <Tabs defaultValue="login" className="w-full max-w-md pt-20" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Login />
            </TabsContent>
            <TabsContent value="register">
                <Register buttonText={'Register'}/>
            </TabsContent>
         </Tabs>
    </div>
  )
}

export default RegisterTemplate