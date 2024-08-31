import { SignInForm } from '@/components/SignInForm';
import React from 'react'

const SignIn = () => {
  return (
    <section className={"flex min-h-screen items-center justify-between"}>
      <SignInForm />
    </section>
  );
}

export default SignIn