class Book {
  constructor(title, author, pages, read = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleRead() {
    this.read = !this.read;
  }

  info() {
    return `${this.title}, ${this.author}, ${this.pages} páginas, ` +
           (this.read ? "Já foi lido" : "Ainda não foi lido");
  }
}

class Library {
  constructor() {
    this.books = [];
    this.load();
  }

  addBook(book) {
    this.books.push(book);
    this.save();
  }

  removeBook(id) {
    this.books = this.books.filter(book => book.id !== id);
    this.save();
  }

  toggleReadStatus(id) {
    const book = this.books.find(book => book.id === id);
    if (book) {
      book.toggleRead();
      this.save();
    }
  }

  save() {
    localStorage.setItem("myLibrary", JSON.stringify(this.books));
  }

  load() {
    const stored = JSON.parse(localStorage.getItem("myLibrary"));
    if (stored) {
      this.books = stored.map(b => Object.assign(new Book(), b));
    } else {
      // Default books
      this.books = [
        new Book("O Hobbit", "J.R.R. Tolkien", 295, false),
        new Book("1984", "George Orwell", 328, true)
      ];
    }
  }
}


function displayBooks(library) {
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  library.books.forEach(book => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const info = document.createElement("p");
    info.textContent = book.info();

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.addEventListener("click", () => {
      library.removeBook(book.id);
      displayBooks(library);
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = book.read ? "Marcar como não lido" : "Marcar como lido";
    toggleBtn.addEventListener("click", () => {
      library.toggleReadStatus(book.id);
      displayBooks(library);
    });

    bookDiv.append(info, toggleBtn, removeBtn);
    container.appendChild(bookDiv);
  });
}


document.getElementById("book-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = parseInt(document.getElementById("pages").value);
  const read = document.getElementById("hasRead").checked;

  library.addBook(new Book(title, author, pages, read));
  displayBooks(library);
  this.reset();
});


const library = new Library();
displayBooks(library);
