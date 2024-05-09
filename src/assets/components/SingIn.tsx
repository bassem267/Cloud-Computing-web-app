import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";

const SignIn = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button onClick={handleSignIn} className="text-white">
      Sign in with Google
    </button>
  );
};

export default SignIn;
