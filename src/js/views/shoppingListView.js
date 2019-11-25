import {elements} from './base';

const clearList = () => {
    elements.shoppingList.innerHTML = "";
    elements.clearList.style.visibility = "hidden";
}

const displayItem = (item) => {
    const newAmount = item.amount % 1 === 0 ? item.amount : item.amount.toFixed(2);
    let finalAmount;
    if (newAmount % 1 !== 0) {
        const [int, dec] = newAmount.toString().split('.').map(el => parseInt(el, 10));
        finalAmount = `${int}.${Math.round(dec/10) * 10}`;
    } else {
        finalAmount = newAmount;
    }
    
    const markup = `
                        <li class="shopping__item" data-itemid="${item.id}">
                            <div class="shopping__count">
                                <input type="number" min="0" value="${finalAmount}" step="${finalAmount}" class="shopping__count-value">
                                <div class="shopping__count-unit">
                                    <p>${item.unit.toLowerCase()}</p>
                                </div>
                            </div>
                            <p class="shopping__description">${item.ingredient}</p>
                            <button class="shopping__delete btn-tiny">
                                <svg>
                                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                                </svg>
                            </button>
                        </li>
                    `;
    elements.clearList.style.visibility = "visible";
    elements.shoppingList.insertAdjacentHTML("beforeend", markup);
};

const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
}

export {displayItem, deleteItem, clearList};
