import Modal from 'antd/es/modal/Modal'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { GetAllBid } from '../../../apicalls/product';
import { Table, message } from 'antd';
import moment  from 'moment';
import Divider from "../../../components/Divider";
function Bids({showBidModal,setShowBidModal,selectedProduct}) {
    const [bids,setBids]=useState();
    const dispatch = useDispatch();

    const getData = async()=>{
        try{
                dispatch(SetLoader(true));
                const response = await GetAllBid({
                    product:selectedProduct._id,
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
            title:"Bid Placed on",
            dataIndex:"createAt",
            render:(text,record)=>{
                return moment(text).format("MMMM Do YYYY, hh:mm a")
            }
        },
        {
            title:"Name",
            dataIndex:"name",
            render:(text,record)=>{
                return record.buyer.name
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
                    <p>Phone : {record.contact}</p>
                    <p>Email : {record.buyer.email}</p>
                </div>
            }
        }
       
    ];

    useEffect(()=>{
        if(selectedProduct){
            getData();
        }
 
    },[selectedProduct])
  return (
    <Modal
    title=""
    open={showBidModal}
    onCancel={()=>setShowBidModal(false)}
    centered
    width={1500}
    footer={null}
    > 
     <div className='flex gap-3 flex-col'>
     <h1 className='text-primary'>Bids</h1>
     <Divider/>
     <h1 className='text-xl text-gray-500'>Product name : {selectedProduct.name}</h1>

     <Table columns={columns} dataSource={bids}/>
     </div>

    </Modal>
  )
}

export default Bids