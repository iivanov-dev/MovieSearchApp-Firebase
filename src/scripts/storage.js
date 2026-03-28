import { db } from "./firebase.js";
import { v4 as uuidv4 } from "uuid";

import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  writeBatch,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export class Storage {
  constructor(key) {
    this.key = key;
    this.db = db;
    this.documentsId = []; 
  }
  async pull() {
    const querySnapshot = await getDocs(collection(this.db, this.key));
    const films = [];

    querySnapshot.forEach((doc) => {
      films.push({
        id: doc.id,
        Poster: doc.data().Poster,
        Title: doc.data().Title,
        Type: doc.data().Type,
        Year: doc.data().Year,
        imdbID: doc.data().imdbID,
      });
    });

    return films;
  }

  async push(films) {
    const batch = writeBatch(this.db);

    const film = films[0];

    // films.forEach((film) => {
      const idDocument = this._handleGenerateUUID();
      const ref = doc(this.db, this.key, idDocument);

      const filmData = {
        Poster: film.Poster,
        Title: film.Title,
        Type: film.Type,
        Year: film.Year,
        imdbID: film.imdbID,
        createdAt: serverTimestamp(),
      };

      batch.set(ref, filmData);

    // });
    await batch.commit();
    console.log("Generated UUIDs:", this.documentsId); 
  }

  async delete(films) {
    const batch = writeBatch(this.db);

    films.forEach((film) => {
      const ref = doc(this.db, this.key, film.id);
      batch.delete(ref);
    });

    await batch.commit();
    //this.documentsId = [];
  }

  async update(film) {
    const ref = doc(this.db, this.key, film.id);
    await updateDoc(ref, {
      done: film.done,
    });
  }

  _handleGenerateUUID = () => {
    const idDocument = uuidv4();
    this.documentsId.push(idDocument);
    return idDocument;
  }
}
