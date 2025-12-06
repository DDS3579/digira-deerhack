import React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function PasswordFields() {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  return (
    <>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FieldDescription>Must be at least 8 characters long.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <Input
          id="confirm-password"
          name="confirm_password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {confirm && confirm !== password && (
          <FieldDescription className="text-destructive">
            Passwords do not match.
          </FieldDescription>
        )}
      </Field>
    </>
  );
}

export default PasswordFields;