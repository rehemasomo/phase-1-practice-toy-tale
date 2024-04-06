let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");

  // Function to fetch toys and render them
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(toys => renderToys(toys))
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Function to render individual toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(card);
  }

  // Function to render all toys
  function renderToys(toys) {
    toys.forEach(toy => renderToy(toy));
  }

  // Event listener for "Add Toy" button
  addBtn.addEventListener("click", () => {
    toyForm.style.display = toyForm.style.display === "none" ? "block" : "none";
  });

  // Event listener for submitting new toy form
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const image = formData.get("image");

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(toy => {
        renderToy(toy);
        toyForm.reset();
      })
      .catch(error => console.error("Error adding new toy:", error));
  });

  // Event listener for liking a toy
  toyCollection.addEventListener("click", event => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.dataset.id;
      const likesElement = event.target.previousElementSibling;
      const currentLikes = parseInt(likesElement.textContent.split(" ")[0]);
      const newNumberOfLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: newNumberOfLikes })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(updatedToy => {
          likesElement.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => console.error("Error updating toy likes:", error));
    }
  });

  // Fetch and render toys when the page loads
  fetchToys();
});
