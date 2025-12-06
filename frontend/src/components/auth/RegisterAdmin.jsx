import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PasswordFields from "@/components/auth/PasswordFields.jsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
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
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Get password fields from the form
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Prepare data object
    const data = {
      full_name: formObject.full_name,
      official_address: formObject.official_address,
      ward_official_name: formObject.ward_official_name,
      ward_no: formObject.ward_no,
      contact_tel: formObject.contact_tel,
      admin_phone: formObject.admin_phone,
      contact_mail: formObject.contact_mail,
      password: password,
    };

    try {
      const response = await registerWardAdmin(data);
      setSuccess(response.message || "Registration successful!");
      e.target.reset();
      // Optionally redirect after successful registration
      // setTimeout(() => {
      //   window.location.href = "/login";
      // }, 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="h-16 grid place-items-center">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Tole मित्र
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Fill in the form below to create your account
                  </p>
                </div>

                {error && (
                  <Field>
                    <FieldDescription className="text-destructive text-center">
                      {error}
                    </FieldDescription>
                  </Field>
                )}

                {success && (
                  <Field>
                    <FieldDescription className="text-green-600 text-center">
                      {success}
                    </FieldDescription>
                  </Field>
                )}

                {/* Full Name */}
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    name="full_name"
                    id="name"
                    type="text"
                    placeholder="Hari Bahadur"
                    required
                  />
                </Field>

                {/* Official Address */}
                <Field>
                  <FieldLabel htmlFor="house-number">Address</FieldLabel>
                  <Input
                    name="official_address"
                    id="address"
                    type="text"
                    placeholder="Satdobato, Lalitpur"
                    required
                  />
                </Field>

                {/* Ward Name */}
                <Field>
                  <FieldLabel htmlFor="ward-name">Ward Name</FieldLabel>
                  <Input
                    name="ward_official_name"
                    id="ward_official_name"
                    type="text"
                    placeholder="e.g. Baneshwor"
                    required
                  />
                </Field>

                {/* Ward Number */}
                <Field>
                  <FieldLabel htmlFor="ward-number">Ward Number</FieldLabel>
                  <Input
                    name="ward_no"
                    id="ward_no"
                    type="number"
                    placeholder="e.g. 10"
                    required
                  />
                </Field>

                {/* Telephone Number */}
                <Field>
                  <FieldLabel htmlFor="phone">Telephone Number</FieldLabel>
                  <Input
                    name="contact_tel"
                    id="contact_tel"
                    type="number"
                    placeholder="01-XXXXXXX"
                    required
                  />
                </Field>

                {/* Phone Number */}
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    name="admin_phone"
                    id="admin_phone"
                    type="number"
                    placeholder="9841XXXXXX"
                    required
                  />
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    name="contact_mail"
                    id="contact_mail"
                    type="email"
                    placeholder="haribahadur@example.com"
                    required
                  />
                </Field>

                {/* Password
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" name="password" required />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirm-password" type="password" required />
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                </Field> */}

                <PasswordFields />

                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
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
