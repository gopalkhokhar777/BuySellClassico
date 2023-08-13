import { Button, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../../redux/loadersSlice';
import { getProducts,deleteProduct,UpdateProductSoldStatus} from '../../../apicalls/product';
import moment from 'moment';
import Bids from './Bids';
function Products() {
  const [showBids,setShowBids]=useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const {user}=useSelector((state)=>state.users);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isProductSold, setIsProductSold] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getProducts({
        seller:user._id
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message)
    }
  }
 
  const delProduct = async(id)=>{
    try {
      dispatch(SetLoader(true));
      const response = await deleteProduct(id);
      dispatch(SetLoader(false));
      if(response.success){
        message.success(response.message);
        getData();
      }
      else{
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message)
    }
  };

  const handleProductSold = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateProductSoldStatus(id);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        dispatch(SetLoader(false));
        message.error(response.message);
      }
    } catch (error) {
      message.error(message.error);
    }
  };
  

  const columns = [
    {
      title: "Name",
      dataIndex: "name"
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
      title: "Sales Status",
      dataIndex: "sold",
      render: (text, record) => {
        return (
          <div>
            {record.sold ? (
              <span style={{ color: "green" }}>Sold</span>
            ) : (
              <span style={{ color: "red",marginRight:"8px" }}>Not Sold</span>
            )}
            {!record.sold && !isProductSold && (
              <Button
                type="primary"
                onClick={() => {
                  handleProductSold(record._id);
                }}
              >
                Mark as Sold
              </Button>
            )}
          </div>
        );
      },
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
          title:"Added on",
          dataIndex:"createdAt",
          render:(text,record)=>{
           return moment(record.createAt).format("DD-MM-YYYY  hh:mm A");
          }
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return <div className='flex gap-5 item-center'>
          <i className="ri-delete-bin-line cursor-pointer"
          onClick={()=>{
                    delProduct(record._id);
          }}></i>
          <i className="ri-pencil-fill cursor-pointer"
            onClick={() => {
              setSelectedProduct(record);
              setShowProductForm(true);
            }}></i>

            <span className='underline cursor-pointer'
            onClick={()=>{
              setSelectedProduct(record);
              setShowBids(true);
            }}>Show Bids</span>
        </div>
      }
    }
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className='flex  justify-end mb-2'>
        <Button
          type='default'
          onClick={
            () => {
              setSelectedProduct(null);
              setShowProductForm(true)
            }}>
          Add Product
        </Button>

      </div>
      <Table columns={columns} dataSource={products} />
      {
        showProductForm &&
        <ProductForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      }
      {
        showBids &&
        <Bids
        showBidModal={showBids}
        setShowBidModal={setShowBids}
        selectedProduct={selectedProduct}/>
      }
    </div>
  )
}

export default Products;