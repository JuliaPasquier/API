const form = document.getElementById('mealForm');
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const meal = document.getElementById('mealInput').value;
  searchMeal(meal);
});

function searchMeal(meal) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`;
  fetch(url)
    .then(response => response.json())
    .then(data => displayMealResults(data.meals))
    .catch(error => console.log(error));
}

function displayMealResults(meals) {
  const resultsContainer = document.getElementById('mealResults');
  resultsContainer.innerHTML = '';

  if (meals) {
    meals.forEach(meal => {
      const template = `
        <div class="meal">
          <img src="${meal.strMealThumb}" alt="${meal.idMeal}">
          <h3>${meal.strMeal}</h3>
        </div>
      `;
      resultsContainer.insertAdjacentHTML('beforeend', template);
    });
    modals(meals);
  } else {
    resultsContainer.innerHTML = "No results found.";
  }
}

function modals(meals) {
  meals.forEach(meal => {
    const template = `
      <div id="modal-${meal.idMeal}" class="modal">
        <div class="modal_content">
          <h1>${meal.strMeal}</h1>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h2>Ingredients:</h2>
          <ul>
            ${getIngredientsList(meal)}
          </ul>
          <a href="#" class="modal_close">&times;</a>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', template);
  });

  const mealImages = document.querySelectorAll('.meal img');
  mealImages.forEach(image => {
    image.addEventListener('click', function(event) {
      event.preventDefault();
      const mealId = this.closest('.meal').querySelector('img').getAttribute('alt');
      openModal(mealId);
    });
  });

  const closeButtons = document.querySelectorAll('.modal_close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const modalId = this.closest('.modal').id;
      closeModal(modalId);
    });
  });
}

function getIngredientsList(meal) {
  let ingredientsList = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    }
  }
  return ingredientsList;
}

function openModal(mealId) {
  const modal = document.getElementById(`modal-${mealId}`);
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error(`Modal with ID 'modal-${mealId}' not found.`);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}



