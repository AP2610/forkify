import {elements, elementStrings} from './base';
import {limitRecipeTitle} from '../helpers/limitTitleLength';

// Get the search input:
const getInput = () => elements.searchInput.value;

// Creates a function to clear the search input field
const clearInput = () => elements.searchInput.value = "";

// Creates a function to clear result list
const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = ''
}

// Create a function to highlight the selected result from the search results list
const highlightSelectedResult = (id) => {
    document.querySelectorAll(".results__link").forEach(result => result.classList.remove("results__link--active"));
    document.querySelector(`a[href*="${id}"]`).classList.add("results__link--active");
};

// Creates a function to display one recipe in the result list
const displayRecipe = recipe => {
    const imagesBaseUrl = "https://spoonacular.com/recipeImages/"

    elements.searchResultsList.insertAdjacentHTML("beforeend", `<li>
        <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
                <img src=${imagesBaseUrl}${recipe.id}-90x90.jpg alt=${recipe.image}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">Ready in ${recipe.readyInMinutes} minutes</p>
            </div>
        </a>
    </li>`);
};

// For pagination, everytime we click on the next page button, we will call this function. So we also need to pass in the page number
// and the results we want to display per page. Then, using the data attribte in the HTML of the button, we can access the page we need to got to. We also need to create a separate function which will create the correct HTML button depending on the page we are currently on.
// We also need to create another separate function which displays the button to the page.

// The function below is simply to create the markup of a button which we will then pass to the display buttos function.
const createBtn = (currentPage, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? currentPage - 1 : currentPage + 1}>
        <span>Page ${type === 'prev' ? currentPage - 1 : currentPage + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
    </button>
`;

const displayButtons = (page, numOfResults, resPerPage ) => {
    // This function should render the button depending on which page we are on. 
    // We need to know which page we are on, and how many pages there are. 
    // We have to divide the number of total results, by the results we want per page
    // We should use MAth.ceil to round up the page number. So if we have 4.2, it'll go to 5.
    const numPages = Math.ceil(numOfResults / resPerPage);
    // We only want the buttons to display is there is more than one page.
    let button;
    if (page === 1 && numPages > 1) {
        // button to go to the next page
        button = createBtn(page, 'next')
    } else if (page < numPages) {
        // both buttons as long as the page number is less than total pages
        button = `${createBtn(page, 'prev')}${createBtn(page, 'next')}`
    }
    else if(page === numPages && numPages > 1) {
        // button to go back
        button = createBtn(page, 'prev')
    }
    elements.searchResultsPages.insertAdjacentHTML("afterbegin", button)
}

// Create a function to iterate over an array of elements and display them.
const displayItems = (recipesArray, page = 1, resPerPage = 10) => {
    // Implement Pagination
    // We dont want to display all the results on the same page. We only want 10. We define these variables below as we only want a part of the array. So if we pass the start and end to the slice method, on page = 1, start would be 0 index of the array, and end would be 10 which transaltes to an index of 9. So that would be the first 10 elements of the array.

    // Render current page results
    const start = (page - 1) * resPerPage
    const end = page * resPerPage

    // Display only some results
    if (recipesArray) {
        recipesArray.slice(start, end).forEach(element => {
            displayRecipe(element);
        });
    }
    
    // Limit recipes with ellipses
    limitRecipeTitle(elementStrings.recipeResultsTitles, elementStrings.recipeResultsLinks);

    // Render pagination buttons
    if (recipesArray.length > 10) {
        displayButtons(page, recipesArray.length, resPerPage = 10 );
    }
};

export {getInput, displayItems, clearInput, clearResults, displayButtons, highlightSelectedResult};