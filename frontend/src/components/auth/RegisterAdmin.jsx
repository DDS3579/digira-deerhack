import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerWardAdmin } from "@/services/api";

export default function RegisterAdmin() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.target);

    const wardOfficialName = formData.get("ward_official_name");
    const wardNo = formData.get("ward_no");
    const officialAddress = formData.get("official_address");
    const contactTel = formData.get("contact_tel");
    const contactMail = formData.get("contact_mail");
    const adminPhone = formData.get("admin_phone");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    console.log("Form values:", {
      wardOfficialName, wardNo, officialAddress, contactTel, contactMail, adminPhone, password, confirmPassword
    });

    if (!wardOfficialName || !wardNo || !officialAddress || !contactTel || !contactMail || !adminPhone || !password) {
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


    if (adminPhone.length < 10) {
      setError("Phone number must be at least 10 digits");
      setIsLoading(false);
      return;
    }

    const data = {
      ward_official_name: wardOfficialName.trim(),
      ward_no: wardNo.trim(),
      official_address: officialAddress.trim(),
      contact_tel: contactTel.trim(),
      contact_mail: contactMail.trim(),
      admin_phone: adminPhone.trim(),
      password: password
    };

    console.log("Sending data to API:", data);

    try {
      const response = await registerWardAdmin(data);
      console.log("API Response:", response);
      setSuccess(response.message || "Registration successful! Waiting for approval. You can login once approved.");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
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
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Register as Ward Admin</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Register to manage your ward and toles
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

                <Field>
                  <FieldLabel htmlFor="ward_official_name">Ward Official Name</FieldLabel>
                  <Input
                    name="ward_official_name"
                    id="ward_official_name"
                    type="text"
                    placeholder="e.g., Ward Office Kathmandu 1"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="ward_no">Ward Number</FieldLabel>
                  <Input
                    name="ward_no"
                    id="ward_no"
                    type="text"
                    placeholder="e.g., 1, 2, 3..."
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="official_address">Official Address</FieldLabel>
                  <Input
                    name="official_address"
                    id="official_address"
                    type="text"
                    placeholder="Full official address of the ward office"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact_tel">Office Telephone</FieldLabel>
                  <Input
                    name="contact_tel"
                    id="contact_tel"
                    type="text"
                    placeholder="01-XXXXXXX"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact_mail">Official Email</FieldLabel>
                  <Input
                    name="contact_mail"
                    id="contact_mail"
                    type="email"
                    placeholder="ward-office@example.com"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="admin_phone">Admin Phone Number</FieldLabel>
                  <Input
                    name="admin_phone"
                    id="admin_phone"
                    type="text"
                    placeholder="9841XXXXXX (for login)"
                    pattern="[0-9]{10}"
                    minLength="10"
                    maxLength="10"
                    required
                  />
                  <FieldDescription>
                    This phone number will be used for login
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
                  <FieldDescription className="text-sm">
                    Note: Your registration will be pending approval. You can login once approved by system administrator.
                  </FieldDescription>
                </Field>

                <Field>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Registering..." : "Register as Ward Admin"}
                  </Button>
                </Field>
              </FieldGroup>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4 hover:text-primary">
                  Login
                </a>
                <br />
                Are you a community member?{" "}
                <a href="/registerUser" className="underline underline-offset-4 hover:text-primary">
                  Register as User
                </a>
              </FieldDescription>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Ward Office"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}