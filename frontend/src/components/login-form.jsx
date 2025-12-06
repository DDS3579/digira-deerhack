import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { login } from "@/services/api"

export function LoginForm({
  className,
  ...props
}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      phone: formData.get("phone"),
      password: formData.get("password"),
    };

    try {
      const response = await login(credentials);
      // Store token or user data if provided by the API
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      // Redirect based on user type or to dashboard
      // You can customize this based on your routing needs
      if (response.user_type === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
      
      // Clear form on error too
      e.target.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props} 
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your phone number below to login to your account
          </p>
        </div>

        {error && (
          <Field>
            <div className="text-destructive text-center p-2 border border-destructive rounded-md bg-red-50">
              {error}
            </div>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input 
            name="phone"
            id="phone" 
            type="tel" 
            placeholder="984XXXXXXXX" 
            className="pl-3" 
            required 
          />
        </Field>
        
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input 
            name="password"
            id="password" 
            type="password" 
            required 
            autoComplete="off"
            onChange={() => setError("")} // Clear error when typing
          />
        </Field>
        
        <Field>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Don't have an account?<br/> 
            <a href="/registerUser" className="underline underline-offset-4">
              Register User
            </a>
            {" "}/{" "}
            <a href="/registerAdmin" className="underline underline-offset-4">
              Register Admin
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}