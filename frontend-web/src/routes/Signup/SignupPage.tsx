import { SignUpForm } from "./SignUpForm"
import signupImage from "../../assets/signupImage.png"

export default function SignUpPage() {
  return (
    // <div className="grid h-screen w-full lg:grid-cols-2">
    //     <div className="flex flex-col gap-4 p-6 md:p-10 h-full">
    //         <div className="flex flex-1 items-center justify-center">
    //             <div className="w-full max-w-xs">
    //                 <SignUpForm />
    //             </div>
    //         </div>
    //     </div>
    //     <div className="relative hidden bg-muted lg:block h-full">
    //         <img
    //         src={warehouseImg}
    //         alt="Image"
    //         className="absolute inset-0 h-full w-full object-fill"
    //         />
    //     </div>
    // </div>
    <div className="grid h-screen w-full lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10 h-full">
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <SignUpForm />
                </div>
            </div>
        </div>
        <div className="relative hidden bg-muted lg:flex justify-center items-center">
            <img
            src={signupImage}
            alt="Image"
            className="h-[450px] w-[450px] object-contain"
            />
        </div>
    </div>

  )
}