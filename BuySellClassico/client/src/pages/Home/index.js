import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { getProducts } from "../../apicalls/product";
import { message } from "antd";
import Divider from "../../components/Divider"; 
import {useNavigate} from "react-router-dom";
import Filters from "./Filters";
function Home(){
    const [search,setSearch]=useState("");
    const [showFilters,setShowFilters] =useState(true);
    const {user} = useSelector((state)=>state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts]=useState([]);

    const [filters, setFilters]=useState({
        status:"approved",
        category:[],
        age:[],
        sold:false
    });

    const getData = async()=>{
        try {
            dispatch(SetLoader(true));
            const response = await getProducts({search,...filters});
            dispatch(SetLoader(false));
            if(response.success){
                setProducts(response.data);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    }
    useEffect(()=>{
     getData();
    },[search,filters]);
    const handleSearch = (event) => {
        setSearch(event.target.value);
      };
    return (
        <div className="flex gap-5">
         {showFilters && <Filters
         showFilters={showFilters}
         setShowFilters={setShowFilters}
         filters={filters}
         setFilters={setFilters}
         />}

         <div className="flex flex-col gap-5 w-full">
         <div className="flex gap-5 items-center">
              {!showFilters &&   <i className="ri-equalizer-line text-2xl cursor-pointer"
              onClick={()=>setShowFilters(!showFilters)}></i>}
                <input type="text"
                placeholder="Search Products here..."
                className="border border-gray-300 rounded border-solid px-2 py-1 h-14 w-full"
                value={search}
                onChange={handleSearch}/>
                </div>

      
               <div className={`
               grid gap-5 ${showFilters? "grid-cols-4":"grid-cols-5"}`}>
               {products?.map((product)=>{
                    return <div className="border border-gray-300 rounded border-solid flex flex-col gap-2 pb-2 cursor-pointer" 
                    key={product._id} onClick={()=>{navigate(`/product/${product._id}`)}}>
                     <img  src={product.images[0]} className="w-full h-52 p-2 rounded-md" alt=""/>
                  
                     <div className="px-2 flex flex-col">
                            <h1 className="text-lg font-semibold">{product.name}</h1>
                            <p className="text-sm">{product.age}{` `}{product.age === 1 ? "year":"years"} old</p>
                            <Divider/>
                            <span className="text-xl font-semibold text-green-700">
                            ₹ {product.price}
                            </span>
                     </div>
                        </div>
                })}
       
               </div>
         </div>
        </div>
    )
}

export default Home;