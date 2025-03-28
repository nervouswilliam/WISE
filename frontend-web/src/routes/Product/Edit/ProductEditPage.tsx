import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiService } from "@/routes/api"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Product } from "../ProductColumn"
import { useState } from "react";
import { Category } from "../Categories"

   
  import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import { useNotification } from "@/routes/helper/NotificationProvider"
import { handleLogout } from "@/routes/components/Header"
import { Dialog, DialogDescription, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { transactions } from "@/routes/Warehouse/TransactionColumn"
import { Loader2, X } from "lucide-react"

export function ProductEditPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategory] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [image, setImage] = useState<string | null>(product?.image_url || null);
    const [imageBackend, setImageBackend] = useState<string | ArrayBuffer | null>(null);
    const [imageChange, setImageChange] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {showNotification} = useNotification();
    
    useEffect(() => {
        async function fetchProjectData() {
          try {
            const response = await apiService.get<Product>(`/products/information/${id}`);
            const errorCode = response.error_schema.error_code;
            const outputData = response?.output_schema;
            if(errorCode === "S001"){
                setProduct(outputData); 
            } else if(errorCode === "E006"){
              handleLogout(navigate, showNotification);
          }
          } catch (error) {
            setError("Failed to fetch data");
            console.error("Error fetching project data:", error);
            handleLogout(navigate, showNotification);
          }
        }
        fetchProjectData();
    }, []);
    useEffect(() => {
        async function fetchProjectCategory() {
          try {
            const response = await apiService.get<Category[]>(`/products/category`);
            const errorCode = response.error_schema.error_code;
            const outputData = response?.output_schema;
            if(errorCode === "S001"){
                setCategory(outputData); 
            } else if(errorCode === "E006"){
              handleLogout(navigate, showNotification);
          }
          } catch (error) {
            setError("Failed to fetch data");
            console.error("Error fetching project data:", error);
          }
        }
        fetchProjectCategory();
    }, []);
    if (error) return <p className="text-red-600">{error}</p>;
    const handleInputChange = (field: keyof Product, value: string | number) => {
        setProduct((prev) => ({
          ...prev!,
          [field]: value, // Dynamically update field
        }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setImageChange(true);
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // setImage(reader.result as string);
          const base64String = reader.result as string;
          const cleanBase64String = base64String.split(",")[1]
          setImage(base64String);
          setImageBackend(cleanBase64String);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveImage = () => {
      setImage(null);
      setImageBackend(null); // Reset image preview
    };

    const handleSubmit = async (e:React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      let output:Record<string, any> = {};
      if(imageChange){
        const responseImageUrl = await apiService.put<{"imageUrl": string, "publicId":string}>("api/update-image", {'image':imageBackend, 'public_id': product?.public_id});
        const errorCodeImage = responseImageUrl.error_schema.error_code;
        if(errorCodeImage === "S001"){
            output["imageUrl"] = responseImageUrl.output_schema.imageUrl;
            output["publicId"] = responseImageUrl.output_schema.publicId;
        }
      }
      const responseProduct = await apiService.put<Product>("products/information", {
                                                                                  'id': productId || product?.id, 
                                                                                  'name': name || product?.name, 
                                                                                  'price': price || product?.price, 
                                                                                  'stock':product?.stock, 
                                                                                  'category': newCategory || product?.category_name, 
                                                                                  'image_url': output["imageUrl"] || product?.image_url,
                                                                                  'public_id': output["publicId"] || product?.public_id,
                                                                              }
                                                      );
      const errorCodeProduct = responseProduct.error_schema.error_code;
      if(errorCodeProduct === "S001"){
          navigate(`/product/${product?.id}`);
      } else if(errorCodeProduct === "E006"){
          handleLogout(navigate, showNotification);
      }
    }
    return (
    <form onSubmit={handleSubmit}>
      <Card >
          <CardHeader>
              <CardTitle>Edit Product {id}</CardTitle>
          </CardHeader>
          <CardContent>
                  <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="image">Image</Label>
                          {image ? (
                              <div className="relative">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover"
                                />
                                {/* X Button for Removing Image */}
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-0 right-0 !bg-red-500 !text-white !rounded-full p-1 !hover:bg-red-600 !transition"
                                >
                                    <X size={16} />
                                </button>
                              </div>
                          ) : product?.image_url ? ( 
                            <img
                            src={product.image_url}
                            alt="existing"
                            className="w-32 h-32 object-cover"/>
                          ):null}
                          <Input id="image" className="!w-full" type="file" onChange={handleImageChange}/>
                          <Label htmlFor="name">Product Id</Label>
                          <Input id="name" placeholder="Name of your Product" disabled className="bg-gray-200 text-gray-500 cursor-not-allowed" value={product?.id} required/>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Name of your Product" value={product?.name} onChange={(e) => handleInputChange("name",e.target.value)} required/>
                          <Label htmlFor="price">Price</Label>
                          <Input id="price" placeholder="Price of your Product" value={product?.price} onChange={(e) => handleInputChange("price",e.target.value)} required/>
                          <Label htmlFor="name">Stock</Label>
                          <Input id="name" placeholder="Stock" disabled className="bg-gray-200 text-gray-500 cursor-not-allowed" value={product?.stock} />
                          <Label htmlFor="reason">Reason</Label>
                          <Input id="reason" placeholder="reason" onChange={(e) => setReason(e.target.value)} required/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="category">Category</Label>
                      </div>
                      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                      <CommandInput placeholder="Category" value={product?.category_name} onValueChange={(value) => 
                                                                                    {
                                                                                      setSearch(value),
                                                                                      setNewCategory(value);
                                                                                    }}/>
                      <CommandList>
                          <CommandGroup heading="Suggestions">
                              {
                                  search &&
                                  categories.filter((category) => category.name.toLowerCase().includes(search.toLowerCase())) .map((category) => (
                                      <CommandItem key={category.id} value={category.name}>
                                      {category.name}
                                      </CommandItem>
                              ))}
                          </CommandGroup>
                      </CommandList>
                      </Command>
                  </div>
          </CardContent>
          <CardFooter className="flex justify-between">
              <Button className="!text-white !bg-[#1100FF]" onClick={() => navigate(-1)}>Cancel</Button>
              <Dialog open={open}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="!bg-red-800" onClick={() => setOpen(true)}>Delete</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                      Apakah anda yakin ingin delete Produk Ini?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="destructive" className="!bg-yellow-500" onClick={() => setOpen(false)}>Tidak</Button>
                    <Button variant="destructive" className="!bg-red-800" type="submit">Ya</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button className="!text-white !bg-[#7142B0]" disabled={isLoading}>
                {isLoading?(
                    <>
                    <Loader2 className="animate-spin" />
                    Please wait
                    </>
                ):(
                    "Save"
                    )
                }
              </Button>
          </CardFooter>
      </Card>
    </form>
    )
}

