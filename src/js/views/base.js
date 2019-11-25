// An object to store all the elements we want to select from the DOM to avoid any errors if we manipulate HTML later

const elements = {
    searchInput: document.querySelector(".search__field"),
    searchForm: document.querySelector(".search"),
    searchResults: document.querySelector(".results"),
    searchResultsList: document.querySelector(".results__list"),
    searchResultsPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shoppingList: document.querySelector(".shopping__list"),
    clearList: document.querySelector(".shopping__clear-list"),
    likesList: document.querySelector(".likes__list"),
    likesPanel: document.querySelector(".likes__field")
}

const elementStrings = {
    loader: "loader",
    recipeResultsTitles: ".results__name",
    recipeResultsLinks: ".results__link",
    likesRecipeTitles: ".likes__name",
    likesRecipeLinks: ".likes__link"
}

// Creates a Loader that spins while the results are being fetched.
const displayLoader = parent => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div> 
    `;
    parent.insertAdjacentHTML("afterbegin", loader)
}

const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader)
    };
}

export {elements, displayLoader, clearLoader, elementStrings};