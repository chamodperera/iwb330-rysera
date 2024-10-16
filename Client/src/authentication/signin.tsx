// import GoogleButton from "@/components/googleButton";
import { Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }), 
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "Contact number can only contain digits." }),
  universityOrCompany: z.string().min(10, {
    message: "University / Company must be at least 10 characters.",
    }), 
})
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../components/ui/input"


export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "", 
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact No</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="universityOrCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University / Company</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />  {/* Error message for universityOrCompany */}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800"> Create Account</Button>
      </form>
    </Form>
  )
}


export default function Signin() {

  return (
    <>
      <div className="flex justify-end">
        <Link
          className="font-medium hover:underline text-muted-foreground text-base"
          to="/auth/signup"
        >
          Create an Account
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Login to your Account
          </h1>
          <p className="text-muted-foreground">
            Login to your account to continue using our services
          </p>
        </div>
        {/* <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-sm font-medium">
            CONTINUE WITH
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        <div className="space-y-4">
          <GoogleButton />
        </div> */}
        <div><ProfileForm/></div>
        <div className="text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a className="underline text-muted-foreground" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline text-muted-foreground" href="#">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </>
  );
}
