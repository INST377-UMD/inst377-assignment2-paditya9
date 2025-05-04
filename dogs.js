async function loadAPI() {
  return fetch('https://dog.ceo/api/breeds/image/random/10')
    .then((result) => result.json())
    .then((data) => data.message);
}

async function loadDogs() {
  let dogImages = await loadAPI();
  let carouselContainer = document.getElementById("slider-container");

  carouselContainer.innerHTML = "";

  dogImages.forEach(image => {
    let imgElement = document.createElement('img');
    imgElement.src = image;
    imgElement.width = 300
    imgElement.height = 300
    carouselContainer.appendChild(imgElement);
  });
  simpleslider.getSlider();
}


async function loadBreeds() {
  let breedData = await fetch('https://dogapi.dog/api/v2/breeds')
    .then(result => result.json());

  breedDataArray = breedData.data;

  let breedButtonContainer = document.getElementById("breed-buttons");

  breedDataArray.forEach(breed => {
    let breedButton = document.createElement('button');
    breedButton.textContent = breed.attributes.name;
    breedButton.classList.add('button-85');

    breedButton.setAttribute('data-breed-id', breed.id);

    breedButton.addEventListener('click', () => loadBreedInfo(breed));

    breedButtonContainer.appendChild(breedButton);
  });
}

function loadBreedInfo(breed) {
  let breedName = breed.attributes.name;
  let breedDescription = breed.attributes.description;
  let breedMinLife = breed.attributes.life.min;
  let breedMaxLife = breed.attributes.life.max;

  let breedInfoContainer = document.createElement('div');
  breedInfoContainer.classList.add('breed-info');

  breedInfoContainer.innerHTML =
    `   <h2>Breed Name: ${breedName}</h2>
        <p><strong>Description:</strong> ${breedDescription}</p>
        <p><strong>Min Life:</strong> ${breedMinLife} years</p>
        <p><strong>Max Life:</strong> ${breedMaxLife} years</p>`;

  document.getElementById("dog-breed-info-container").innerHTML = '';
  document.getElementById("dog-breed-info-container").appendChild(breedInfoContainer);
}

if (annyang) {
  let commands = {
    'hello': () => alert('Hello World!'),
    'change the color to *color': (color) => document.body.style.backgroundColor = color,
    'navigate to *page': (page) => window.location.href = page + '.html',
    'load *breed': (breed) => {
      let breedMatch = breedDataArray.find(b => b.attributes.name.toLowerCase() === breed.toLowerCase());
      if (breedMatch) {
        loadBreedInfo(breedMatch);
      } else {
        alert("Breed not found!");
      }
    }
  };

  annyang.addCommands(commands);
  
  function toggleListening(turnOn) {
    if (turnOn) {
      if (!annyang.isListening()) {
        annyang.start();
        alert('Audio listening turned on.');
      }
    } else {
      if (annyang.isListening()) {
        annyang.abort();
        alert('Audio listening turned off.');
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadDogs();
  loadBreeds();
});
