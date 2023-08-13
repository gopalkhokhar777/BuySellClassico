import React, { useEffect } from "react";
import {Button, Form,Input, message} from "antd";
import { Link, useNavigate } from 'react-router-dom';
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";

const rules=[
  {
  required:true,
  message:'required'

}] ;
{/*  rules are validation...*/}

function Login(){
      const navigate = useNavigate();
      const dispatach =useDispatch();
     const onFinish=async(values)=>{
             try {
              dispatach(SetLoader(true));
              const response = await LoginUser(values);
              dispatach(SetLoader(false));
              if(response.success){
               message.success(response.message);
               localStorage.setItem("token",response.data);
               window.location.href="/";
              }
              else{
               throw new Error(response.message); 
              }
             } catch (error) {
              dispatach(SetLoader(false));
               message.error(error.message);
             }
     }
     useEffect(()=>{
      if(localStorage.getItem("token")){
            navigate("/");
      }
     },[])
    return (
        <div className="h-screen bg-primary flex justify-center items-center ">
         <div className="bg-white p-5 rounded w-[450px]">
         <div className="flex flex-col items-center justify-center bg-primary py-6">
      <div className="text-white text-4xl font-bold mb-4">🏛️ BuySellClassico 🏛️</div>
      <div className="text-gray-400 text-xl">LOGIN</div>
    </div>
            <Divider/>
            <Form
            layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Email"
                  name='email'
                  rules={rules}
                >
                    <Input placeholder="Email"/>
                </Form.Item>
                <Form.Item
                  label="Password"
                  name='password'
                  rules={rules}
                >
                    <Input type="password" placeholder="Password"/>
                </Form.Item>
               <Button className="mt-2" type="primary" htmlType="submit" block>
                Login
               </Button>
          <div className="mt-5 text-center">
               <span className="text-gray-500">
                Don't have an account? <Link to="/register" className="text-primary">Register</Link>
               </span>
               </div>
            </Form>
         </div>
        </div>
    )
}

export default Login;