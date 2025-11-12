import axios from "axios";
import { supabase } from '../supabaseClient.js';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const getProductList = async() => {
//     const response = await axios.get(
//         `${BASE_URL}/products/list`,
//         {
//             headers:{
//                 "Authorization": localStorage.getItem("token")
//             }
//         }
//     );
//     console.log(response.data)
//     return response.data;
// }

const getProductList = async(user_id) => {
    const { data, error } = await supabase
    .from('view_products')
    .select()
    .eq('user_id', user_id);

    if (error) {
        console.error('Error fetching data:', error)
        return
    }
    return data;
}

// const searchProduct = async(parameter) => {
//     const response = await axios.get(
//         `${BASE_URL}/products/list?search=${parameter}`,
//         {
//             headers:{
//                 "Authorization": localStorage.getItem("token")
//             }
//         }
//     );
//     console.log(response.data)
//     return response.data;
// }

// const searchProduct = async(user, parameter) => {
//     const { data, error } = await supabase
//     .from('view_products')
//     .select()
//     .ilike('name', `%${parameter}%`)
//     .eq('user_id', user.id);


//     if (error) {
//         console.error('Error fetching data:', error);
//         return;
//     }
//     return data;
// }

const searchProduct = async (user, parameter) => {
  const { data, error } = await supabase
    .from('view_products')
    .select()
    .or(`name.ilike.%${parameter}%,id.ilike.%${parameter}%`)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }

  return data;
};


    // const getProductDetail = async (id) => {
    //     const response = await axios.get(
    //         `${BASE_URL}/products/information/${id}`,
    //         {
    //             headers:{
    //                 "Authorization": localStorage.getItem("token")
    //             }
    //         }
    //     );
    //     return response.data;
    // }

const getProductDetail = async (id, user) => {
    const { data, error } = await supabase
    .from('view_products')
    .select()
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }
    return data;
}

// const getProductsCategory = async () =>{
//     const response = await axios.get(
//         `${BASE_URL}/products/category`,
//         {
//             headers:{
//                 "Authorization": localStorage.getItem("token")
//             }
//         }
//     );
//     return response.data;
// }

const getProductsCategory = async (user) =>{
    const { data, error } = await supabase
    .from('categories')
    .select()
    .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching data:', error)
        return
    }
    return data;
}

// const addImageUrl = async (base64String) => {
//     const response = await axios.post(
//         `${BASE_URL}/api/upload-image`, // Your backend endpoint
//         { image: base64String }, // The request body with the 'image' key
//         {
//             headers: {
//                 "Authorization": localStorage.getItem("token"),
//                 "Content-Type": "application/json" // Explicitly set to JSON
//             }
//         }
//     );
//     return response.data
// }


// const addImageUrl = async (file) => {
//     // const fileName = `${Date.now()}-${file.name}`;

//     // const { data, error } = await supabase.storage
//     // .from("profile_picture")
//     // .upload(fileName, file);

//     // if (error) {
//     // console.error("Upload failed:", error);
//     // throw error;
//     // }

//     // // ✅ Use the render endpoint instead of object/public
//     // const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/render/image/public/profile_picture/${fileName}`;

//     // return imageUrl;

//     const fileName = `${Date.now()}_${file.name}`;

//     const { data, error } = await supabase.storage
//     .from('profile_picture') // 👈 must match your bucket name
//     .upload(fileName, file);

//     if (error) throw error;

//     // Get public URL (only works if bucket is public)
//     const { data: { publicUrl } } = supabase.storage
//     .from('profile_picture')
//     .getPublicUrl(fileName);

//     return publicUrl;
// };

// const addImageUrl = async (file, bucketName, fileName = null) => {
//   // Ensure 'file' is a proper File object
//   if (!file || !(file instanceof File)) {
//     console.error("No file provided or invalid file object");
//     return null;
//   }

//   // Determine file extension
//   const ext = file.name.split('.').pop();
//   const finalFileName = fileName ? `${fileName}.${ext}` : file.name;
//   const filePath = `${finalFileName}`;

//   // Upload to Supabase Storage
//   const { data, error } = await supabase.storage
//     .from(bucketName)
//     .upload(filePath, file, { cacheControl: '3600', upsert: true });

//   if (error) {
//     console.error("Error uploading file:", error);
//     return null;
//   }

//   // Get public URL
//   const { publicUrl, error: urlError } = supabase.storage
//     .from(bucketName)
//     .getPublicUrl(filePath);

