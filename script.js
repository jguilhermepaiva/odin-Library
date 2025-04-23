const booksDisplay = document.querySelector(".books-display");
const myLibrary = [];


function saveLibrary(){
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function loadLibrary() {
  const storedLibrary = localStorage.getItem("myLibrary");
  if (storedLibrary) {
    const parsed = JSON.parse(storedLibrary);
    myLibrary.length = 0; 
    parsed.forEach(book => {
      myLibrary.push(new Book(book.title, book.author, book.pages, book.hasRead));
    });
  }
  else {
      myLibrary.push(new Book("O Hobbit", "J.R.R. Tolkien", 295, false));
      myLibrary.push(new Book("1984", "George Orwell", 328, true));
  }
}
function Book(title, author, pages, read) {
  if(!new.target){
    throw Error("must use 'new'");
  }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function () {
      return `${this.title}, ${this.author}, ${this.pages} pages, `+
      (this.read ? "Já foi lido" : "Ainda não foi lido");
    }
}

function addBookToLibrary(title, author, pages, hasRead) {
  const newBook = new Book(title, author, pages, hasRead);
  myLibrary.push(newBook);
  saveLibrary();
  displayBooks(myLibrary);
}
function removeBook(index){
  myLibrary.splice(index, 1);
  saveLibrary();
  displayBooks(myLibrary);
}

function displayBooks(Library) {
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  Library.forEach((book, index) =>{
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const bookInfo = document.createElement("p");
    bookInfo.textContent = book.info();

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover"
    removeBtn.addEventListener("click", () => {
      removeBook(index);
    });

    bookDiv.appendChild(bookInfo);
    bookDiv.appendChild(removeBtn);
    container.appendChild(bookDiv);
  })
}

loadLibrary();
displayBooks(myLibrary);

document.getElementById("book-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = parseInt(document.getElementById("pages").value);
  const hasRead = document.getElementById("hasRead").checked;

  addBookToLibrary(title, author, pages, hasRead);
  this.reset();
});