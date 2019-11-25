// Creates a function to truncate recioe titles longer than a limit
const limitRecipeTitle = (truncatedClass, toggleClass, limit = 17) => {
    const titles = document.querySelectorAll(truncatedClass);
    titles.forEach(title => {
        if (title.textContent.length > limit) {
            title.classList.add("truncate");
            title.closest(toggleClass).addEventListener("mouseenter", () => title.classList.remove("truncate"));
            title.closest(toggleClass).addEventListener("mouseleave", () => title.classList.add("truncate"));
            return title;
        };
        return title.textContent;
    });
};

export{limitRecipeTitle};