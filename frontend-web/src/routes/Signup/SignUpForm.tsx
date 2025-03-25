import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { apiService } from "../api";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../helper/NotificationProvider";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [imageBackend, setImageBackend] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({name: '', email: '', password: '', confirmPassword: ''});
  const {showNotification} = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  // Extract initials from the name
  const getInitials = (fullName: string):string => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: ''};

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    }
    if (!name) {
      newErrors.name = 'username is required';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'password do not match'
      valid = false;
    }

    setError(newErrors);
    return valid;
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if(validate()){
      const response = await apiService.post<{"imageUrl": string}>("api/upload-image", {'image':imageBackend});
      const errorCodeImage = response.error_schema.error_code;
      const output = response.output_schema.imageUrl;
      if(errorCodeImage === "S001"){
        const response1 = await apiService.post("user/sign-up", {'name': name, 'email': email, 'password': password, 'role': 'user', 'imageUrl': output})
        const errorCode = response1.error_schema.error_code;
        if(errorCode === "S001"){
            setIsLoading(false);
            navigate("/login");
            showNotification("Register Successful", "success");
        }
      }
    }
    
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold !text-[#7142B0]">Register</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your Credentials Below
        </p>
      </div>


      <div className="grid gap-6">
        <div className="flex flex-col items-center gap-4">
          <label className="relative w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-200">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-gray-600">
                {getInitials(name)}
              </span>
            )}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 p-2 rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>

        <div className="grid gap-2">
          {error && <p className="text-red-500 text-sm">{error.name}</p>}
          <Label htmlFor="name">Username</Label>
          <Input id="name" type="text" value = {name} onChange={(e) => setName(e.target.value)} placeholder="username" required />
        </div>
        <div className="grid gap-2">
          {error && <p className="text-red-500 text-sm">{error.email}</p>}
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value = {email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
           {error && <p className="text-red-500 text-sm">{error.password}</p>}
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full !text-white !bg-[#7142B0]" disabled={isLoading}>
          {isLoading?(
            <>
              <Loader2 className="animate-spin" />
              Please wait
            </>
          ):(
            "Register"
          )
          }
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  )
}
