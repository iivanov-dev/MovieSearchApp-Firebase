import { API } from "./api.js";
import { View } from "./view.js";
import { Model } from "./model.js";
import { Storage } from "./storage.js";
import { MOVIES_STORAGE_KEY } from "./constants";

export class Controller {
  constructor() {
    this.model = new Model({
      onFilmsChange: this.handleModelFilmsChange,
    });

    this.view = new View({
      onBtnSearchNode: this.handleViewBtnClickNode,
      onBtnDeleteNode: this.handleViewDeleteMovies,
      onBtnLoginNode: this.handleLoginUser,
    });

    this.api = new API();

    this.storage = new Storage(MOVIES_STORAGE_KEY);
  }

  init() {
    // this.storage.delete();
  }

  handleModelFilmsChange = () => {
    this.view.renderFilms(this.model.getFilms());
  };

  handleViewDeleteMovies = () => {
    this.storage.pull().then((data) => {
      console.log(data);
      this.storage.delete(data);
      console.log("Deleted");
    });
  };

  handleLoginUser = () => {
    console.log("Login");
  };

  handleViewBtnClickNode = (TitleFilms) => {
    // const cache = {};
    // cache[""] = {
    //   expires: Date.now() + 1000 * 15,
    //   data: [],
    // };

    const inputValue = TitleFilms;
    if (inputValue === "") {
      this.view.showNoSearchResult("Please enter the movie title!");
      return;
    }

    // if (
    //   cache[inputValue] &&
    //   cache[inputValue].data.length > 0 &&
    //   cache[inputValue].expires > Date.now()
    // ) {
    //   this.view.renderFilms(cache[inputValue].data);
    //   return;
    // }

    this.storage.pull().then((data) => {
      console.log(data);
    });

    this.api.getFilms(inputValue).then((data) => {
      const fullFilmsArray = data.Search;
      this.model.setFilms(fullFilmsArray);
      this.storage.push(fullFilmsArray);
      //   console.log(data);
    });
  };
}
