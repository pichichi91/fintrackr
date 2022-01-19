import { SignIn, SignUp } from '@clerk/nextjs'

const SignInPage = () => (
  <div className='signed-out-bg h-screen flex justify-center items-center'>
  <SignUp path="/sign-up" />
  </div>
)

export default SignInPage