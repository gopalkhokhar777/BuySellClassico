import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment';

export const General = () => {
    const {user}=useSelector((state)=>state.users);
  return (
    <div className="flex flex-col w-1/3">
    <div className="mb-4">
      <h2 className="text-2xl font-semibold">Profile Information</h2>
      <div className="border rounded-lg p-4 bg-white shadow-md">
        <div className="mb-2">
          <span className="text-primary font-semibold">Name:</span>{' '}
          <span className="text-xl">{user.name}</span>
        </div>
        <div className="mb-2">
          <span className="text-primary font-semibold">Email:</span>{' '}
          <span className="text-xl">{user.email}</span>
        </div>
        <div>
          <span className="text-primary font-semibold">Created At:</span>{' '}
          <span className="text-xl">
            {moment(user.createdAt).format('MMM D, YYYY hh:mm A')}
          </span>
        </div>
      </div>
    </div>
  </div>
  )
}
