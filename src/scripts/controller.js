import { API } from "./api.js";
import { View } from "./view.js";
import { Model } from "./model.js";
import { Storage } from "./storage.js";
import { MOVIES_STORAGE_KEY } from "./constants";

import { auth } from "./firebase.js";
import { Signin } from "../components/auth/scripts/signin.js";
import { onAuthStateChanged } from "firebase/auth";
export class Controller {
  constructor() {
    this.model = new Model({
      onFilmsChange: this.handleModelFilmsChange,
    });

    this.view = new View({
      onBtnSearchNode: this.handleViewBtnSearch,
      onBtnDeleteFilmsNode: this.handleViewDeleteFilms,
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
        this.view.updateAuthUI(user, true);
      } else {
        console.log("init: User logged out");
        this.view.updateAuthUI(null, false);
      }
    });
  }

  handleModelFilmsChange = () => {
    this.view.renderFilms(this.model.pullFilms());
  };

  handleViewDeleteFilms = () => {
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

    const basePath =
      window.location.hostname === "iivanov-dev.github.io"
        ? "/MovieSearchApp-Firebase"
        : "";

    window.location.href = `${basePath}/components/auth/auth.html`;
  };

  handleViewRegisterUser = async () => {
    const basePath =
      window.location.hostname === "iivanov-dev.github.io"
        ? "/MovieSearchApp-Firebase"
        : "";

    window.location.href = `${basePath}/components/auth/auth.html?mode=register`;
  };

  handleViewDeleteUser = async () => {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.log("No user to delete");
      return;
    }
    try {
      await this.storage.deleteUserFromStorage(currentUser.uid);
      await this.signin.delete(currentUser);

      console.log("User fully deleted");
      //this.view.updateAuthUI?.(null, false);
    } catch (error) {
      console.error("Delete failed:", error.code, error.message);
      //this.view.showError?.("Delete failed: " + error.message);
    }
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
