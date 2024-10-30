// when the DOM is done loading, then render the app:
document.addEventListener("DOMContentLoaded", function() {
   console.log("DOM is done loading!")
   initApp();
})

function initApp() {
   // add event handler:
   const sortBtn = document.getElementById("btn-sort");
   sortBtn.addEventListener("click", function(e) {
      const categoryBtns = document.getElementsByClassName("btn-category");
      console.log(categoryBtns);
      let activeBtn = null;
      for (const btn of categoryBtns) {
         clsList = Array.from(btn.classList);
         if (clsList.includes("ring-1")) {
            activeBtn = btn;
            break;
         }
      };

      // sort the data in deccending order and display pets accordingly:
      loadSortedPet(activeBtn.dataset.category);
   });

   // load and display the category buttons:
   loadCategoryButtons();
   loadePets();
}

// ================================ HELPER FUNCTIONS STARTS HERE ================================//
function loadCategoryButtons() {
   fetch("https://openapi.programming-hero.com/api/peddy/categories")
      .then(response => response.json())
      .then(data => displayCategoryButtons(data.categories));
}

function loadSortedPet(category) {
   const url = category ? `https://openapi.programming-hero.com/api/peddy/category/${category}` : "https://openapi.programming-hero.com/api/peddy/pets"

   if (category === undefined) {
      fetch(url)
      .then(response => response.json())
      .then(data => {
         const dataList = data.pets;
         const sortedData = dataList.sort((a, b) => {return b.price - a.price});
         showLoader();
         setTimeout(() => {
            displayPets(sortedData);
         }, 2000)
      });
   }
   else {
      fetch(url)
      .then(response => response.json())
      .then(data => {
         const dataList = data.data;
         const sortedData = dataList.sort((a, b) => {return b.price - a.price})
         showLoader();
         setTimeout(() => {
            displayPets(sortedData)
         }, 2000);
      });
   }
}

function loadePets(category) {
   const url = category ? `https://openapi.programming-hero.com/api/peddy/category/${category}` : "https://openapi.programming-hero.com/api/peddy/pets"

   if (category === undefined) {
      fetch(url)
      .then(response => response.json())
      .then(data => {
         showLoader();
         setTimeout(() => {
            displayPets(data.pets);
         }, 2000)
      });
   }
   else {
      fetch(url)
      .then(response => response.json())
      .then(data => {
         showLoader();
         setTimeout(() => {
            displayPets(data.data)
         }, 2000);
      });
   }
};

function displayPets(petList) {
   console.log(petList);
   if (petList.length >= 1) {
      const petCardContainer = document.getElementById("pet-card-container");
      console.log(petCardContainer);
      clearContent(petCardContainer);

      petList.forEach(pet => {
         const {petId, image, pet_name:petName, breed, date_of_birth:birth, gender, price} = pet;

         const card = document.createElement("div");
         card.classList = "card max-h-[400px] bg-base-100 w-full shadow-md border p-2";
         card.innerHTML = `
            <figure >
               <img src=${image} alt=${petName} class="rounded-xl w-full" />
            </figure>
            <div class="card-body items-center text-left p-0 py-4 space-y-1">
               <h2 class="card-title text-left w-full font-semibold">${petName}</h2>
               <div class="w-full text-left">
                  <p class="flex items-center gap-3"><span><img src="./images/breed.png" alt=""></span>Breed: ${breed ?? 'Not Available'}</p>
                  <p class="flex items-center gap-3"><span><img src="./images/birth.png" alt=""></span>Birth: ${birth ?? 'Not Available'} </p>
                  <p class="flex items-center gap-3"><span><img src="./images/gender.png" alt=""></span>Gender: ${gender ?? 'Not Available'} </p>
                  <p class="flex items-center gap-3"><span><img src="./images/price.png" alt=""></span>Price: ${price ?? 'Not Available'}$</p>
               </div>
               <div class="w-full flex items-center justify-between">
                  <button onclick='handleLikeButtonClick(${petId})' data-petId=${petId} class="btn text-sky-900"><img src="./images/like.png" alt=""></button>
                  <button id='btn-${petId}' onclick="handleAdoptButtonClick(${petId}, 'btn-${petId}')" class="btn btn-adoption text-sky-900">Adopt</button>
                  <button onclick='handdleDetailsButtonClick(${petId})' class="btn text-sky-900">Details</button>
               </div>
            </div>
         `;

         petCardContainer.appendChild(card);
      });
   }
   else {
      const petCardContainer = document.getElementById("pet-card-container");
      clearContent(petCardContainer);

      petCardContainer.innerHTML = `
       <div class="h-[300px] bg-white flex flex-col gap-4 items-center justify-center text-center col-span-full">
         <img class="w-28" src="./images/error.webp">
         <h1 class="text-3xl font-semibold" >No Information available!</h1>
       </div>
      `;
   };
};

