'use client';

import type { SignupFormState } from '@/hooks/use-signup-form';
import { SignupFormIdentityFields } from './signup-form-identity-fields';
import { SignupFormPasswordFields } from './signup-form-password-fields';
import { SignupFormTermsFields } from './signup-form-terms-fields';

export function SignupFormFields({ form }: { form: SignupFormState }) {
  const { handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SignupFormIdentityFields form={form} />
      <SignupFormPasswordFields form={form} />
      <SignupFormTermsFields form={form} />
    </form>
  );
}
