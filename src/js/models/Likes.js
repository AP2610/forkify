export default class Likes {
    constructor() {
        this.likedRecipes = []
    };

    // Create a function to add a like to the likedRecipes array
    addLike(id, title, readyInMinutes, image) {
        const item = {
            id,
            title,
            readyInMinutes,
            image
        };
        this.likedRecipes.push(item);

        // Persist data in the local storage
        this.persistData()

        return item
    };

    // Create a function to check if a recipe is liked or not
    isLiked(id) {
        return this.likedRecipes.findIndex(item => item.id === id) !== -1;
    }

    // Create a function to remove a liked recipe from the likedRecipes array
    deleteLike(id) {
        const index = this.likedRecipes.findIndex(item => item.id === id);
        this.likedRecipes.splice(index, 1);

        // Persist data in the local storage
        this.persistData();
    }

    // Create a function to get the number of likedRecipes
    getNumLikes() {
        return this.likedRecipes.length
    }

    // Create a function to persist likes data
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likedRecipes));
    }

    // Create a function to retrieve persisted likes data from local storage
    retrieveData() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the local storage
        if (storage) this.likedRecipes = storage
    }

    // Create a function to remove an item from the local storage
    deleteData() {
        const storage = JSON
    }
}