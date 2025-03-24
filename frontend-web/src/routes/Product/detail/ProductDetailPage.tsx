import { apiService } from "@/routes/api";
import { Product } from "../ProductColumn";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const {id} = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchProduct() {
      try{
        const response = await apiService.get<Product>(`products/information/${id}`)
        const errorCode = response?.error_schema.error_code;
        const outputSchema = response.output_schema;
        if(errorCode === "S001"){
          setProduct(outputSchema);
        }
      } catch {
        setError("Failed to fetch data");
      } finally{
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  // This would come from your API
  // const product = {
  //   id: "ch07",
  //   name: "CH07 Shell Chair",
  //   quantity: 150,
  //   color: "White",
  //   price: 599.00,
  //   totalPrice: 1198.00,
  //   reviews: 8,
  //   rating: 4,
  //   image: "https://res.cloudinary.com/dmq8stjkq/image/upload/v1742232165/loskck9ivu3ixlmkx88m.jpg",
  //   description: "The Shell Chair is a modern classic designed with exceptional craftsmanship and attention to detail.",
  //   details: {
  //     size: "29.4\" H x 35.8\" W x 32.7\" D",
  //     seatHeight: "14.5\"",
  //     materials: "Plywood, Oak Veneer, Semi-Aniline Italian Leather",
  //     color: "Cream Leather",
  //     weight: "40 lbs"
  //   },
  //   isNewCollection: true
  // };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Product Image */}
        <div className="md:w-1/2 relative">
          <img 
            src={product?.image} 
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
            <button className="!text-white !bg-[#7142B0] bg-orange-500 text-white font-medium px-8 py-4 rounded-full mt-4 md:mt-0">
            EDIT
            </button>
        </div>
      </div>
    </div>
  );
}