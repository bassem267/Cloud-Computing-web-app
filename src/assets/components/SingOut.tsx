import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";

const SignOut = () => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button onClick={handleSignOut} className="text-white">
      Sign out
    </button>
  );
};

export default SignOut;
