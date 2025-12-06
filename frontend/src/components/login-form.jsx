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
  const [userType, setUserType] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      phone: formData.get("phone"),
      password: formData.get("password"),
      user_type: userType,
      _timestamp: Date.now() // Cache busting
    };

    console.log("Login attempt with credentials:", credentials);

    try {
      // Clear any existing user data
      localStorage.removeItem("user");
      localStorage.removeItem("user_type");
      localStorage.removeItem("login_time");
      
      // Clear fetch cache if possible
      if (caches && caches.keys) {
        caches.keys().then(keys => {
          keys.forEach(key => {
            caches.delete(key);
          });
        });
      }
      
      const response = await login(credentials);
      console.log("Login response:", response);
      
      // Store user data
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("user_type", response.user_type);
        localStorage.setItem("login_time", Date.now().toString());
        localStorage.setItem("session_id", `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      }
      
      // Clear form
      e.target.reset();
      
      // Force fresh redirect with cache busting
      const redirectUrl = response.user_type === "ward_admin" 
        ? "/ward/dashboard" 
        : "/dashboard";
      
      // Add timestamp to prevent cached redirect
      window.location.href = `${redirectUrl}?_=${Date.now()}`;
      
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

        {/* User type selection */}
        <Field>
          <FieldLabel htmlFor="userType">Login as:</FieldLabel>
          <select
            name="userType"
            id="userType"
            className="w-full p-2 border rounded-md"
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              setError(""); // Clear error when changing user type
            }}
            autoComplete="off"
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
            autoComplete="off"
            onChange={() => setError("")} // Clear error when typing
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
        
        <FieldSeparator>Or</FieldSeparator>
        
        <Field>
          <FieldDescription className="text-center">
            Don't have an account?<br/> 
            <a 
              href={`/registerUser?_=${Date.now()}`} 
              className="underline underline-offset-4 hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/registerUser?_=${Date.now()}`;
              }}
            >
              Register as User
            </a>
            {" "}/{" "}
            <a 
              href={`/registerAdmin?_=${Date.now()}`} 
              className="underline underline-offset-4 hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/registerAdmin?_=${Date.now()}`;
              }}
            >
              Register as Ward Admin
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}