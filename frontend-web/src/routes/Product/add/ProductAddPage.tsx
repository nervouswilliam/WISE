import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/routes/api";
import { useEffect, useState } from "react";
import { Category } from "../Categories";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X } from "lucide-react";

export function ProductAddPage() {
    const [image, setImage] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [categories, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

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
            }
          } catch (error) {
            setError("Failed to fetch data");
            console.error("Error fetching project data:", error);
          }
        }
        fetchProjectCategory();
    }, []);

      return (
        <Card >
            <CardHeader>
                <CardTitle>Add Product</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
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
                            <Input id="image" className="!w-full" type="file" onChange={handleFileChange}/>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Name of your Product"/>
                            <Label htmlFor="price">Price</Label>
                            <p className="!text-red-500 text-left">*Tolong Masukan Angka saja</p>
                            <Input id="price" placeholder="Price of your Product"/>
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" placeholder="Stock"/>
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
                <Button className="!text-white !bg-[#7142B0]">Save</Button>
            </CardFooter>
        </Card>
      );
}