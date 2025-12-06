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
import { registerUser, getWards } from "@/services/api";

export default function RegisterUser() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wards, setWards] = useState([]);
  const [isLoadingWards, setIsLoadingWards] = useState(true);

  // Fetch wards on component mount
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const wardsData = await getWards();
        setWards(wardsData);
      } catch (err) {
        console.error("Error fetching wards:", err);
        setError("Failed to load wards. Please refresh the page.");
      } finally {
        setIsLoadingWards(false);
      }
    };
    fetchWards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    
 
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const houseNo = formData.get("house_no");
    const phone = formData.get("phone");
    const profession = formData.get("profession");
    const wardId = formData.get("ward_id");
    const toleName = formData.get("tole_name");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    console.log("Form values:", {
      firstName, lastName, houseNo, phone, profession, wardId, toleName, password, confirmPassword
    });

  
    if (!firstName || !lastName || !houseNo || !phone || !profession || !wardId || !toleName || !password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }


    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }


    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }


    if (phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      setIsLoading(false);
      return;
    }


    const data = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      house_no: houseNo.trim(),
      phone: phone.trim(),
      profession: profession.trim(),
      ward_id: parseInt(wardId),
      tole_name: toleName.trim(),
      password: password
    };

    console.log("Sending data to API:", data);

    try {
      const response = await registerUser(data);
      console.log("API Response:", response);
      setSuccess(response.message || "Registration successful! You can now login.");
      

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
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
          <div className="w-full max-w-md">
            <form className={"flex flex-col gap-6"} onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Create User Account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Register as a community member
                  </p>
                </div>

                {error && (
                  <Field>
                    <div className="text-destructive text-center p-2 border border-destructive rounded-md">
                      {error}
                    </div>
                  </Field>
                )}

                {success && (
                  <Field>
                    <div className="text-green-600 text-center p-2 border border-green-600 rounded-md">
                      {success}
                    </div>
                  </Field>
                )}

                {/* Name Fields - Split into First and Last */}
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                    <Input
                      name="first_name"
                      id="first_name"
                      type="text"
                      placeholder="Hari"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                    <Input
                      name="last_name"
                      id="last_name"
                      type="text"
                      placeholder="Bahadur"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="house_no">House Number</FieldLabel>
                  <Input
                    name="house_no"
                    id="house_no"
                    type="text"
                    placeholder="567"
                    required
                  />
                </Field>
                
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    name="phone"
                    id="phone"
                    type="text"
                    placeholder="9841234567"
                    pattern="[0-9]{10}"
                    minLength="10"
                    maxLength="10"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="profession">Profession</FieldLabel>
                  <Input
                    name="profession"
                    id="profession"
                    type="text"
                    placeholder="e.g., Engineer, Teacher, Doctor"
                    required
                  />
                </Field>

                {/* Ward Selection */}
                <Field>
                  <FieldLabel htmlFor="ward_id">Select Ward</FieldLabel>
                  {isLoadingWards ? (
                    <div className="p-2 border rounded-md text-center">Loading wards...</div>
                  ) : wards.length > 0 ? (
                    <select
                      name="ward_id"
                      id="ward_id"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select your ward</option>
                      {wards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          Ward {ward.ward_no} - {ward.ward_official_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-destructive text-sm p-2 border rounded-md">
                      No wards available. Please contact administrator.
                    </div>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="tole_name">Tole Name</FieldLabel>
                  <Input
                    name="tole_name"
                    id="tole_name"
                    type="text"
                    placeholder="Enter your tole/village name"
                    required
                  />
                  <FieldDescription>
                    If your tole is not listed, it will be created automatically
                  </FieldDescription>
                </Field>

                {/* Password Fields */}
                <div className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      name="password"
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      minLength="6"
                      required
                    />
                    <FieldDescription>
                      Must be at least 6 characters long.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm_password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      name="confirm_password"
                      id="confirm_password"
                      type="password"
                      placeholder="Confirm your password"
                      minLength="6"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <Button 
                    type="submit" 
                    disabled={isLoading || isLoadingWards || wards.length === 0}
                    className="w-full"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Field>
              </FieldGroup>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4 hover:text-primary">
                  Login
                </a>
                <br />
                Are you a ward admin?{" "}
                <a href="/registerAdmin" className="underline underline-offset-4 hover:text-primary">
                  Register as Ward Admin
                </a>
              </FieldDescription>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Community"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}