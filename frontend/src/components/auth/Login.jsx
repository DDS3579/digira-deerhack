import { GalleryVerticalEnd } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/services/api";

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("user");

  // Add a timestamp to prevent caching
  const [pageLoadTime] = useState(Date.now());

  // Clear old data on mount
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_type");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      phone: formData.get("phone"),
      password: formData.get("password"),
      user_type: userType,
    };

    console.log("Login attempt:", credentials);

    try {
      // Clear old data
      localStorage.removeItem("user");
      localStorage.removeItem("user_type");
      
      const response = await login(credentials);
      console.log("Login response:", response);
      
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("user_type", response.user_type);
        
        // Redirect based on user type
        setTimeout(() => {
          const redirectUrl = response.user_type === "ward_admin" 
            ? "/ward/dashboard" 
            : "/dashboard";
          window.location.href = redirectUrl;
        }, 100);
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="h-16 grid place-items-center">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Tole मित्र
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your phone number below to login to your account
                  </p>
                </div>

                {error && (
                  <Field>
                    <div className="text-destructive text-center p-2 border border-destructive rounded-md">
                      {error}
                    </div>
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="userType">Login as:</FieldLabel>
                  <select
                    id="userType"
                    className="w-full p-2 border rounded-md"
                    value={userType}
                    onChange={(e) => {
                      setUserType(e.target.value);
                      setError("");
                    }}
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
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </Field>

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
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}