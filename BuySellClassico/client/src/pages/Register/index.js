import {useEffect, React}from "react";
import {Button, Form,Input, message} from "antd";
import { Link, useNavigate } from 'react-router-dom';
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
const rules=[
  {
  required:true,
  message:'required'

}] ;
{/*  rules are validation...*/}

function Register(){
      const navigate = useNavigate();
      const dispatach = useDispatch();
     const onfinish=async(values)=>{
           try {
            dispatach(SetLoader(true));
             const response = await RegisterUser(values);
             dispatach(SetLoader(false));
             if(response.success){
              navigate("/");
              message.success(response.message);
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
      <div className="text-gray-400 text-xl">REGISTER</div>
    </div>
            <Divider/>
            <Form
            layout="vertical" onFinish={onfinish}>
                <Form.Item
                  label="Name"
                  name='name'
                  rules={rules}
                >
                    <Input placeholder="Name"/>
                </Form.Item>
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
                Register
               </Button>
          <div className="mt-5 text-center">
               <span className="text-gray-500">
                Already have an account? <Link to="/login" className="text-primary">Login</Link>
               </span>
               </div>
            </Form>
         </div>
        </div>
    )
}

export default Register;