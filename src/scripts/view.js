import { doc } from "firebase/firestore";
import { NOT_FOUND_FILM } from "./constants.js";

export class View {
  constructor({
    onBtnSearchNode,
    onBtnDeleteNode,
    onBtnLoginNode,
    onBtnRegisterNode,
    onBtnDeleteUserNode,
    onBtnLogoutNode
  }) {
    this.inputNode = document.querySelector(".js-search-input");
    this.btnSearchNode = document.querySelector(".js-search-btn");
    this.divNoMoviesNode = document.querySelector(".js-no-movies");
    this.divAllMoviesNode = document.querySelector(".js-movies");
    this.btnLoginNode = document.querySelector(".js-login-btn");
    this.btnRegisterNode = document.querySelector(".js-register-btn");
    this.btnDeleteUserNode = document.querySelector(".js-delete-user-btn");
    this.btnLogoutNode = document.querySelector(".js-logout-btn");
    this.btnDeleteNode = document.querySelector(".js-delete-btn");

    this.onBtnSearchNode = onBtnSearchNode;
    this.onBtnDeleteNode = onBtnDeleteNode;
    this.onBtnLoginNode = onBtnLoginNode;
    this.onBtnRegisterNode = onBtnRegisterNode;
    this.onBtnDeleteUserNode = onBtnDeleteUserNode;
    this.onBtnLogoutNode = onBtnLogoutNode;

    this.btnSearchNode.addEventListener("click", this._handleBtnSearchNode);
    this.btnLoginNode.addEventListener("click", this._handleBtnLoginNode);
    this.btnRegisterNode.addEventListener("click", this._handleBtnRegisterNode);
    this.btnDeleteUserNode.addEventListener("click", this._handleBtnDeleteUserNode);
    this.btnLogoutNode.addEventListener("click", this._handleBtnLogoutNode); 
    this.btnDeleteNode.addEventListener("click", this._handleBtnDeleteNode);

    this.inputNode.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this._handleBtnSearchNode();
      }
    });
  }

  renderFilms(filmsArray) {
    this.divNoMoviesNode.textContent = "";

    if (!filmsArray || filmsArray.length === 0) {
      this.showNoSearchResult(NOT_FOUND_FILM);
      return;
    }

    this.clearPastList(this.divAllMoviesNode);

    const fallbackPoster1 = "https://placehold.co/300x450?text=No+Image";
    const fallbackPoster2 =
      "https://placehold.co/300x450/16213e/FFFFFF?text=No+Poster&font=roboto";

    filmsArray.forEach((element) => {
      const filmCard = document.createElement("a");
      filmCard.href = "#";
      filmCard.className = "film js-film";

      const filmImageDiv = document.createElement("div");
      filmImageDiv.className = "film-image";

      const posterImg = document.createElement("img");
      posterImg.src = element.Poster || "";
      posterImg.alt = element.Title || "film poster";
      posterImg.loading = "lazy";

      posterImg.onerror = function () {
        this.onerror = null;
        this.src = fallbackPoster2;
      };

      const filmInfoDiv = document.createElement("div");
      filmInfoDiv.className = "film-info";

      const filmTitle = document.createElement("h2");
      filmTitle.className = "film-name";
      filmTitle.textContent = element.Title || "";

      const filmYear = document.createElement("h3");
      filmYear.className = "film-year";
      filmYear.textContent = element.Year || "";

      const filmType = document.createElement("h4");
      filmType.className = "film-type";
      filmType.textContent = element.Type || "";

      filmInfoDiv.append(filmTitle, filmYear, filmType);
      filmImageDiv.appendChild(posterImg);
      filmCard.append(filmImageDiv, filmInfoDiv);

      this.divAllMoviesNode.appendChild(filmCard);
    });
  }

  showNoSearchResult(message = NOT_FOUND_FILM) {
    this.divNoMoviesNode.textContent = message;
  }

  clearPastList(filmsContainer) {
    filmsContainer.innerHTML = "";
  }

  _handleBtnSearchNode = () => {
    const TitleFilms = this.inputNode.value.trim();
    this.onBtnSearchNode(TitleFilms);
  };

  _handleBtnDeleteNode = () => {
    this.onBtnDeleteNode();
  };

  _handleBtnLoginNode = () => {
    this.onBtnLoginNode();
  };

  _handleBtnLogoutNode = () => {
    this.onBtnLogoutNode();
  };

   _handleBtnRegisterNode = () => {
    this.onBtnRegisterNode();
  };

  _handleBtnDeleteUserNode = () => {
    this.onBtnDeleteUserNode();
  };
}