function displayCategoryButtons(data) {
   console.log(data)
   const categoryContainer = document.getElementById("categories");

   // clear all the contents inside the category button container
   clearContent(categoryContainer);

   // add default "All Category" button:
   const button = document.createElement("button");
   button.classList.add("btn", "btn-category", "p-2", "px-8", "text-center", "text-lg", "font-bold", "bg-white", "border", "border-slate-400", "bg-sky-800", "text-white", "hover:bg-sky-800", "hover:text-white", "ring-1", "ring-sky-800", "ring-offset-1");
   button.id = "btn-all-categories";
   addClickHandler(button)
   button.innerHTML = "All";
   categoryContainer.appendChild(button);

   // fetch category button from API:
   data.forEach(item => {
      createCategory(item)
   })
}

function createCategory(item) {
   const {category, category_icon:categoryIcon, id} = item;

   // create and display category buttons:
   const button = document.createElement("button");
   button.classList.add("btn", "btn-category", "p-2", "px-8", "text-center", "text-lg", "font-bold", "bg-white", "border", "border-slate-400", "hover:bg-sky-800", "hover:text-white");
   button.dataset.categoryId = id;
   button.dataset.category = category;
   addClickHandler(button);
   button.innerHTML = `
      <img class="h-full" src=${categoryIcon}> ${category}
   `;
   document.getElementById("categories").appendChild(button);
};

function clearContent(parentElem) {
   let child = parentElem.lastElementChild;
   while(child) {
      parentElem.removeChild(child);
      child = parentElem.lastElementChild;
   };
};

function addClickHandler(button) {
  button.addEventListener("click", function(event) {
      // reset all the categroy buttons and activate the target button:
      document.querySelectorAll(".btn-category").forEach(btn => {
         btn.classList.remove("bg-sky-800", "ring-1", "ring-sky-800", "ring-offset-1", "text-white");
      });
      this.classList.add("bg-sky-800", "ring-1", "ring-sky-800", "ring-offset-1", "text-white");

      if (this.id === "btn-all-categories") {
         // when the the "All" category button is clicked on:
         loadePets();
      }
      else {
         // loade pets based on the category:
         loadePets(this.dataset.category);
      };
  });
};

function handleLikeButtonClick(petId) {
   const likedContainer = document.getElementById("liked-container");
   // clearContent(likedContainer);

   fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
      .then(response => response.json())
      .then(data => {
         const {image} = data.petData;
         console.log(data.petData);
         
         const img = document.createElement("img");
         img.src = image;
         img.classList = "w-full aspect-square rounded-lg border p-1"

         likedContainer.appendChild(img);
      });
};

function handleAdoptButtonClick(petId, id) {
   const btn = document.getElementById(id);
   makeDisabled(btn);

   fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
      .then(response => response.json())
      .then(data => {
         const petData = data.petData;

         // create a modal for this pet:
         createAdoptionModal(petData);

         // display the modal in UI:
         showAdoptionModal();
      });
};

function createAdoptionModal(petData) {
   console.log(petData)
   const {breed, date_of_birth:birth, gender, price, vaccinated_status:vaccinatedStatus, pet_name:name, image, 
      pet_details:details} = petData;
   
   // create modal body:
   const modalBody = document.createElement("div");
   modalBody.classList = "w-[80%] max-w-[480px] max-h-[500px] overflow-auto p-4 rounded-lg bg-white space-y-3";
   modalBody.id = "modal-adoption-body";

   modalBody.innerHTML = `
      <h2 class="text-2xl font-bold text-center">Congratulation!!</h2>
      <p class="text-slate-500">You have adopted the <span class=" font-bold">${name}</span> successfully at a price of ${price}$</p>
      <div class="text-center text-xl font-bold my-5">
      Time left : <span id="display">3</span> seconds
      </div>
      <div class="mt-6">
         <button onclick="hideModalInfo()" class="btn w-full hover:bg-red-500 hover:text-white focus:ring-1 ring-red-500 ring-offset-1"> 
            OK 
         </button>
      </div>
   `;

   // clear out the modal container:
   const modalInfo = document.getElementById("modal-info");
   clearContent(modalInfo);

   // add the modal into the modal container:
   modalInfo.appendChild(modalBody);
};

