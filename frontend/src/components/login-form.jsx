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
  const [userType, setUserType] = useState("user"); // Add user type selection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      phone: formData.get("phone"),
      password: formData.get("password"),
      user_type: userType, // Add user_type to credentials
    };

    try {
      const response = await login(credentials);
      
      // Store user data
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("user_type", response.user_type);
      }
      
      // Redirect based on user type
      if (response.user_type === "ward_admin") {
        window.location.href = "/ward/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your phone number below to login to your account
          </p>
        </div>

        {error && (
          <Field>
            <FieldDescription className="text-destructive text-center">
              {error}
            </FieldDescription>
          </Field>
        )}

        {/* User type selection */}
        <Field>
          <FieldLabel htmlFor="userType">Login as:</FieldLabel>
          <select
            name="userType"
            id="userType"
            className="w-full p-2 border rounded-md"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">Community Member</option>
            <option value="ward_admin">Ward Admin</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input 
            name="phone"
            id="phone" 
            type="tel" 
            placeholder="984XXXXXXXX" 
            className="pl-3" 
            required 
            pattern="[0-9]{10}"
            maxLength="10"
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
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Don't have an account?<br/> 
            <a href="/registerUser" className="underline underline-offset-4">
              Register as User
            </a>
            {" "}/{" "}
            <a href="/registerAdmin" className="underline underline-offset-4">
              Register as Ward Admin
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}