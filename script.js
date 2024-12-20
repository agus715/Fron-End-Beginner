// Constants
const RENDER_EVENT = 'render-bookshelf';
const bookStorage = 'BOOK_STORAGE';

// Variables
let bookshelfs = [];

// Event listener untuk merender ulang daftar buku saat diperlukan
document.addEventListener(RENDER_EVENT, renderBookshelf);

// Function utama untuk merender ulang daftar buku
function renderBookshelf() {
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    incompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    // Melakukan loop pada daftar buku dan merender sesuai kondisi selesai atau belum
    for (const bookItem of bookshelfs) {
        const bookElement = makeBookElement(bookItem);
        if (!bookItem.isCompleted) {
            incompletedBookList.appendChild(bookElement);
        } else {
            completedBookList.appendChild(bookElement);
        }
    }
}

// Function untuk membuat elemen buku
function makeBookElement(bookObject) {
    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.setAttribute('id', `todo-${bookObject.id}`);

    const title = document.createElement('h3');
    title.innerText = bookObject.title;

    const author = document.createElement('p');
    author.innerText = 'Penulis: ' + bookObject.author;

    const year = document.createElement('p');
    year.innerText = 'Tahun: ' + bookObject.year;

    const container = document.createElement('div');
    container.classList.add('action');

    const actionButtons = createActionButton(bookObject.isCompleted, bookObject.id);
    container.append(...actionButtons);

    bookContainer.append(title, author, year, container);
    return bookContainer;
}

// Function untuk membuat tombol aksi
function createActionButton(isCompleted, bookId) {
    const actionButtons = [];

    const actionButtonConfig = [
        { text: isCompleted ? 'Belum Selesai Dibaca' : 'Selesai Dibaca', class: 'green', clickHandler: isCompleted ? completeToUnfinishedBook : unfinishedToCompleteBook },
        { text: 'Hapus Buku', class: 'red', clickHandler: removeBook }
    ];

    for (const config of actionButtonConfig) {
        const button = document.createElement('button');
        button.classList.add(config.class);
        button.innerText = config.text;
        button.addEventListener('click', () => config.clickHandler(bookId));
        actionButtons.push(button);
    }

    return actionButtons;
}

// Function untuk menambahkan buku ke daftar buku
function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generateUniqueId();

    const bookObject = generateBookObject(generatedID, title, author, year, isCompleted);
    bookshelfs.push(bookObject);

//Fungsi generate book object 
function generateBookObject(id, title, author, year, isCompleted){
    return {
        id: Number(id), // Ubah menjadi tipe data number
        title: String(title), // Ubah menjadi tipe data string
        author: String(author), // Ubah menjadi tipe data string
        year: Number(year), // Ubah menjadi tipe data number
        isCompleted: Boolean(isCompleted) // Ubah menjadi tipe data boolean
    };
}

    // Dispatch the render event after adding the book
    document.dispatchEvent(new Event(RENDER_EVENT));

    // Save data to local storage
    saveData();
}

// Function untuk mengubah status buku dari belum selesai menjadi selesai
function unfinishedToCompleteBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget) {
        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

// Function untuk mengubah status buku dari selesai menjadi belum selesai
function completeToUnfinishedBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget) {
        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

// Function untuk menghapus buku dari daftar
function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
        bookshelfs.splice(bookIndex, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

// Function untuk mencari buku berdasarkan ID-nya
function findBook(bookId) {
    return bookshelfs.find(book => book.id === bookId);
}

// Function untuk mencari index buku berdasarkan ID-nya
function findBookIndex(bookId) {
    return bookshelfs.findIndex(book => book.id === bookId);
}

// Function untuk menyimpan data ke local storage
function saveData() {
    localStorage.setItem(bookStorage, JSON.stringify(bookshelfs));
}

// Function untuk memuat data dari local storage saat halaman dimuat
function loadDataFromStorage() {
    const storedData = localStorage.getItem(bookStorage);
    if (storedData) {
        bookshelfs = JSON.parse(storedData);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// Function untuk membuat ID unik berdasarkan waktu saat ini
function generateUniqueId() {
    return +new Date();
}

// Function untuk meng-handle submit form untuk menambahkan buku
function handleFormSubmit(event) {
    event.preventDefault(); // Mencegah default action form
    addBook(); // Memanggil fungsi untuk menambahkan buku
}

// Memilih form dengan ID 'inputBook' dan menambahkan event listener untuk menangani submit form
const submitInputBook = document.getElementById('inputBook');
submitInputBook.addEventListener('submit', handleFormSubmit);

// Memuat data dari local storage saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadDataFromStorage);


// Memilih form pencarian dengan ID 'searchBook' dan menambahkan event listener untuk submit
const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', handleSearchSubmit);

// Function untuk menangani submit form pencarian
function handleSearchSubmit(event) {
    event.preventDefault(); // Mencegah default action form

    const searchTerm = document.getElementById('searchBookTitle').value.trim(); // Mendapatkan nilai pencarian dan menghapus spasi ekstra

    if (searchTerm !== '') {
        searchBooks(searchTerm); // Panggil fungsi pencarian
    }
}

// Function untuk mencari buku berdasarkan judul
function searchBooks(searchTerm) {
    const searchResults = bookshelfs.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

    renderSearchResults(searchResults); // Panggil fungsi untuk merender hasil pencarian
}


//OPTIONAL
// Function untuk merender hasil pencarian
function renderSearchResults(results) {
    const searchResultsList = document.getElementById('searchResultsList');

    searchResultsList.innerHTML = ''; // Kosongkan daftar hasil pencarian sebelum merender ulang

    if (results.length > 0) {
        results.forEach(bookItem => {
            const bookContainer = document.createElement('div');
            bookContainer.classList.add('searchedBook');

            const title = document.createElement('h3');
            title.innerText = bookItem.title;

            const author = document.createElement('p');
            author.innerText = 'Penulis: ' + bookItem.author;

            const year = document.createElement('p');
            year.innerText = 'Tahun: ' + bookItem.year;

            bookContainer.append(title, author, year);
            searchResultsList.appendChild(bookContainer); // Tambahkan elemen buku ke daftar hasil pencarian
        });
    } else {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Tidak ditemukan buku dengan judul tersebut.';
        searchResultsList.appendChild(noResultsMessage); // Tampilkan pesan jika tidak ada hasil pencarian
    }
}

// Function untuk menghapus buku dari daftar
function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
        bookshelfs.splice(bookIndex, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        
        // Tampilkan alert ketika buku berhasil dihapus
        alert('Buku berhasil dihapus dari daftar!');
    }
}
