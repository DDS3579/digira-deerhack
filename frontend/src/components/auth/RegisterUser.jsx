import { GalleryVerticalEnd } from "lucide-react";
// import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function RegisterUser() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Tole मित्र
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className={"flex flex-col gap-6"}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Fill in the form below to create your account
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Hari Bahadur"
                    required
                  />
                </Field>
                                                <Field>
                  <FieldLabel htmlFor="email">House Number</FieldLabel>
                  <Input
                    id="house-number"
                    type="number"
                    placeholder="567"
                    required
                  />
                  <FieldDescription>
                  </FieldDescription>
                </Field>
                                                                <Field>
                  <FieldLabel htmlFor="email">Profession</FieldLabel>
                  <Input
                    id="profession"
                    type="text"
                    placeholder="567"
                    required
                  />
                  <FieldDescription>
                  </FieldDescription>
                </Field>
                                <Field>
                  <FieldLabel htmlFor="email">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    type="number"
                    placeholder="9841XXXXXX"
                    required
                  />
                  <FieldDescription>
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="haribahadur@example.com"
                    required
                  />
                  <FieldDescription>
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" required />
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
                </Field>
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
