export class API {
	constructor() {
		this.baseUrl = 'https://www.omdbapi.com/?s='
	}

	pullFilms(inputValue) {
		return fetch(`${this.baseUrl}${encodeURIComponent(inputValue)}&apikey=d69b78ae`)
			.then(data => data.json())
	}
}