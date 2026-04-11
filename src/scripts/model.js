export class Model {
  constructor({ onFilmsChange }) {
    this.fullFilmsArray = [];
    this.onFilmsChange = onFilmsChange;
  }

  pullFilms() {
    return this.fullFilmsArray;
  }

  pushFilms(fullFilmsArray) {
     this.fullFilmsArray = fullFilmsArray;
     this.onFilmsChange();
  }
}