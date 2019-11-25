import APIHelper from '../helpers/apiHelper';
import {key} from '../helpers/config';

export default class Search {
    constructor(query) {
        this.query = query;
    };

    async getSearch() {
        try{
            const API = new APIHelper();
            API.setBaseUrl(`https://api.spoonacular.com/recipes`)
            const data = await API.get(`/search?query=${this.query}&number=100&apiKey=${key}`);
            this.result = data.results;
            // console.log(data.body)
        } catch(error){
            alert("There was an error searching for the recipe. Please try again later. If the problem persists, kindly contact the administrator");
            console.log("There was an error in the Search model", error)
        };
    };
};