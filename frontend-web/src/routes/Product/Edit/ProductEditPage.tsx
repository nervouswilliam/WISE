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

export function ProductEditPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const navigate = useNavigate();
    const {showNotification} = useNotification();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file); // Convert file to Base64
          reader.onload = () => {
            if (typeof reader.result === "string") {
              setImage(reader.result); // Store Base64 string
            }
          };
        }
      };
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
    return (
    <Card >
        <CardHeader>
            <CardTitle>Edit Product {id}</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
            <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="image">Image</Label>
                        {image ? (
                            <img
                            src={image}
                            alt="Preview"
                            className="w-32 h-32 object-cover mb-2"
                            />
                        ) : product?.image_url ? (
                            <img
                            src={product.image_url}
                            alt="Existing"
                            className="w-32 h-32 object-cover mb-2"
                            />
                        ) : null}
                        <Input id="image" className="!w-full" type="file" onChange={handleFileChange}/>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Name of your Product" value={product?.name} onChange={(e) => handleInputChange("name",e.target.value)}/>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" placeholder="Price of your Product" value={product?.price} onChange={(e) => handleInputChange("price",e.target.value)}/>
                        <Label htmlFor="name">Stock</Label>
                        <Input id="name" placeholder="Stock" disabled className="bg-gray-200 text-gray-500 cursor-not-allowed" value={product?.stock} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="category">Category</Label>
                    </div>
                    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                    <CommandInput placeholder="Category" onValueChange={(value) => setSearch(value)}/>
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
            </form>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button className="!text-white !bg-[#1100FF]">Cancel</Button>
            <Button variant="destructive" className="!bg-red-800">Delete</Button>
            <Button className="!text-white !bg-[#7142B0]">Save</Button>
        </CardFooter>
    </Card>
    )
}

