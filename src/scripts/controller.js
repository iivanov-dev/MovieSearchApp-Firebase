import { API } from "./api.js";
import { View } from "./view.js";
import { Model } from "./model.js";
import { Storage } from "./storage.js";
import { MOVIES_STORAGE_KEY } from "./constants";

import { auth } from "./firebase.js";
import { Signin } from "../components/auth/signin.js";
import { onAuthStateChanged } from "firebase/auth";
export class Controller {
  constructor() {
    this.model = new Model({
      onFilmsChange: this.handleModelFilmsChange,
    });

    this.view = new View({
      onBtnSearchNode: this.handleViewBtnSearch,
      onBtnDeleteNode: this.handleViewDeleteMovies,
      onBtnLoginNode: this.handleViewLoginUser,
      onBtnRegisterNode: this.handleViewRegisterUser,
      onBtnDeleteUserNode: this.handleViewDeleteUser,
      onBtnLogoutNode: this.handleViewLogoutUser,
    });

    this.api = new API();

    this.storage = new Storage(MOVIES_STORAGE_KEY);

    this.auth = auth;

    this.signin = new Signin();
  }

  init() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log("init: User already logged in:", user.email);
        //this.view.updateAuthUI(user, true);
      } else {
        console.log("init: User logged out");
        //this.view.updateAuthUI(null, false);
      }
    });
  }

  handleModelFilmsChange = () => {
    this.view.renderFilms(this.model.pullFilms());
  };

  handleViewDeleteMovies = () => {
    this.storage.pullFilmsFromStorage().then((data) => {
      console.log("Deleted Films", data);

      this.storage.deleteFilms(data);
    });
  };

  handleViewLoginUser = async () => {
    if (this.auth.currentUser) {
      console.log("User already logged in");
      return;
    }
    try {
      const user = await this.signin.login(
        this.auth,
        "newuser@example.com",
        "NewPass123!",
      );
      console.log("Login successful!");
      console.log("User UID:", user.uid);
      console.log("User Email:", user.email);
      console.log("Last sign-in:", user.metadata?.lastSignInTime);
      console.log(this.auth.currentUser);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  handleViewRegisterUser = async () => {
    console.log("handleRegisterUser from controller begin!");
    try {
      // Пока хардкод, позже возьмём из формы
      const user = await this.signin.register(
        this.auth,
        "newuser@example.com",
        "NewPass123!",
      );
      console.log("Registration successful!");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);

      this.storage.pushUserToStorage(user);

      // Обновить UI
      //this.view.updateAuthUI?.(user, true);
    } catch (error) {
      console.error("Registration failed:", error.code, error.message);
    }
  };

  handleViewDeleteUser = async () => {
    const currentUser = this.auth.currentUser;
    await this.signin.delete(currentUser);
  };

  handleViewLogoutUser = async () => {
    if (!this.auth.currentUser) {
      console.log("User already logged out");
      return;
    }
    try {
      await this.signin.logout(this.auth);
      console.log("Logout successful!");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  handleViewBtnSearch = (TitleFilms) => {
    const inputValue = TitleFilms;
    if (inputValue === "") {
      this.view.showNoSearchResult("Please enter the movie title!");
      return;
    }

    this.api.pullFilms(inputValue).then((data) => {
      const fullFilmsArray = data.Search;

      this.model.pushFilms(fullFilmsArray);
      this.storage.pushFilmsToStorage(fullFilmsArray);
    });

    // this.storage.pullFilmsFromStorage().then((data) => {
    //     console.log(data);
    // })

    // this.storage.pushFilmsToStorage().then((data) => {
    //   console.log(data);
    // });
  };
}
