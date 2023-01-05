//global variables

//adding listener to form submission
window.onload = function () {
    document.getElementById("input_form").addEventListener("submit", function (event) {
        //prevent submit from working
        event.preventDefault();
        submitForm();
    });
}

//doing the submission job
function submitForm() {
    //clear any previous errors
    const error = document.getElementById("error");
    error.innerHTML = "";
    //catch the input username
    const input = document.getElementById("username");
    const inputUsername = input.value.trim().toLowerCase();
    //clear input
    input.value = "";

    if(!inputUsername) {
        error.innerHTML = "Username cannot be empty.";
        return;
    }

    //check local storage
    let response = localStorage.getItem(inputUsername)
    //if not cached, request from api
    if(response === null)
        response = api(inputUsername);
    //show error if request failed
    if(response === false)
    {
        error.innerHTML = "Could not get user info.";
    }
    else //success
    {
        //cache info for later (or overwrite)
        localStorage.setItem(inputUsername, response);
        //convert response text to json
        let json = JSON.parse(response);
        setUser(json.avatar_url, json.name, json.blog, json.location, json.bio);
    }
}

//set user info in page using the given parameters
function setUser(avatar, name, blog, location, bio) {
    //getting required elements from document
    const userAvatar = document.getElementById("avatar");
    const userName = document.getElementById("user_name");
    const userBlog = document.getElementById("user_blog");
    const userLocation = document.getElementById("user_location");
    const userBio = document.getElementById("user_bio");

    if(bio)
    {
        //remove \r
        bio = bio.replaceAll("\\r", "")
        //replace \n with html new line <br>
        bio = bio.replaceAll("\\n", "<br>")
    }

    //check if an item is valid (not null, not empty, logically true) and apply it to html, else use the default avatar
    userAvatar.setAttribute("src", avatar ? avatar : "resources/avatar.png");
    userName.innerHTML = name ? name : "[No Name]";
    userBlog.innerHTML = blog ? blog : "[No Blog]";
    userLocation.innerHTML = location ? location : "[No Location]";
    userBio.innerHTML = bio ? bio : "[No Bio]";
}

//a simple function to fetch json from GitHub api (returns false on failure)
function api(username) {
    const url = "https://api.github.com/users/" + username;

    let req = new XMLHttpRequest();
    //synced request for simplicity (async needs callback)
    req.open("GET", url, false);
    //body is null, since the request is GET
    req.send(null);
    if (req.status === 200)
        return req.responseText;
    return false;
}
