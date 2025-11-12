import { useNavigate, useParams } from "react-router-dom"
import productService from "../services/productService"
import { useEffect, useState } from "react"
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Loading from "../components/loading";

function ProductDetailPage({user}) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchProductDetail = async () => {
            if (!id) {
                setError("Product ID is missing.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // Assume productService.getProductDetail returns the product object directly
                // or data.output_schema if it's consistent with your other APIs
                const response = await productService.getProductDetail(id, user);
                setProduct(response.output_schema || response); // Adjust based on your API structure
            } catch (err) {
                console.error("Error fetching product detail:", err);
                setError("Failed to load product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    const navigate = useNavigate();

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="info">No product found for this ID.</Alert>
            </Container>
        );
    }

    // Helper to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };


    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleBackClick = () =>{
        navigate(-1);
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
                <Box
                sx={{
                    backgroundColor: "#6f42c1",
                    // Adjust these properties on the parent container
                    display: 'flex',
                    flexDirection: 'column', // Stack children vertically
                    alignItems: 'center', // Center children horizontally
                    justifyContent: 'center', // Center children vertically
                    height: '1vh', // Example height
                }}
                >    
                    <Button
                    variant="contained"
                    startIcon= {<ArrowBackIcon/>}
                    sx={{ backgroundColor: "#6f42c1" }}
                    onClick={handleBackClick}
                    >
                        Back
                    </Button>
                </Box>
                {/* Left Side: Product Image */}
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src={product.image_url || 'https://via.placeholder.com/600x400?text=Product+Image'}
                        alt={product.name}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: { xs: 300, md: 500 }, // Responsive height
                            objectFit: 'contain', // Ensures the image fits without cropping awkwardly
                            borderRadius: 2,
                            boxShadow: 3
                        }}
                    />
                </Grid>

                {/* Right Side: Product Information */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {product.name}
                        </Typography>

                        <Typography variant="h5" sx={{ mb: 2, color:"#6f42c1" }}>
                            {formatCurrency(product.price)}
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Product Code:</strong> {product.id || 'ID'}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Category:</strong> {product.category_name || 'Electronics'}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Supplier:</strong> {product.supplier_name || 'Electronics'}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Availability:</strong> {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                        </Typography>

                        <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ mt: 3, p: 1.5, backgroundColor: "#6f42c1" }}
                        disabled={product.stock === 0}
                        onClick={() => navigate(`/product/stock-add/${product.id}`)}
                        >
                        Add Stock
                        </Button>

                        <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{ ml: 2, mt: 3, p: 1.5, backgroundColor: "#6f42c1" }}
                        disabled={product.stock === 0}
                        onClick={() => navigate(`/product/edit/${product.id}`)}
                        >
                        Edit
                        </Button>

                        <Button
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                        sx={{ ml: 2, mt: 3, p: 1.5, backgroundColor: "red" }}
                        onClick={handleOpenDialog}
                        >
                        Delete
                        </Button>


                        <Dialog
                            open={open}
                            onClose={handleCloseDialog} // Close when clicking outside or pressing Escape
                        >
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} sx={{backgroundColor:"Yellow"}}>
                                    Cancel
                                </Button>
                                <Button onClick={() => {
                                    // Your delete logic goes here
                                    productService.deleteProduct(product.id, user);
                                    alert(`Product ${product.name} has been deleted!`);
                                    handleCloseDialog();
                                    navigate("/warehouse")
                                }} color="white" autoFocus sx={{backgroundColor:"Red"}}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {product.stock === 0 && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                This item is currently out of stock.
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProductDetailPage