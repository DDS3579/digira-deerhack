import React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function PasswordFields({ onChange }) {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (onChange) onChange({ password: value, confirm });
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirm(value);
    if (onChange) onChange({ password, confirm: value });
  };

  return (
    <>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          minLength="6"
          required
        />
        <FieldDescription>Must be at least 6 characters long.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
        <Input
          id="confirm-password"
          name="confirm_password"
          type="password"
          value={confirm}
          onChange={handleConfirmChange}
          minLength="6"
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