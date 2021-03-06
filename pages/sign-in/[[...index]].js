import { SignIn } from '@clerk/nextjs'

const SignInPage = () => (
  <div className='signed-out-bg h-screen flex justify-center items-center'>
  <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
)

export default SignInPage