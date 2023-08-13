import React, { useState } from 'react'
import { Tabs } from 'antd'
import Products from "./Products/index"
import UserBids from "./UserBids/index";
import { useSelector } from 'react-redux';
import { General } from './General';
export const Profile = () => {
  const {user} =useSelector((state)=>state.users);

  return (
    <div>
         <Tabs defaultActiveKey='1'>
                  <Tabs.TabPane tab="Products" key="1">
                        <Products/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="My Bids" key="2">
                  <UserBids/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="General" key="3">
                         <General/>
                  </Tabs.TabPane>
                  </Tabs>
    </div>
  )
}
