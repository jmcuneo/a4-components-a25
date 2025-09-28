const getUserStatus = async function(){
  try {
    // console.log("Getting User Status");
    const response = await fetch("/user");
    const session = await response.json();
    // console.log(session);
    // console.log(session.user);
    // console.log(session.status);
    const statusUser = {
      status: session.status,
      user: session.user
    }
    // console.log(statusUser);
    return statusUser;
  } catch (error){
    console.error("Failed to Fetch User Status")
  }
}

const submit = async function(event){
  event.preventDefault();
  // console.log("Hello");

  const review = {
    title: document.querySelector("#title").value,
    year: parseInt(document.querySelector("#year").value) || 0,
    blurb: document.querySelector("#blurb").value,
    gameplayRating: parseInt(document.querySelector("#gameplayRating").value) || 0,
    storyRating: parseInt(document.querySelector("#storyRating").value) || 0,
    visualsRating: parseInt(document.querySelector("#visualsRating").value) || 0,
    musicRating: parseInt(document.querySelector("#musicRating").value) || 0
  }

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    })

    if (response.ok){
      window.location.href = "reviews.html";
    } else {
      console.log("Error");
      console.log(response);
      console.error(await response.json())
    }
  } catch (error){
    console.error("Error Submitting Review Data: ", error);
  }
  
}

const logCheck = async function(){
  const logLink = document.querySelector("#log-link");
  logLink.onclick = async (event) => {
    event.preventDefault();
    await fetch("/logout", { method: "POST" });
    location.reload();
  }
}

window.onload = async function(){
  // console.log("Test");
  const userStatus = await getUserStatus();
  if (!userStatus.status){
    window.location.href = "login.html";
    return;
  }

  const submitButton = document.getElementById("submit-button");
  if (submitButton)
    submitButton.onclick = submit;

  const logLink = document.querySelector("#log-link");
  logLink.onclick = async (event) => {
    event.preventDefault();
    await fetch("/logout", { method: "POST" });
    location.reload();
  }
}

