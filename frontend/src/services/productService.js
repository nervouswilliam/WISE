import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getProductList = async() => {
    const response = await axios.get(
        `${BASE_URL}/products/list`,
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
    console.log(response.data)
    return response.data;
}

const searchProduct = async(parameter) => {
    const response = await axios.get(
        `${BASE_URL}/products/list?search=${parameter}`,
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
    console.log(response.data)
    return response.data;
}

const getProductDetail = async (id) => {
    const response = await axios.get(
        `${BASE_URL}/products/information/${id}`,
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
    return response.data;
}

const getProductsCategory = async () =>{
    const response = await axios.get(
        `${BASE_URL}/products/category`,
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
    return response.data;
}

const addImageUrl = async (base64String) => {
    const response = await axios.post(
        `${BASE_URL}/api/upload-image`, // Your backend endpoint
        { image: base64String }, // The request body with the 'image' key
        {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "Content-Type": "application/json" // Explicitly set to JSON
            }
        }
    );
    return response.data
}

const addProductDetail = async(productData) => {
    const response = await axios.post(
        `${BASE_URL}/products/information`, 
        productData, 
        {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        }
    );
}

const editProductDetail = async (id, productData) => {
    const response = await axios.put(
        `${BASE_URL}/products/information`,
        {
            ...productData,
            id: id
        },
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
    return response.data;
}

const deleteProduct = async (id) => {
    const response = await axios.delete(
        `${BASE_URL}/products/${id}`,
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
}

export default {
    getProductList,
    searchProduct,
    getProductDetail,
    getProductsCategory,
    addImageUrl,
    addProductDetail,
    editProductDetail,
    deleteProduct,
}