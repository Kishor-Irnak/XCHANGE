document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadBtn = document.getElementById('uploadBtn');
    const browseBtn = document.getElementById('browseBtn');
    const uploadSection = document.getElementById('uploadSection');
    const browseSection = document.getElementById('browseSection');
    const bookForm = document.getElementById('bookForm');
    const booksGrid = document.getElementById('booksGrid');
    const noBooksMessage = document.getElementById('noBooksMessage');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterCategory = document.getElementById('filterCategory');
    const filterLocation = document.getElementById('filterLocation');
    const filterType = document.getElementById('filterType');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const contactDetails = document.getElementById('contactDetails');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const bookImage = document.getElementById('bookImage');
    const fileName = document.getElementById('fileName');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    // Initialize the app
    initApp();

    // Event Listeners
    uploadBtn.addEventListener('click', showUploadSection);
    browseBtn.addEventListener('click', showBrowseSection);
    bookForm.addEventListener('submit', handleBookSubmit);
    searchBtn.addEventListener('click', filterBooks);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') filterBooks();
    });
    applyFilters.addEventListener('click', filterBooks);
    resetFilters.addEventListener('click', resetAllFilters);
    closeModal.addEventListener('click', hideContactModal);
    closeModalBtn.addEventListener('click', hideContactModal);
    uploadImageBtn.addEventListener('click', function() {
        bookImage.click();
    });
    bookImage.addEventListener('change', handleImageUpload);

    // Functions
    function initApp() {
        // Show browse section by default
        showBrowseSection();
        // Load books from localStorage
        loadBooks();
    }

    function showUploadSection() {
        uploadSection.classList.remove('hidden');
        browseSection.classList.add('hidden');
        uploadBtn.classList.add('bg-blue-700');
        browseBtn.classList.remove('bg-blue-700');
    }

    function showBrowseSection() {
        uploadSection.classList.add('hidden');
        browseSection.classList.remove('hidden');
        uploadBtn.classList.remove('bg-blue-700');
        browseBtn.classList.add('bg-blue-700');
    }

    function handleImageUpload() {
        const file = bookImage.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    }

    function handleBookSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const subject = document.getElementById('subject').value;
        const category = document.getElementById('category').value;
        const condition = document.getElementById('condition').value;
        const location = document.getElementById('location').value;
        const contactType = document.getElementById('contactType').value;
        const contactInfo = document.getElementById('contactInfo').value;
        const listingType = document.getElementById('listingType').value;
        const description = document.getElementById('description').value;
        
        // Create book object
        const book = {
            id: Date.now().toString(),
            title,
            author,
            subject,
            category,
            condition,
            location,
            contactType,
            contactInfo,
            listingType,
            description,
            image: previewImg.src || 'https://via.placeholder.com/150',
            date: new Date().toISOString()
        };
        
        // Save book to localStorage
        saveBook(book);
        
        // Reset form
        bookForm.reset();
        fileName.textContent = 'No file chosen';
        imagePreview.classList.add('hidden');
        previewImg.src = '#';
        
        // Show success message
        alert('Book uploaded successfully!');
        
        // Switch to browse section and show the new book
        showBrowseSection();
        loadBooks();
    }

    function saveBook(book) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooks(filteredBooks = null) {
        let books = filteredBooks || JSON.parse(localStorage.getItem('books')) || [];
        
        // Clear the grid
        booksGrid.innerHTML = '';
        
        if (books.length === 0) {
            noBooksMessage.classList.remove('hidden');
            return;
        }
        
        noBooksMessage.classList.add('hidden');
        
        // Create book cards
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
            bookCard.innerHTML = `
                <div class="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="${book.image}" alt="${book.title}" class="h-full w-full object-cover">
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-lg mb-1">${book.title}</h3>
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${book.listingType}</span>
                    </div>
                    <p class="text-gray-600 mb-1">by ${book.author}</p>
                    <p class="text-sm text-gray-500 mb-2">${book.subject} • ${book.category}</p>
                    
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                        <i class="fas fa-map-marker-alt mr-1"></i>
                        <span>${book.location}</span>
                        <span class="mx-2">•</span>
                        <i class="fas fa-star mr-1"></i>
                        <span>${book.condition} Condition</span>
                    </div>
                    
                    ${book.description ? `<p class="text-gray-700 text-sm mb-3 line-clamp-2">${book.description}</p>` : ''}
                    
                    <div class="flex justify-between items-center">
                        <button class="view-contact bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm" data-id="${book.id}">
                            <i class="fas fa-envelope mr-1"></i> Contact Owner
                        </button>
                        <span class="text-xs text-gray-500">${formatDate(book.date)}</span>
                    </div>
                </div>
            `;
            
            booksGrid.appendChild(bookCard);
        });
        
        // Add event listeners to contact buttons
        document.querySelectorAll('.view-contact').forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-id');
                showContactModal(bookId);
            });
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function showContactModal(bookId) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(b => b.id === bookId);
        
        if (!book) return;
        
        let contactHtml = `
            <div>
                <h4 class="font-medium">${book.title}</h4>
                <p class="text-gray-600 text-sm">by ${book.author}</p>
            </div>
            
            <div>
                <p class="font-medium">Contact via ${book.contactType}:</p>
            `;
        
        if (book.contactType === 'Email') {
            contactHtml += `
                <a href="mailto:${book.contactInfo}" class="text-blue-600 hover:underline">
                    ${book.contactInfo}
                </a>
            `;
        } else if (book.contactType === 'WhatsApp') {
            contactHtml += `
                <a href="https://wa.me/${book.contactInfo.replace(/[^\d]/g, '')}" target="_blank" class="text-blue-600 hover:underline">
                    ${book.contactInfo} <i class="fab fa-whatsapp ml-1"></i>
                </a>
            `;
        } else {
            contactHtml += `
                <a href="tel:${book.contactInfo}" class="text-blue-600 hover:underline">
                    ${book.contactInfo} <i class="fas fa-phone ml-1"></i>
                </a>
            `;
        }
        
        contactHtml += `
            </div>
            
            <div class="bg-gray-100 p-3 rounded-md">
                <p class="text-sm"><span class="font-medium">Location:</span> ${book.location}</p>
                <p class="text-sm"><span class="font-medium">Listing Type:</span> ${book.listingType}</p>
                <p class="text-sm"><span class="font-medium">Condition:</span> ${book.condition}</p>
            </div>
            
            <p class="text-sm text-gray-600">Please be respectful when contacting the book owner.</p>
        `;
        
        contactDetails.innerHTML = contactHtml;
        contactModal.classList.remove('hidden');
    }

    function hideContactModal() {
        contactModal.classList.add('hidden');
    }

    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const locationFilter = filterLocation.value.toLowerCase();
        const typeFilter = filterType.value;
        
        let books = JSON.parse(localStorage.getItem('books')) || [];
        
        let filteredBooks = books.filter(book => {
            const matchesSearch = 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.subject.toLowerCase().includes(searchTerm) ||
                book.description.toLowerCase().includes(searchTerm);
            
            const matchesCategory = categoryFilter ? book.category === categoryFilter : true;
            const matchesLocation = locationFilter ? book.location.toLowerCase().includes(locationFilter) : true;
            const matchesType = typeFilter ? book.listingType === typeFilter : true;
            
            return matchesSearch && matchesCategory && matchesLocation && matchesType;
        });
        
        loadBooks(filteredBooks);
    }

    function resetAllFilters() {
        searchInput.value = '';
        filterCategory.value = '';
        filterLocation.value = '';
        filterType.value = '';
        loadBooks();
    }
});
