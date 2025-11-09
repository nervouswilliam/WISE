import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Autocomplete,
    Select,
    MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import productService from '../services/productService'; 
import transactionService from '../services/transactionService';
import { supabase } from '../supabaseClient';
import Loading from '../components/loading';
import supplierService from '../services/supplierService';

function AddEditProductPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        id: '',
        name: '',
        price: 0,
        selling_price: 0,
        stock: 0,
        category: '',
        imageUrl: '',
        supplier:'',
    });

    const [transaction, setTransaction] = useState({
        transaction_type_id: 0,
        reason: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [supplier, setSupplier] = useState([]);

    const isEditMode = id !== undefined;

    useEffect(() => {
        const fetchProductData = async () => {
            if (isEditMode) {
                setTransaction({ transaction_type_id: 2 });
                try {
                    setLoading(true);
                    const response = await productService.getProductDetail(id, user);
                    const fetchedData = response.output_schema || response;
                    setProduct({
                        ...fetchedData,
                        imageUrl: fetchedData.image_url,
                        category: fetchedData.category_name,
                        supplier: fetchedData.supplier_name,
                    }); 
                } catch (err) {
                    console.error("Error fetching product data: ", err);
                    setError("Failed to load product details.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setTransaction({ transaction_type_id: 3 });
            }
        };
        fetchProductData();
    }, [id, isEditMode]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getProductsCategory(user);
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try{
                const suppliers = await supplierService.getSupplierList(user);
                setSupplier(suppliers.data);
                console.log("supplier:", suppliers.data);
            } catch (err){
                console.error("Error Fetching Suppliers", err);
            }
        };
        fetchSuppliers();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleImageUpload(file);
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploadingImage(true);
        
        try {
            const response = await productService.addImageUrl(file, 'product-images', 'productImage_' + Date.now());
            const imageUrl = response;
            setProduct(prevProduct => ({ ...prevProduct, imageUrl }));
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Image upload failed. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploadingImage) {
            alert("Please wait for the image to finish uploading.");
            return;
        }

        try {
            const userId = (await supabase.auth.getUser()).data.user.id;

            const submissionData = {
                id: product.id,
                name: product.name,
                price: parseInt(product.price, 10),
                selling_price: parseInt(product.selling_price, 10),
                stock: parseInt(product.stock, 10),
                image_url: product.imageUrl,
                user_id: userId,
            };

            const categoryId = await productService.getCategoryId(product.category, user);

            const categoryData = {
                product_id: product.id,
                category_id: categoryId
            }

            const supplierId = await supplierService.getSupplierId(product.supplier, user);
            const supplierData = {
                product_id: product.id,
                supplier_id: supplierId,
            }

            const transactionData = {
                transaction_type_id: transaction.transaction_type_id,
                product_id: product.id,
                price_per_unit: parseInt(product.price, 10),
                quantity: parseInt(product.stock, 10),
                reason: transaction.reason,
                user_id: userId,
            };

            const existingCategory = categories.find(cat => cat.name === product.category);
            if (!existingCategory) {
                await productService.addProductCategory(product.category, submissionData.id);
            }
            
            if (isEditMode) {
                await productService.editProductDetail(submissionData.id, submissionData, categoryData, supplierData);
            } else {
                await productService.addProductDetail(submissionData, categoryData, supplierData);
                await transactionService.addTransaction(transactionData);
            }
            alert(`Product ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate(`/product/${submissionData.id}`);
        } catch (err) {
            console.error("Error submitting product data:", err);
            setError("Failed to save product. Please try again.");
        }
    };

    const handleBackClick = () => navigate(-1);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <Button
                    onClick={handleBackClick}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mr: 2, backgroundColor: "#6f42c1", color: "white" }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </Typography>
            </Box>
            
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    boxShadow: 1
                }}
            >
                <Grid container spacing={3}>
                    {/* Image */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>
                            Product Image
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {uploadingImage && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <CircularProgress size={20} sx={{ mr: 2 }} />
                                <Typography>Uploading image...</Typography>
                            </Box>
                        )}
                        {product.imageUrl && (
                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Current Image:
                                </Typography>
                                <img
                                    src={product.imageUrl}
                                    alt="Current Product"
                                    style={{ maxWidth: '100%', height: 'auto', marginTop: '8px' }}
                                />
                            </Box>
                        )}
                    </Grid>

                    {/* Product ID */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Product Id"
                            name="id"
                            value={product.id}
                            onChange={handleChange}
                            required
                            disabled={isEditMode}
                        />
                    </Grid>

                    {/* Product Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Selling Price */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Selling Price"
                            name="selling_price"
                            type="number"
                            value={product.selling_price}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    {/* Stock */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Stock"
                            name="stock"
                            type="number"
                            value={product.stock}
                            onChange={handleChange}
                            required
                            disabled={isEditMode}
                            sx={{ opacity: isEditMode ? 0.6 : 1 }}
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={categories}
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(event, newValue) => {
                                setProduct(prevProduct => ({
                                    ...prevProduct,
                                    category: newValue ? newValue.name : ""
                                }));
                            }}
                            onInputChange={(event, newInputValue) => {
                                setProduct(prevProduct => ({
                                    ...prevProduct,
                                    category: newInputValue
                                }));
                            }}
                            value={categories.find(c => c.name === product.category) || null}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="Category"
                                    required
                                    name="category"
                                    sx={{ mr: 10, width:220 }}
                                />
                            )}
                        />
                    </Grid>

                    {/* Supplier */}
                    <Grid item xs={12} md={6}>
                        <Select
                        value={product.supplier || "Supplier"}
                        label="Supplier"
                        onChange={(event, newValue) => {setProduct(
                            prevProduct => ({
                                ...prevProduct,
                                supplier: newValue,
                            })                            
                        )}}
                        sx={{width:220}}>
                            {supplier.map((s) => (
                                <MenuItem value={s.name}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    {/* Reason */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Reason"
                            name="reason"
                            value={transaction.reason}
                            onChange={(e) =>
                                setTransaction(prev => ({ ...prev, reason: e.target.value }))
                            }
                            required
                        />
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={isEditMode ? <SaveIcon /> : <AddIcon />}
                            sx={{ mt: 2, backgroundColor: "#6f42c1" }}
                            disabled={uploadingImage}
                        >
                            {isEditMode ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default AddEditProductPage;
