import React, { useState, useEffect } from 'react'
import { message, Badge, Avatar, notification } from "antd";
import { GetCurrentUser } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice';
import { SetUser } from '../redux/usersSlice';
import Notifications from './Notifications';
import { GetAllNotifications, ReadAllNotifications } from '../apicalls/notifications';

function Protected({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      }
      else {
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      message.error(error.message);

    }
  }
  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const readNotifications = async () => {
    try {
      const response = await ReadAllNotifications();
      if (response.success) {
        getNotifications();
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {

      message.error(error.message);
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    }
    else {

      navigate("/login");
    }

  }, [])
  return (
    (user &&

      (<div>
        {/*  header*/}
        <div
          className='flex justify-between items-center bg-primary p-5'
        >
          <h1 className='text-2xl text-white cursor-pointer' onClick={() => navigate("/")}>
          🏛️ BuySellClassico 🏛️
          </h1>

          <div className= 'user-container bg-white py-2 px-2 rounded flex gap-2 items-center ant-row'>
            <span className='username underline cursor-pointer uppercase ant-col-xs-24 ant-col-xl-12'
              onClick={() => {
                if (user.role === "user") navigate("/profile");
                else navigate("/admin");
              }}
            >{user.name}</span>
            <Badge count={
              notifications?.filter((notification) => !notification.read).length
            }
              onClick={() => {
                readNotifications();
                setShowNotifications(true);

              }}
              className='cursor-pointer'>
              <Avatar size="medium"
                icon={<i class="ri-notification-2-line"></i>} 
                style={{backgroundColor:"#FFD66B"}}/>
            </Badge>
            <i className="ri-logout-box-r-line ml-10 text-red-500"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        <div className='p-5'>{children}</div>

        {<Notifications
          notifications={notifications}
          reloadNotifications={getNotifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications} />}
      </div>
      )
    )
  )
}

export default Protected;