import { GalleryVerticalEnd } from "lucide-react";
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

export default function RegisterAdmini() {
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
            <form className="flex flex-col gap-6">
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Fill in the form below to create your account
                  </p>
                </div>

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
                  <Button type="submit">Create Account</Button>
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
