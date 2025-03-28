import { apiService } from "@/routes/api";
import { Product } from "../ProductColumn";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleLogout } from "@/routes/components/Header";
import { useNotification } from "@/routes/helper/NotificationProvider";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const {id} = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {showNotification} = useNotification();
  useEffect(() => {
    async function fetchProduct() {
      try{
        const response = await apiService.get<Product>(`products/information/${id}`)
        const errorCode = response?.error_schema.error_code;
        const outputSchema = response.output_schema;
        if(errorCode === "S001"){
          setProduct(outputSchema);
        } else if(errorCode === "E006"){
          handleLogout(navigate, showNotification);
      }
      } catch {
        setError("Failed to fetch data");
        handleLogout(navigate, showNotification);
      } finally{
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Product Image */}
        <div className="md:w-1/2 relative">
          <img 
            src={product?.image_url} 
            alt={product?.name} 
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        {/* Right side - Product Details */}
        <div className="md:w-1/2">
          
            <h1 className="text-4xl font-bold mb-2">{product?.name}</h1>
            
            {/* Price */}
            <div className="mb-6">
                <div className="text-gray-500 mb-2">HARGA</div>
                <div className="text-3xl font-medium text-orange-500">
                  {
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product?.price??0)
                  }
                </div>
            </div>
            <div className="mb-8">
                <div className="text-gray-500 mb-2">CATEGORY</div>
                  {product?.category_name}
            </div>

            <div className="mb-8">
                <div className="text-gray-500 mb-2">STOCK</div>
                    {product?.stock}
            </div>
            <div className="flex justify-center gap-4">
              <Button className="!text-white !bg-[#1100FF]" onClick={() => navigate(-1)}>Back</Button>
              <Button className="!text-white !bg-[#7142B0] bg-orange-500 text-white font-medium px-8 py-4 rounded-full mt-4 md:mt-0" onClick={() => navigate(`/product/edit/${id}`)}>
              EDIT
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}