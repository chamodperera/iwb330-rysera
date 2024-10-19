import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../components/ui/input";
import { UseUser } from "@/userContext";
import { User } from "@/types";
import { registerUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";

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
});

export function ProfileForm() {
  const { setUser } = UseUser();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      contactNumber: "",
      universityOrCompany: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user: User = await registerUser({
      name: values.username,
      contact: values.contactNumber,
      organization: values.universityOrCompany,
    });

    setUser(user);
    console.log("user registered", user);
    navigate("/dashboard");
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
              <FormMessage />
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
                <Input placeholder="contact no" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder="organization" {...field} />
              </FormControl>
              <FormMessage /> {/* Error message for universityOrCompany */}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800"
        >
          {" "}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
