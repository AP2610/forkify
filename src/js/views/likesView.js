import {elements, elementStrings} from './base';
import {limitRecipeTitle} from '../helpers/limitTitleLength';


const toggleLikeButton = isLiked => {
    const iconString = isLiked ? `icon-heart` : `icon-heart-outlined`;
    document.querySelector(".recipe__love-btn use").setAttribute('href', `img/icons.svg#${iconString}`)
};

const toggleLikeMenu = numLikes => {
    elements.likesPanel.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

const addLikeToList = newLike => {
    const markup = `
                    <li>
                        <a class="likes__link" href="#${newLike.id}">
                            <figure class="likes__fig">
                                <img src="${newLike.image}" alt="${newLike.title}">
                            </figure>
                            <div class="likes__data">
                                <h4 class="likes__name">${newLike.title}</h4>
                                <p class="likes__author">Ready in ${newLike.readyInMinutes} minutes</p>
                            </div>
                        </a>
                    </li>
                    `;
    elements.likesList.insertAdjacentHTML("beforeend", markup);
    limitRecipeTitle(elementStrings.likesRecipeTitles, elementStrings.likesRecipeLinks);
};

const removeLike = (id) => {
    const item = document.querySelector(`.likes__link[href*="${id}"]`);
    item.parentElement.removeChild(item);
}

export {toggleLikeButton, addLikeToList, removeLike, toggleLikeMenu};



