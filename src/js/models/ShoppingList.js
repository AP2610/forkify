import uniqid from 'uniqid';

export default class ShoppingList {
    // All we need is an empty array into which we can push the ingredient items from a recipe 
    constructor() {
        this.items = [];
    };

    // Create a function to add an item to the items array. Each item in the list needs to have the an id, an amount, and a its name. We will use an external package to create the uniqueid. 
    addItem(amount, unit, ingredient) {
        const id = uniqid();
        const item = {
            id,
            amount,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    };

    // Create a function to delete an item from the shopping list. We need to find the index of that item using its ID and then use splic to get rid of the item from the array.
    deleteItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1);
    }

    // Create a function to update the amount of an ingredient in the item when the user clicks on the up or down buttons
    updateAmount(id, newAmount) {
        const item = this.items.find(element => element.id === id);
        item.amount = newAmount;
    }

    // Create a function to clear the list
    clearList() {
        this.items.length = 0;
    }
}