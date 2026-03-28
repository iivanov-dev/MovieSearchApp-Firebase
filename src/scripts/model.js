export class Model {
  constructor({ onFilmsChange }) {
    this.fullFilmsArray = [];

    this.onFilmsChange = onFilmsChange;
  }

  getFilms() {
    return this.fullFilmsArray;
  }

  setFilms(fullFilmsArray) {
     this.fullFilmsArray = fullFilmsArray;
     this.onFilmsChange();
  }
}
