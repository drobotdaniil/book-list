//Book class
class Book {
    constructor(title, author, number) {
        this.title = title,
            this.author = author,
            this.number = number;
    }
}
//ui class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.number}</td>
            <td><a href="#" class="btn btn-danger 
            btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);
        // vanish in 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(),
            3000);

    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#number").value = "";
    }
    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            //remove
            el.parentElement.parentElement.remove();
            
        }
    }
}
//store class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem("books", JSON.stringify(books))
    }
    static removeBook(number){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.number === number){
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}
//event - display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);
//event - add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    //get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const number = document.querySelector("#number").value;

    //validate
    if (title === "" || author === "" || number === "") {
        UI.showAlert("Please fill in all fields", "danger");
    } else {
        //instantiate book
        const book = new Book(title, author, number);

        //add book to ui

        UI.addBookToList(book);

        //add book to store
        Store.addBook(book);

        //clear fields
        UI.clearFields();

        // add success message
        UI.showAlert("Added", "success");
    }


});
//event - remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    //remove book from UI
    UI.deleteBook(e.target);
    // add remove message
    UI.showAlert("Removed", "success");
    // remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});