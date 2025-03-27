import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/routes/api";
import { useEffect, useState } from "react";
import { Category } from "../Categories";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2, X } from "lucide-react";
import { Product } from "../ProductColumn";
import { transactions } from "@/routes/Warehouse/TransactionColumn";
import { handleLogout } from "@/routes/components/Header";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/routes/helper/NotificationProvider";

export function ProductAddPage() {
    const [image, setImage] = useState<string | null>(null);
    const [imageBackend, setImageBackend] = useState<string | ArrayBuffer | null>(null);
    const [search, setSearch] = useState("");
    const [categories, setCategory] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
        const {showNotification} = useNotification();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setImage(null); // Reset image preview
    };

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

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const responseImageUrl = await apiService.post<{"imageUrl": string}>("api/upload-image", {'image':imageBackend});
        const errorCodeImage = responseImageUrl.error_schema.error_code;
        let output = "";
        if(errorCodeImage === "S001"){
            output = responseImageUrl.output_schema.imageUrl;
        }
        const responseProduct = await apiService.post<Product>("products/information", {
                                                                                    'id': productId, 
                                                                                    'name': name, 
                                                                                    'price': price, 
                                                                                    'stock':stock, 
                                                                                    'category': newCategory, 
                                                                                    'image_url': output
                                                                                }
                                                        );
        const errorCodeProduct = responseProduct.error_schema.error_code;
        if(errorCodeProduct === "S001"){
            const ResponseTransaction = await apiService.post<transactions>("transaction/information", 
            {
                "transactionTypeId": 4,
                "id":productId,
                "price":price,
                "stock":stock,
                "reason": "Penambahan Barang Baru",
            });
            const errorCodeTransaction = ResponseTransaction.error_schema.error_code;
            if(errorCodeTransaction === "S001"){
                navigate("/product")
            } else if(errorCodeTransaction === "E006"){
                handleLogout(navigate, showNotification);
            }
        } else if(errorCodeProduct === "E006"){
            handleLogout(navigate, showNotification);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card >
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                </CardHeader>
                <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="image">Image</Label>
                                {image && (
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
                                )}
                                <Input id="image" className="!w-full" type="file" onChange={handleImageChange}/>
                                <Label htmlFor="ProductId">Product Id</Label>
                                <Input id="productId" placeholder="Product Id" onChange={(e) => setProductId(e.target.value)} required/>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Name of your Product" onChange={(e) => setName(e.target.value)} required/>
                                <Label htmlFor="price">Price</Label>
                                <p className="!text-red-500 text-left">*Tolong Masukan Angka saja</p>
                                <Input id="price" placeholder="Price of your Product" onChange={(e) => setPrice(e.target.value)} required/>
                                <Label htmlFor="stock">Stock</Label>
                                <Input id="stock" placeholder="Stock" onChange={(e) => setStock(e.target.value)} required/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="category">Category</Label>
                            </div>
                            <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                            <CommandInput placeholder="Category" onValueChange={(value) => 
                                                                                        {
                                                                                            setSearch(value);
                                                                                            setNewCategory(value);
                                                                                        }
                                                                                    }/>
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
                    <Button className="!text-white !bg-[#1100FF]">Cancel</Button>
                    <Button className="!text-white !bg-[#7142B0]" disabled={isLoading}>
                    {isLoading?(
                        <>
                        <Loader2 className="animate-spin" />
                        Please wait
                        </>
                    ):(
                        "Add"
                        )
                    }
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}