function makeDisabled(button) {
   button.innerHTML = "Adopted"
   button.disabled = true;
};

function handdleDetailsButtonClick(petId) {
   console.log(petId);
   fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
      .then(response => response.json())
      .then(data => {
         const petData = data.petData;

         // create a modal for this pet:
         createModalBody(petData);

         // display the modal in UI:
         showModalInfo();
      });
};

function showModalInfo() {
   const modalInfo = document.getElementById("modal-info");
   modalInfo.classList.remove("hidden");
   modalInfo.classList.add("flex");
};

function showAdoptionModal() {
   const modalInfo = document.getElementById("modal-info");
   modalInfo.classList.remove("hidden");
   modalInfo.classList.add("flex");

   let counter = 3;
   const interval = setInterval(() => {
      counter--;
      document.getElementById("display").innerHTML = counter;
   }, 1000);

   setTimeout(() => {
      clearInterval(interval);
   }, 3000);

   setTimeout(() => {
      hideModalInfo();
   }, 4000);
};

function hideModalInfo() {
   const modalInfo = document.getElementById("modal-info");
   modalInfo.classList.remove("flex");
   modalInfo.classList.add("hidden");
};

function createModalBody(petData) {
   console.log(petData)
   const {breed, date_of_birth:birth, gender, price, vaccinated_status:vaccinatedStatus, pet_name:name, image, 
      pet_details:details} = petData;
    
   // create modal body:
   const modalBody = document.createElement("div");
   modalBody.classList = "w-[80%] max-w-[480px] max-h-[600px] overflow-auto p-4 rounded-lg bg-white space-y-3";
   modalBody.id = "modal-info-body";
   modalBody.innerHTML = `
      <img class="w-full aspect-[7/3] object-cover rounded-md border" src=${image} alt="">
      <div class="space-y-1">
         <h2 class="text-xl font-bold">${name}</h2>
         <div class="grid grid-cols-2 gap-1 text-xs font-semibold text-slate-500">
            <p class="flex items-center gap-2"><span><img class="w-4" src="./images/breed.png" alt=""></span>Bredd: ${breed ?? 'N/A'}</p>
            <p class="flex items-center gap-2"><span><img class="w-4" src="./images/birth.png" alt=""></span>Birth: ${birth ?? 'N/A'}</p>
            <p class="flex items-center gap-2"><span><img class="w-4" src="./images/gender.png" alt=""></span>Gender: ${gender ?? 'N/A'} </p>
            <p class="flex items-center gap-2"><span><img class="w-4" src="./images/price.png" alt=""></span>Price: ${price ?? 'N/A'}$</p>
            <p class="flex items-center gap-2">
               <span><img class="w-4" src="./images/price.png" alt=""></span>Vaccinated Status: ${vaccinatedStatus ?? 'N/A'} 
            </p>
         </div>
      </div>
      <div class="divider my-0"></div>
      <div class="space-y-1">
         <h3 class="font-semibold text-sm">Details Information</h3>
         <p class="text-xs text-slate-500">
            ${details}
         </p>
      </div>
      <div class="mt-6">
         <button onclick="hideModalInfo()" class="btn w-full hover:bg-red-500 hover:text-white focus:ring-1 ring-red-500 ring-offset-1"> 
            Cancel 
         </button>
      </div>
   `;

   // clear out the modal container:
   const modalInfo = document.getElementById("modal-info");
   clearContent(modalInfo);
   
   // add the modal into the modal container:
   modalInfo.appendChild(modalBody);
};

function showLoader() {
   document.getElementById("pet-card-container").innerHTML = `
      <div class="h-[300px] bg-white flex flex-col gap-4 items-center justify-center text-center col-span-full">
         <span class="loading loading-bars loading-lg"></span>
      </div>
   `
}

// ================================ HELPER FUNCTIONS ENDS HERE ================================//