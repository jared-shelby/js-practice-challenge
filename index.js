// Deliverable 1
fetch(`http://localhost:3000/travelers/1`)
    .then(response => response.json())
    .then(data => {
        document.querySelector("#profile h2").innerHTML = data.name;
        document.querySelector("#profile img").src = data.photo;
        document.querySelector("#profile em").innerHTML = data.nickname;
        document.querySelector("#profile .likes").innerHTML = `${data.likes} Likes`;
    });

// Deliverable 2
function renderAnimalSightingPost(animalObject) {
    const li = document.createElement("li")
    li.dataset.id = animalObject.id

    const p = document.createElement("p")
    p.textContent = animalObject.description

    const img = document.createElement("img")
    img.src = animalObject.photo
    img.alt = animalObject.species

    const a = document.createElement("a")
    a.href = animalObject.link
    a.target = "_blank"
    a.textContent = `Here's a video about the ${animalObject.species} species!`

    const sightLikesPtag = document.createElement('p')
    sightLikesPtag.className = 'likes-display'
    sightLikesPtag.textContent = `${animalObject.likes} Likes`

    const likeButton = document.createElement('button')
    likeButton.classList.add('like-button')
    likeButton.type = 'button'
    likeButton.textContent = 'Like'

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')
    deleteButton.type = 'button'
    deleteButton.textContent = 'Delete'
    
    const updateButton = document.createElement('button')
    updateButton.classList.add('toggle-update-form-button')
    updateButton.type = 'button'
    updateButton.textContent = 'Toggle Update Form'

    const updateForm = document.createElement('form')
    updateForm.className = 'update-form'
    updateForm.innerHTML = `
    <input type='text' value='${animalObject.description}' name='description'/>
    <input type="submit" value="Update description" />
    `
    updateForm.style.display = 'none'

    li.append(p, img, a, sightLikesPtag, likeButton, deleteButton, updateButton, updateForm)

    const animalsUl = document.querySelector("#animals")
    animalsUl.append(li)
}

fetch(`http://localhost:3000/travelers/1`)
    .then(response => response.json())
    .then(data => {
        const animalSightings = data.animalSightings;
        animalSightings.forEach(animalSightingObject => renderAnimalSightingPost(animalSightingObject));
    });

// Deliverable 3
const form = document.querySelector("#new-animal-sighting-form");
form.addEventListener("submit", event => {
    event.preventDefault();

    const newAnimalObj = {
        travelerId: 1,
        species: form.species.value,
        photo: form.photo.value,
        link: form.video.value,
        description: form.description.value,
        likes: 0
    };

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newAnimalObj)
    };

    fetch("http://localhost:3000/animalSightings", configObj)
        .then(response => response.json())
        .then(data => renderAnimalSightingPost(data))
        .catch(error => document.body.innerHTML += `<p style = 'color: red'>${error.message}</p>`);
});

// Deliverable 4
const likeButton = document.querySelector(".like-button");
likeButton.addEventListener("click", event => {
    const likeP = document.querySelector("#profile .likes");
    const newLikes = parseInt(likeP.textContent) + 1;
    likeP.textContent = `${newLikes} Likes`;
    fetch("http://localhost:3000/travelers/1", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({likes: newLikes})
    })
    .then(response => response.json())
    .then(console.log);
});

// Deliverable 5 & 6 & 7
const animalSightingList = document.querySelector("#animals");
animalSightingList.addEventListener("click", event => {
    let li = event.target.parentElement;
    switch (true) {
        case (event.target.classList.contains("like-button")):
            const likesDisplay = li.querySelector(".likes-display");
            const newLikesDisplay = parseInt(likesDisplay.textContent) + 1;
            likesDisplay.textContent = `${newLikesDisplay} Likes`;
            fetch(`http://localhost:3000/animalSightings/${li.dataset["id"]}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({likes: newLikesDisplay})
            })
            .then(response => response.json())
            .then(console.log);
            break;
        case (event.target.classList.contains("delete-button")):

            fetch(`http://localhost:3000/animalSightings/${li.dataset["id"]}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(() => li.remove());
            break;
        case (event.target.classList.contains("toggle-update-form-button")):
            let updateForm = li.querySelector('.update-form');
            if (updateForm.style.display == 'none') {
                updateForm.style.display = 'block'
            } else {
                updateForm.style.display = 'none';
            }
            break;
        case (event.target.type == "submit"):
            event.preventDefault();
            li = li.parentElement;
            debugger;
            const newDesc = li.querySelector('.update-form').description.value;
            fetch(`http://localhost:3000/animalSightings/${li.dataset["id"]}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({description: newDesc})
            })
            .then(response => response.json())
            .then(console.log);

            li.querySelector("p").innerHTML = newDesc;
            break;
        }
})
