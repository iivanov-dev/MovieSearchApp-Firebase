import { auth } from "../../../scripts/firebase.js";
import { Signin } from "./signin.js";

class AuthForm {
  constructor() {
    this.signin = new Signin();
    this.auth = auth;

    this.titleNode = document.querySelector(".js-auth-title");
    this.descriptionNode = document.querySelector(".js-auth-description");

    this.formNode = document.querySelector(".js-auth-form");
    this.emailInputNode = document.querySelector(".js-auth-email");
    this.passwordInputNode = document.querySelector(".js-auth-password");
    this.confirmPasswordInputNode = document.querySelector(
      ".js-auth-check-password",
    );
    this.submitBtnNode = document.querySelector(".js-auth-submit");

    this.toggleTextNode = document.querySelector(".js-auth-toggle-text");
    this.toggleLinkNode = document.querySelector(".js-auth-toggle-link");

    this.isLoginMode = true;
    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");

    if (mode === "register") {
      this.setRegisterMode();
    } else {
      this.setLoginMode();
    }

    this.toggleLinkNode.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggleMode();
    });

    this.formNode.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  setLoginMode() {
    this.isLoginMode = true;
    this.titleNode.textContent = "Login";
    this.descriptionNode.textContent = "Please enter your email and password";
    this.submitBtnNode.textContent = "Login";
    this.toggleTextNode.textContent = "Don't have an account?";
    this.toggleLinkNode.textContent = "Register";
    this.confirmPasswordInputNode.style.display = "none";
    this.confirmPasswordInputNode.required = false;
    history.replaceState({}, "", window.location.pathname);

    console.log("login read");
  }

  setRegisterMode() {
    this.isLoginMode = false;
    this.titleNode.textContent = "Registration";
    this.descriptionNode.textContent = "Create a new account";
    this.submitBtnNode.textContent = "Register";
    this.toggleTextNode.textContent = "Already have an account?";
    this.toggleLinkNode.textContent = "Login";
    this.confirmPasswordInputNode.style.display = "block";
    this.confirmPasswordInputNode.required = true;
    history.replaceState({}, "", window.location.pathname + "?mode=register");
    
    console.log("register read");
  }

  toggleMode() {
    if (this.isLoginMode) {
      this.setRegisterMode();
    } else {
      this.setLoginMode();
    }
  }

  async handleSubmit() {
    const email = this.emailInputNode.value.trim();
    const password = this.passwordInputNode.value;
    const confirmPassword = this.confirmPasswordInputNode.value;

    if (!email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    if (!this.isLoginMode) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      try {
        const user = await this.signin.register(this.auth, email, password);
        console.log("Registration successful!", user);
        alert("Registration successful! Redirecting to Movie Search...");
        window.location.href = "../../index.html";
      } catch (error) {
        console.error("Registration failed:", error.code, error.message);
        alert("Registration failed: " + this.getErrorMessage(error.code));
      }
    } else {
      try {
        const user = await this.signin.login(this.auth, email, password);
        console.log("Login successful!", user);
        alert("Login successful! Redirecting to Movie Search...");
        window.location.href = "../../index.html";
      } catch (error) {
        console.error("Login failed:", error.code, error.message);
        alert("Login failed: " + this.getErrorMessage(error.code));
      }
    }
  }

  getErrorMessage(code) {
    const messages = {
      "auth/user-not-found": "User with this email does not exist",
      "auth/wrong-password": "Incorrect password",
      "auth/email-already-in-use": "This email is already registered",
      "auth/weak-password": "Password is too weak",
      "auth/invalid-email": "Invalid email format",
    };
    return messages[code] || "An error occurred. Please try again.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AuthForm();
});
