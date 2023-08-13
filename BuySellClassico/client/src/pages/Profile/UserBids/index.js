import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { GetAllBid } from '../../../apicalls/product';
import { Table, message } from 'antd';
import moment  from 'moment';



function Bids() {
    const [bids,setBids]=useState();
    const dispatch = useDispatch();
    const {user} =useSelector((state)=>state.users);
        const getData = async()=>{
        try{
                dispatch(SetLoader(true));
                const response = await GetAllBid({
                  buyer:user._id
                });
                dispatch(SetLoader(false));
                if(response.success){
                    setBids(response.data);
                }
                else{
                    throw new Error(response.message);
                }
        }
        catch(error){
                dispatch(SetLoader(false));
                message.error(error.message);
        }
    }

    const columns =[
        {
                title:"Product",
                dataIndex:"product",
                render:(text,record)=>{
                    return record.product.name;
                }
        },
        {
            title:"Bid Placed on",
            dataIndex:"createAt",
            render:(text,record)=>{
                return moment(text).format("MMMM Do YYYY, hh:mm a")
            }
        },
        {
            title:"seller",
            dataIndex:"seller",
            render:(text,record)=>{
                return record.seller.name
            }
        },
        {
            title:"Offered Price",
            dataIndex:"offeredprice",
            render:(text,record)=>{
                return record.product.price;
            }
        },
        {
            title:"Bid Amount",
            dataIndex:"bidAmount"
        },
       
        {
            title:"Message",
            dataIndex:"message"
        },{
            title:"Contact Details",
            dataIndex:"contact",
            render:(text,record)=>{
             return   <div>
                    <p>Email : {record.seller.email}</p>
                </div>
            }
        }
       
    ];

    useEffect(()=>{
      getData();
 
    },[])
  return (
     <div className='flex gap-3 flex-col'>
     <Table columns={columns} dataSource={bids}/>
     </div>
  )
}

export default Bids