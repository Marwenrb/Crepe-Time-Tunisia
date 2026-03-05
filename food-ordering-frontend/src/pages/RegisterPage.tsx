import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as authApi from "@/api/authApi";
import { useQueryClient } from "react-query";
import { toast } from "sonner";

type FormData = { email: string; password: string; name: string; phone: string };

const RegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const signUpResult = await authApi.signUp(data);

      if (signUpResult.hasSession) {
        await queryClient.invalidateQueries("validateToken");
        toast.success("Account created! Signed in.");
        navigate("/");
        window.location.reload();
      } else {
        toast.success("Account created. Check your email to confirm, then sign in.");
        navigate("/sign-in");
      }
    } catch (err: unknown) {
      const ax = err as { message?: string };
      toast.error(ax.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone / WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+216 XX XXX XXX"
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 8, message: "Phone number must be at least 8 digits" },
                pattern: {
                  value: /^\+?[0-9\s\-()]{8,20}$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password", { required: "Password is required", minLength: 6 })} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/sign-in" className="font-medium text-crepe-purple hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
