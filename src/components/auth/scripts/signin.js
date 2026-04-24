import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
} from "firebase/auth";

export class Signin {
  constructor() {}

  async login(auth, email, password) {
  try {
    const userProfile = await signInWithEmailAndPassword(auth, email, password);
    return userProfile.user;
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
}

  async logout(auth) {
    console.log("logout ...");
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      return true;
    } catch (error) {
      console.error("logout error:", error.code, error.message);
      throw error;
    }
  }

  async register(auth, email, password) {
    console.log("Registering new user...");
    try {
      const userProfile = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User registered:", userProfile.user.email);
      return userProfile.user;
    } catch (error) {
      console.error("Register error:", error.code, error.message);
      throw error;
    }
  }

  async delete(user) {
    try {
      await deleteUser(user);
      console.log("User deleted success");
    } catch (error) {
      console.error("User deleted error:", error);
      throw error;
    }
  }
}
