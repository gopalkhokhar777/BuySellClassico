import Modal from 'antd/es/modal/Modal'
import {React,useEffect,useRef, useState} from 'react'
import { Col, Form, Input, Tabs,Row, message } from 'antd'
import { useDispatch, useSelector } from "react-redux";
import TextArea from 'antd/es/input/TextArea'
import { addProduct, EditProduct } from '../../../apicalls/product';
import { SetLoader } from '../../../redux/loadersSlice';
import Images from './images';


const additionalThings =[
    {
        label:"Bill available",
        name:"billAvailable"
    },
    {
        label:"warranty available",
        name:"warrantyAvailable"
    },
    {
        label:"Accessories available",
        name:"accessoriesAvailable"
    },
    {
        label:"Box available",
        name:"boxAvailable"
    },
]
const rules=[
    {
        required:true,
        message:"Required"
    }
]
function ProductForm({showProductForm,setShowProductForm,selectedProduct,getData}){
      const [selectedTab, setSeletedTab]=useState("1");
     const dispatch =useDispatch();
     const {user} = useSelector((state)=>state.users)
    const onFinish =async(values)=>{
       try {
        dispatch(SetLoader(true));
        let response = null;
        if(selectedProduct){
            response = await EditProduct(selectedProduct._id, values);
        }else{
            values.seller = user._id;
            values.status = "pending";
         response =   await addProduct(values);
        }
         
        dispatch(SetLoader(false));
        if(response.success){
            message.success(response.message);
            getData();
            setShowProductForm(false);
        }
        else{
            message.error(response.message);
        }
       } catch (error) {
        dispatch(SetLoader(false));
              message.error(error.message);
       }
    }
    const formRef  = useRef(null);
    useEffect(()=>{
          if(selectedProduct){
            formRef.current.setFieldsValue(selectedProduct);
          }
    },[])
  return (
    <Modal
    title=""
    open={showProductForm}
    onCancel={()=>{setShowProductForm(false)}}
    centered
    width={1000}
    okText="save"
    onOk={()=>formRef.current.submit()}
    {...(selectedTab==="2" && {footer:false})}>
     <div>
      <h1 className="text-primary text-2xl text-center font-semibold uppercase">
        {selectedProduct ? "Edit Product": "Add Product"}
      </h1>
     <Tabs defaultActiveKey='1'
       activeKey={selectedTab}
       onChange={key=>setSeletedTab(key)}>
        <Tabs.TabPane tab="General" key="1">
         <Form layout='vertical' ref={formRef}
         onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={rules}>
                <Input type='text'/>
            </Form.Item>
         
            <Form.Item label="Description" name="description"rules={rules}>
                 <TextArea type="text"/>
            </Form.Item>
            <Row
            gutter={[16,16]}>
                <Col span={8}>
                    <Form.Item label="Price" name="price"rules={rules}>
                        <Input type='number'/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Category" name="category"rules={rules}>
                       <select name='' id="">
                       <option value="">Select</option>
                       <option value="cooler">Air Cooler</option>
                        <option value="book">Books</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="electronics">Electronics</option>
                        <option value="sports">Sports</option>
                       </select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Age" name="age"rules={rules}>
                        <Input type='number'/>
                    </Form.Item>
                </Col>
            </Row>

            <div className='flex gap-7'>
               {additionalThings.map((item)=>{
                return (
                    <Form.Item label={item.label} name={item.name}
                    valuePropName='checked'>
                        <Input type='checkbox' value={item.name}
                        onChange={(e)=>{
                            formRef.current.setFieldsValue({
                            [item.name]:e.target.checked,
                        });
                        }}
                        checked={formRef.current?.getFieldsValue(item.name)}/>
                    </Form.Item>
                );
               })}
            </div>

             <Row>
                <Col span={8}>
                <Form.Item label="Show Bids on Product Page"
            name="showBidsOnProductPage"
                    valuePropName='checked'>
                        <Input type='checkbox' 
                        onChange={(e)=>{
                            formRef.current.setFieldsValue({
                                showBidsOnProductPage:e.target.checked
                        });
                        }}
                        checked={formRef.current?.getFieldsValue("showBidsOnProductPage")}
                        style={{width:50,marginLeft:20}}/>
                    </Form.Item>
                </Col>
             </Row>
            </Form>
    
        </Tabs.TabPane>
        <Tabs.TabPane tab="Images" key="2" 
        disabled={!selectedProduct}>
           <Images
           selectedProduct={selectedProduct}
           getData={getData}
           setShowProductForm={setShowProductForm}/>
        </Tabs.TabPane>
     </Tabs>
     </div>
    </Modal>
  )
}

export default ProductForm