import APIhelper from '../helpers/apiHelper';
import {key} from '../helpers/config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const API = new APIhelper();
            API.setBaseUrl(`https://api.spoonacular.com/recipes`)
            const data = await API.getWithHeaders(`/${this.id}/information?includeNutrition=false&includeInstruction=true&apiKey=${key}`);
            this.title = data.title;
            this.readyInMinutes = data.readyInMinutes;
            this.author = data.creditsText;
            this.url = data.sourceUrl;
            data.instructions !== "" ? this.instructions = data.instructions : this.instructions = data.sourceUrl;
            this.image = data.image;
            this.ingredients = data.extendedIngredients;
            this.likes = data.aggregateLikes;
            this.servings = data.servings;
            this.dietaryInformation = {
                "glutenFree": data.glutenFree,
                "dairyFree": data.dairyFree,
                "isVegan": data.vegan,
                "isVegetarian": data.vegetarian,
                "isKeto": data.ketogenic
            };
        } catch(error) {
            alert("There was an error in rendering the recipe. Please try again later. If the problem persists, kindly contact the administrator");
            console.log("There was an error in the Recipe model: ", error)
        }
    }
    // Create a function which breaks down the ingredients of a given recipe
    getIngredients() {
        const newIngredients = this.ingredients.map(ingredient => {
            const ingredientBreakdown = {
                "name" : ingredient.originalName,
                "image" : ingredient.image,
                "id": ingredient.id
            };
            if(ingredient.measures) {
                ingredientBreakdown.metricMeasures = ingredient.measures.metric;
                ingredientBreakdown.usMeasures = ingredient.measures.us 
            };
            return ingredientBreakdown;
        });
        this.ingredients = newIngredients;
        // console.log(`This is the ingrient information for the ${this.title} recipe: `, this.ingredients)
    }

    // Create a function to update servings and amount of ingredients
    updateServings(type, measureType) {
        // Increment or decrease depending on type. 
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Update the ingredient quantities
        this.ingredients.forEach(ingredient => {
            if (measureType === 'us') {
                // The formula below ensures that the ingredient quatities increase by the same ratio. 
                // Example 5 kilos for 5 people --> reduce serving by 1 --> 5 * (4/5) --> 5 * 0.8 --> 4.
                // Example 2.4 kilos for 6 people --> increase sercing by 2 --> 2.4 * (8/6) --> 3.2
                ingredient.usMeasures.amount *= (newServings / this.servings);
            };
            if (measureType === 'metric') {
                ingredient.metricMeasures.amount *= (newServings / this.servings);
            }
        });
        this.servings = newServings;
    }
}