//   if (urlError) {
//     console.error("Error getting public URL:", urlError);
//     return null;
//   }

//   return publicUrl.publicUrl;
// };

const addImageUrl = async (file, bucketName, fileName = null) => {
  if (!file || !(file instanceof File)) {
    console.error("No file provided or invalid file object");
    return null;
  }

  const ext = file.name.split('.').pop();
  const finalFileName = fileName ? `${fileName}.${ext}` : file.name;
  const filePath = `${finalFileName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    return null;
  }

  // Get public URL
  const { data: urlData, error: urlError } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (urlError) {
    console.error("Error getting public URL:", urlError);
    return null;
  }

  return urlData.publicUrl; // ✅ this is the actual URL string
};





// const addProductDetail = async(productData) => {
//     const response = await axios.post(
//         `${BASE_URL}/products/information`, 
//         productData, 
//         {
//             headers: {
//                 "Authorization": localStorage.getItem("token"),
//                 "Content-Type": "application/json"
//             }
//         }
//     );
// }

const addProductDetail = async(productData, categoryData, supplierData) => {
    const { data, error } = await supabase
        .from('products')
        .insert([productData]) 
        .select(); 

    if (data && categoryData) {
        const { error: categoryError } = await supabase
            .from('categories_product')
            .insert([{ product_id: data[0].id, category_id: categoryData.category_id, user_id: productData.user_id }]);
            if (categoryError) {
                console.error("Error inserting product:", categoryError);
                throw categoryError;
            }
    }

    if (supplierData){
        const {error: supplierError} = await supabase
            .from('supplier_product')
            .insert([{product_id: data[0].id, supplier_id: supplierData.supplier_id, user_id: productData.user_id}])
        if (supplierError) {
            console.error("Error inserting supplier product:", supplierError);
            throw supplierError;
        }
    }

    if (error) {
        console.error("Error inserting product:", error);
        throw error;
    }

}

const addProductCategory = async(category, productId) => {
    const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .insert([{ name: category, user_id: (await supabase.auth.getUser()).data.user.id }])
            .select();

    if (categoryError) {
        console.error("Error inserting category:", categoryError);
        throw categoryError;
    }

    const category_id = categoryData[0].id;
    const { error: categoryProduct } = await supabase
            .from('categories_product')
            .insert([{ product_id: productId, category_id: category_id, user_id: (await supabase.auth.getUser()).data.user.id }])
            .select();
    if (categoryProduct) {
        console.error("Error inserting category Product:", categoryProduct);
        throw categoryProduct;
    }
    return categoryData;
}

// const editProductDetail = async (id, productData) => {
//     const response = await axios.put(
//         `${BASE_URL}/products/information`,
//         {
//             ...productData,
//             id: id
//         },
//         {
//             headers:{
//                 "Authorization": localStorage.getItem("token")
//             }
//         }
//     );
//     return response.data;
// }

const editProductDetail = async (id, productData, categoryData, supplierData) => {
    const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .eq('user_id', productData.user_id)
        .select();
    console.log("categoryData", categoryData);
    if (categoryData) {
        console.log("Updating category for product:", id, categoryData);
        const { error: categoryError } = await supabase
            .from('categories_product')
            .update({ category_id: categoryData.category_id })
            .eq('product_id', id)
            .eq('user_id', productData.user_id);
            if (categoryError) {
                console.error("Error updating product category:", categoryError);
                throw categoryError;
            }
    }

    if (supplierData){
        const { error: supplierError } = await supabase
            .from('supplier_product')
            .update({ supplier_id: supplierData.supplier_id })
            .eq('product_id', id)
            .eq('user_id', productData.user_id);
            if (supplierError) {
                console.error("Error updating product supplier:", supplierError);
                throw supplierError;
            }
    }

    if (error) {
        console.error("Error updating product:", error);
        throw error;
    }


    return data;
}

const deleteProduct = async(id, user) => {
    const {data, error} = await supabase
        .from("products")
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    if (error){
        console.log("Error delete Data", error)
    }
}

const getCategoryId = async(categoryName, user) => {
    const { data, error } = await supabase
        .from('categories')
        .select()
        .eq('name', categoryName)
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error("Error fetching category ID:", error);
        return null;
    }

    return data.id;
}

const getProductSalesByCategory = async(user) => {
    const { data, error } = await supabase
        .from('view_category_sales')
        .select()
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching product sales by category:", error);
        return [];
    }

    return data;
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
    addProductCategory,
    getProductSalesByCategory,
    getCategoryId,
}