import { axiosInstance } from "./axiosInstance";


// add new proudct..
export const addProduct =async(payload)=>{
    try {
        const response = await axiosInstance.post("/api/products/add-product",payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
}
// get all product..
export const getProducts =async(filters)=>{
    try {
        const response = await axiosInstance.post("/api/products/get-products",filters);
        return response.data;
    } catch (error) {
        return error.message;
    }
};

// edit product...
export const EditProduct =async(id,payload)=>{
    try{
        const response = await axiosInstance.put(`/api/products/edit-product/${id}`,payload);
        return response.data;
    }catch(error){
        return error.message;
    }
};

// get product by id..
export const GetProductById =async(id)=>{
    try {
        const response = await axiosInstance.get(`/api/products/get-product-by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.message;
        
    }
}

// delete product...
export const deleteProduct =async(id)=>{
    try{
        const response = await axiosInstance.delete(`/api/products/delete-product/${id}`);
        return response.data;
    }catch(error){
        return error.message;
    }
};

// upload image..
export  const UploadProductImage = async(payload)=>{
    try {
        const response = await axiosInstance.post("/api/products/upload-product-image",payload);
        return response.data;
    } catch (error) {
        return error.message;
    }
}


// update product status...
export const UpdateProductStatus = async(id,status)=>{
    try {
         const response = await axiosInstance.put(`/api/products/update-product-status/${id}`,{status});
         return response.data;
    } catch (error) {
        return error.message;
    }
}


// Update product sold status
export const UpdateProductSoldStatus = async (productId) => {
    try {
      const response = await axiosInstance.put(`/api/products/update-product-sold/${productId}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  };

//place a new bid...
export const PlaceNewBid = async(payload)=>{
    try {
        const response = await axiosInstance.post("/api/bids/place-new-bid",payload);
        return response.data;
    } catch (error) {
        return error.message
    }
}

// get all bids
export const GetAllBid = async(filters)=>{
    try {
        const response = await axiosInstance.post("/api/bids/get-all-bids",filters);
        return response.data;
    } catch (error) {
        return error.message
    }
}

