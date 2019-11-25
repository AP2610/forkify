import {elements} from './base';
import { Fraction } from 'fractional';

// Create a function to clear the recipe
const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

// Creates a function to change recipe decimal quantities to fractions for UX.
const formatCount = count => {
    if (count) {
        // The line below checks if the the remainder of the count(ingredient amount) is 0 when divided by one(integer or decimal), if not, the amount is rounded to 2 decimal places.
        const newCount = count % 1 === 0 ? count : count.toFixed(2);

        // Below we destructure the integer part and the decimal part of the amount into an array
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));

        // If there's no decimal, we simply return the amount
        if (!dec) return Math.round(newCount);

        if (int === 0) {
            // if the Integer is 0, we can pass the whole number and the package will give us a fraction
            const fr = new Fraction(newCount);
            if (fr.numerator < 4 && fr.denominator <= 4) {
                return `${fr.numerator}/${fr.denominator}`;
            } else {
                return `${int}.${Math.round(dec/10) * 10}`;
            }
        } else {
            // If the integer is more than 0, we subtract it from the amount so we are left with 0. something. 
            const fr = new Fraction(newCount - int);
            // if both the numerator and denominator are less than 4, we display the fraction, otherwise we display the Integer, plus a rounded version of the decimal which rounds to the nearest 10.
            // console.log(newCount, fr);
            if (fr.numerator < 4 && fr.denominator <= 4) {
                return `${int} ${fr.numerator}/${fr.denominator}`;    
            } else {
                return `${int}.${Math.round(dec/10) * 10}`;
            }
        }
    }
    return '?';
};

// Create a function to display one ingredient
const displayOneIngredient = ingredient => {
    return `
        <li class="recipe__item">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${formatCount(ingredient.usMeasures.amount)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${ingredient.usMeasures.unitShort.toLowerCase()}</span>
                ${ingredient.name}
            </div>
        </li>
    `
};

// Create a function to render a recipe to the UI
const displayRecipe = (recipe, isLiked) => {
    const recipeMarkup = `
    <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.readyInMinutes}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>
        </div>
        <button class="recipe__love recipe__love-btn">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
            </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(ingredient => displayOneIngredient(ingredient)).join('')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn-add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
    `
    elements.recipe.insertAdjacentHTML("afterbegin", recipeMarkup)
};

// Create a functio to update the UI with the new servings and ingredients 
const updateServingsIngredients = (recipe) => {
    // Update Servings on the UI
    document.querySelector(".recipe__info-data--people").textContent = recipe.servings;

    // update all the ingredients amounts
    // Below we are lopping over two arrays (one node list, and then the array of ingredients). In this case we use the index to map one array to the other. Like this we ensure that for each iteration, the corresponding index of the second array is updated. 
    document.querySelectorAll(".recipe__count").forEach((element, index) => {
        element.textContent = formatCount(recipe.ingredients[index].usMeasures.amount)
    })
}

export {displayRecipe, clearRecipe, updateServingsIngredients};
