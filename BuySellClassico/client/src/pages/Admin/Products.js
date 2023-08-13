import { Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { UpdateProductStatus, getProducts} from '../../apicalls/product';
import moment from 'moment';
function Products() {

  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getProducts(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message)
    }
  }
   const statusUpdate =async(id,status)=>{
       try {
        dispatch(SetLoader(true));
       const response = await UpdateProductStatus(id,status);
       dispatch(SetLoader(false));
       if(response.success){
        message.success(response.message);
        getData();
       }
       else{
        throw new Error(response.message);
       }
       } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
       }
   }
  const columns = [
    {
      title: "Product",
      dataIndex: "name"
    },
    {
        title: "Seller",
        dataIndex: "name",
        render:(text,record)=>{
            return record.seller.name;
        }
      },
      {
        title: "Product Image",
        dataIndex: "image",
        render:(text,record)=>{
          return <img src={record?.images?.length>0 ? record.images[0]:""} alt=''
          className='w-20 h-20 object-cover rounded-md'/>
        }
      },
    {
      title: "Price",
      dataIndex: "price"
    },
    {
      title: "Category",
      dataIndex: "category"
    },
    {
      title: "Age",
      dataIndex: "age"
    },
    {
        title: "Status",
        dataIndex: "status",
        render:(text,record)=>{
          return record.status.toUpperCase();
        }
      },
    {
          title:"Added on",
          dataIndex:"createdAt",
          render:(text,record)=>{
           return moment(record.createAt).format("DD-MM-YYYY  hh:mm A");
          }
    },
   
    {
        title:"Action",
        dataIndex:"action",
        render:(text,record)=>{
            const {status, _id}=record
           return    <div className='flex gap-3'>
                  {status==="pending" && <span className='underline cursor-pointer'
                  onClick={()=>statusUpdate(_id,"approved")}>Approve</span>}
                  {status==="pending" && <span className='underline cursor-pointer'
                  onClick={()=>statusUpdate(_id,"rejected")}>Reject</span>}
                  {status==="approved" && <span className='underline cursor-pointer'
                  onClick={()=>statusUpdate(_id,"blocked")}>Block</span>}
                  {status==="blocked" && <span className='underline cursor-pointer'
                  onClick={()=>statusUpdate(_id,"approved")}>Unblock</span>}
                </div>
        },
    },
    {
      title:"Sales Status",
      dataIndex:"sold",
      render:(text,record)=>{
        return record.sold ? "Sold" : "Unsold";
      }
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={products} />
    </div>
  )
}

export default Products;