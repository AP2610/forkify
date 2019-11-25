import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';

import {elements, displayLoader, clearLoader} from './views/base';

// Create a state object which will hold the current state of the app at any given time.
const state = {};

// Create SEARCH CONTROLLER.
const searchController = async () => {
    // 1. Get the query from the view
    state.currentQuery = searchView.getInput();

    // 2. If there is a query, create search object, add to state object
    if (state.currentQuery) {
        state.currentSearch = new Search(state.currentQuery);
        // 3. Prepare UI for result. Loading spinner.
        searchView.clearInput();
        searchView.clearResults();
        displayLoader(elements.searchResults);

        // We add a try/catch here as well as we only want to render results if the fetch is successful
        try {
            // 4. Search for recipes using method from search model.
            await state.currentSearch.getSearch();

            // 5. Render results on UI. Only after we recieve the results from API. 
            // console.log("This is the current state: ", state);
            clearLoader();
            searchView.displayItems(state.currentSearch.result);
        } catch(error) {
            alert("There was an error processing your search, try again in a few minutes.")
            console.log("There was an error(searchController): ", error)
        }
    };
};

// Create the RECIPE CONTROLLER

const recipeController = async () => {
    // Get the id from the URL
    const id = window.location.hash.replace('#', '');
    if (id) {
        // Prepare UI for changes, load spinner, clear previous results, etc.
        recipeView.clearRecipe();
        displayLoader(elements.recipe);

        // Highlight the selected recipe only if a search has been made, otherwise there is nothing to highlight.
        if (state.currentSearch) searchView.highlightSelectedResult(id);

        // Create new recipe object
        state.currentRecipe = new Recipe(id);

        // Get recipe data from the Recipe model. We wrap this in a try/catch statement as we only want to render the recipe in case everything goes will in fetching the data from the server.
        try {
            await state.currentRecipe.getRecipe();

            // Render Recipe
            state.currentRecipe.getIngredients();
            clearLoader();
            recipeView.displayRecipe(state.currentRecipe, state.likes.isLiked(id));
        } catch(error) {
            alert("There was an error processing the recipe, try again in a few minutes.");
            console.log("There was an error(recipeController): ", error)
        }
        
    }
};

// Create the SHOPPING LIST CONTROLLER
const shoppingListController = () => {
    // Create a new list if there isn't one already
    if (!state.currentShoppingList) {
        state.currentShoppingList = new ShoppingList();
    };
    state.currentRecipe.ingredients.forEach(ingredient => {
        const item = state.currentShoppingList.addItem(ingredient.usMeasures.amount, ingredient.usMeasures.unitShort, ingredient.name);
        shoppingListView.displayItem(item);
    });
};

// Create the LIKES CONTROLLER

const likesController = () => {
    // If there isnt a likes object in the state, create one
    if (!state.likes) state.likes = new Likes()

    // Get the ID of the current Recipe to check if its liked or not
    const currentID = state.currentRecipe.id

    // Check if the recipe is liked 
    if(!state.likes.isLiked(currentID)) {
        // Add the like to the state 
        const newLike = state.likes.addLike(currentID, state.currentRecipe.title, state.currentRecipe.readyInMinutes, state.currentRecipe.image);

        // Tooggle the like button to active
        likesView.toggleLikeButton(state.likes.isLiked(newLike.id));

        // Add the like to the UI list
        likesView.addLikeToList(newLike);
    } else {
        // Remove the like from the state
        state.likes.deleteLike(currentID);

        // Tooggle the like button to inactive
        likesView.toggleLikeButton(state.likes.isLiked(currentID));

        // Remove the like from the UI list
        likesView.removeLike(currentID);
    };
    
    // Toggle Likes menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Create an event listener to restore liked recipes. 
window.addEventListener('load', () => {
    // On page load we create a likes object to be able to retrieve data from the local storage
    state.likes = new Likes();

    // Restore likes and push them to the likes data model
    state.likes.retrieveData();

    // Render likes menu button 
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render retrieved likes in the UI list
    state.likes.likedRecipes.forEach(likedRecipe => likesView.addLikeToList(likedRecipe));
})

// Create an event listener to handle delete and update item amount events
elements.shoppingList.addEventListener("click", event => {
    // We need to get the ID of the element that was clicked using event delegation
    const id = event.target.closest(".shopping__item").dataset.itemid;

    // Delete an item from the UI
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        // We have to delete it from the state (data model)
        state.currentShoppingList.deleteItem(id);

        // We have to also delete it from the UI
        shoppingListView.deleteItem(id);
    } 
    else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);
        if (value) {
            state.currentShoppingList.updateAmount(id, value);
        };
    }
})

// Create an event listener to handle clearing the shopping list
elements.clearList.addEventListener("click", ()=>{
    state.currentShoppingList.clearList();
    shoppingListView.clearList();
})

// Creates an event listener for the search form
elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchController();
    window.location.hash = '';
});

// Create an event listener for the pagination buttons using event delegation as the buttons arent on the page when it loads.
elements.searchResultsPages.addEventListener("click", event => {
    // WE set the button to the entire div
    const btn = event.target.closest(".btn-inline")
    // If there is a btn, we get the value of the dataset, goto, and we call the displayItems function again, this time padding it the page number.
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        // We need to clear the results before they can be displayed again.
        searchView.clearResults();
        searchView.displayItems(state.currentSearch.result, goToPage);
    }
});

// We need the recipe to load also when the page loads as their is the last clicked ID in the URL this is useful if they bookmark the link 
// We ca add the same event listener to multiple events
// This line below is just to avoid calling the API everytime the page is reloaded.
// window.location.hash = '';
['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeController))

// Handling recipe button clicks (increase serving, dec serving, like recipe)
elements.recipe.addEventListener("click", event => {
    // In this case, we can't use closest as their will be multiple elements that we want to click on. 
    // Decrease serving button clicked
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.currentRecipe.servings > 1) {
            state.currentRecipe.updateServings('dec', 'us');
        }
    }
    // Increase serving button clicked
    else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.currentRecipe.updateServings('inc', 'us');
    } 
    // Add recipe to shopping list button is clicked
    else if (event.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        shoppingListController();
    }
    // Like recipe button is clicked
    else if (event.target.matches('.recipe__love-btn, .recipe__love-btn *')) {
        likesController();
    }
    // Now we need to re-render the recipe, but it doesn't make sense to re-render the whole markup. We should only update the servings and the ingredient amounts. 
    recipeView.updateServingsIngredients(state.currentRecipe);
});