// Global variables
// Flickr API key
const key = '988636d1daac910174041e02948fd47d';
// Inputs
const textInput = document.querySelector('#text');
const sizeInput = document.querySelector("#size");
const quantityInput = document.querySelector("#quantity");
// Buttons
const searchButton = document.querySelector('#search');
const slideButton = document.querySelector('#slide-switch');
const resetButton = document.querySelector('#reset');
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');
// Spinner
const spinnerDiv = document.querySelector('.spinner-wrapper');
// Galleries
const gallery = document.querySelector('.gallery');
const slideShow = document.querySelector('.slide-show');
let imgArray = [];
let currentIndex = 0;
let imgSlide;
// Message modal
const messageModal = document.querySelector("#message-modal");
const closeMessageModal = document.querySelector("#error-close");
const okButton = document.querySelector("#ok-button");
const message = document.querySelector("#error-message");

// Default settings
slideButton.setAttribute('disabled', true);
resetButton.setAttribute('disabled', true);
slideShow.style.display = 'none';
spinnerDiv.style.display = 'none';

// Function to get input values when "search" button clicked
const getInputValues = () => {   
    let textToSearch = textInput.value;
    let size = sizeInput.value;
    let quantity = quantityInput.value;
    if (textToSearch === '') {
        message.innerText = 'Enter text to search!';
        showMessageModal();
    }
    else if (size === 'default'){
        message.innerText = 'Select size!';
        showMessageModal();

    }
    else if (quantity == ''){
        message.innerText = 'Enter quantity!';
        showMessageModal();
    }
    else {
        searchPictures(textToSearch, size, quantity);
        message.innerText = '';
        resetButton.removeAttribute('disabled', true);
    }
}

// Function for searching pictures via Flicr API
const searchPictures = (textToSearch, size, quantity) => {
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&tags=${textToSearch}&per_page=${quantity}&page=1&format=json&nojsoncallback=1`;
    
    deleteImages();
    setSpinner();
    spinnerDiv.style.display = 'flex';
    slideShow.style.display = 'none';
    gallery.style.display = 'flex';

    fetch(url).then(
        function(response){
            //return response.json();
            if (response.status >= 200 && response.status < 300) {
                return response.json(); 
            } else {
                message.innerText = 'Something went wrong! Please try again :)';
                showMessageModal();
            }
        }
    ).then((data) => {
            let picArr = data.photos.photo;
            if (picArr.length == 0){
                message.innerText = 'Something went wrong! Please try again :)';
                showMessageModal();
            }
            setTimeout(displayGallery(picArr, size), 4000); 
            spinnerDiv.style.display = 'none';
            // displayGallery(picArr, size);
        }
    ).catch((error) => {
        console.log(error);
        message.innerText = 'Something went wrong! Please try again :)';
        showMessageModal();
    })

    textInput.value = '';
    sizeInput.value = 'default';
    quantityInput.value = '';
    message.innerText = '';
}

// Function for showing pictures in gallery
const displayGallery = (picArray, size) => {
    for (const element of picArray) {
        let img = document.createElement('img');
        let serverId = element.server;
        let photoId = element.id;
        let secret = element.secret;
        img.src = `https://live.staticflickr.com/${serverId}/${photoId}_${secret}_${size}.jpg`;
        img.setAttribute('class', 'fade');
        gallery.appendChild(img);
        sizeInput.value = 'default';
        slideButton.removeAttribute('disabled', true);
    }
}

// Function for showing pictures in slide show
const displaySlideShow = () => {
    message.innerText = '';
    imgArray = document.querySelectorAll('img');
    imgSlide = imgArray[currentIndex];
    if (imgSlide == undefined){
        message.innerText = 'Something went wrong! Please try again :)';
        showMessageModal();
    }
    imgSlide.setAttribute('class', 'fade');
    imgSlide.style.display = 'flex';
    slideShow.appendChild(imgSlide);
    slideButton.setAttribute('disabled', true);
}

// Function for "next picture" button in slide show
const nextPicture = () => {
    if (currentIndex >= imgArray.length-1) {
        currentIndex = 0;
    } else {
        currentIndex++;        
    }
    imgSlide.style.display = 'none';
    console.log(currentIndex);
    imgSlide = imgArray[currentIndex];
    imgSlide.setAttribute('class', 'fade');
    imgSlide.style.display = 'flex';
    slideShow.appendChild(imgSlide);
}

// Function for "previous picture" button in slide show
const prevPicture = () => {
    if (currentIndex <= 0) {
        currentIndex = imgArray.length-1;
    } else {
        currentIndex--;     
    }
    imgSlide.style.display = 'none';  
    console.log(currentIndex);
    imgSlide = imgArray[currentIndex];
    imgSlide.setAttribute('class', 'fade');
    imgSlide.style.display = 'flex';
    slideShow.appendChild(imgSlide);
}

// Function for deleting images from galleries
const deleteImages = () => {
    let images = document.querySelectorAll('img');
    for (let i=0; i<images.length; i++){
        images[i].remove();
    }
}

// Function for reseting searching and setting default settings
const resetAll = () => {
    slideButton.setAttribute('disabled', true);
    resetButton.setAttribute('disabled', true);
    slideShow.style.display = 'none';
    gallery.style.display = 'flex';
    textInput.value = '';
    sizeInput.value = 'default';
    quantityInput.value = '';
    message.innerText = '';
    deleteImages();
}

// Function for spinner animation 
const setSpinner = () => {
    anime.timeline({
        targets: '.dot-one',
        loop: true
    })
    .add({
        translateY: '-4rem',
        translateX: '4rem',
    })
    .add({
        translateY: '0rem',
        translateX: '8rem',
    })
      
    anime.timeline({
        targets: '.dot-three',
        loop: true
    })
    .add({
        translateY: '4rem',
        translateX: '-4rem',
    })
    .add({
        translateY: '0rem',
        translateX: '-8rem',
    })    
} 

// Function for showing modal with error-message
const showMessageModal = () => {    
    messageModal.style.display = 'block';
    okButton.setAttribute('onclick', 'hideModal(messageModal)');
    closeMessageModal.setAttribute('onclick', 'hideModal(messageModal)');
    // When wherever on the page clicked - modal closes
    window.onclick = (event) => {
        if (event.target === messageModal) {
            hideModal(messageModal);
        }
    }
}

// Function for hiding modal
const hideModal = (modal) => {
    modal.style.display = 'none';
}

// Event listeners
// Event listener for search button to get input values
searchButton.addEventListener('click', getInputValues);

// Event listener for slide button - switching to slide show
slideButton.addEventListener('click', () => {
    gallery.style.display = 'none';
    slideShow.style.display = 'flex';
    displaySlideShow();
})

// Event listener for "next picture" button in slide show
nextButton.addEventListener('click', nextPicture);

// Event listener for "previous picture" button in slide show
prevButton.addEventListener('click', prevPicture);

// Event listener for reset button - reseting searching
resetButton.addEventListener('click', resetAll);
