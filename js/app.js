const loginComponent = document.getElementById("login");
const profileComponent = document.getElementById("profile");
const repoComponent = document.getElementById("repo");
const followerComponent = document.getElementById("follower");
const usernameInput = document.getElementById("username_input");
const spinner = document.getElementById("spinner");
const root = document.getElementById("root");

const showModal = (message) => {
  const errorModal = document.createElement("div");
  // errorModal.className ="dialog-box animate__animated animate__wobble  w-50 fixed-top mx-auto mt-5 text-center bg-white border border-1 rounded-6 p-4 shadow-lg"
  errorModal.id = "modal";
  errorModal.innerHTML = `
    <div class="dialog-box animate__animated animate__wobble  w-50 fixed-top mx-auto mt-5 text-center bg-white border border-1 rounded-6 p-4 shadow-lg">
      <div class="dialog-close">X</div>
       <p class="card-text fw-light my-4">${message}</p>
   </div>
 `;
  root.appendChild(errorModal);
  //    close dialog
  root.onclick = (event) => {
    if (
      (event.target.className.split(" ")[0] != "dialog-box" &&
        event.target.parentNode.className.split(" ")[0] != "dialog-box") ||
      event.target.className == "dialog-close"
    ) {
      // if(errorModal){

      //    errorModal?.parentNode?.removeChild(errorModal)}

      //alternative way to remove modal
      /*  const modal = document.getElementById('modal')
      modal?  modal.parentNode.removeChild(modal) :"" */

      const getModal = document.getElementsByClassName("dialog-box");
      for (const modal of getModal) {
        modal.parentNode.removeChild(modal);
      }
    }
  };
};

const display = (componenet, type) => {
  if (type === "block") {
    type = "flex";
  }
  componenet.style.display = type;
};

const showLogin = () => {
  display(loginComponent, "block");
  display(profileComponent, "none");
  display(repoComponent, "none");
  display(followerComponent, "none");
  display(spinner, "none");
};
showLogin();

// pressEnter Btn
usernameInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    loadData();
  }
});
const loadData = async () => {
  const username = usernameInput.value;
  usernameInput.value = "";

  if (username === "") {
    showModal(`Please enter a github username to Inspect Account!`);
  } else {
    const url = `https://api.github.com/users/${username}`;
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      showProfile(data);
    } else if (res.status === 404) {
      showModal(`No github account found with username "${username}"`);
    }
  }
};
//user inner text
const setInnerText = (id, text) => {
  document.getElementById(id).innerText = text;
};

const setImageSrc = (id, src) => {
  document.getElementById(id).setAttribute("src", src);
};
const showProfile = (user) => {
  repoComponent.textContent = "";
  followerComponent.textContent = "";
  display(loginComponent, "none");
  display(profileComponent, "block");

  setImageSrc("profile_pic", user?.avatar_url);
  setInnerText("fullname", user?.name ? user.name : "not found");
  setInnerText("username", user?.login);
  setInnerText("bio", user?.bio ? user.bio : "not found");
  setInnerText("total_follower", user?.followers);
  setInnerText("total_following", user?.following);
  setInnerText("location", user?.location ? user?.location : "not found");
  setInnerText(
    "created",
    new Date(user?.created_at).toLocaleString().split(",")[0]
  );
  loadRepository(user?.repos_url);
  loadFollower(user?.followers_url);
};

const loadRepository = async (url) => {
  display(spinner, "block");
  showRepository();

  const res = await fetch(url);
  if (res.status === 200) {
    const repos = await res.json();
    display(spinner, "none");
    repos?.forEach((repo, i) => {
      const repoCard = document.createElement("div");
      repoCard.className="col-md-6 col-sm-12"
      repoCard.innerHTML = `
        <div class="card shadow rounded-8 animate__animated ${
          i % 2 == 0 ? "animate__fadeInLeft" : "animate__fadeInRight"
        }">
            <div class="card-body ">
                <h5 class="fs-5 text-dark"> ${repo?.name}</h5>
                <p class= "my-0 fw-light text-muted">${
                  repo?.description ? repo.description : "Description not found"
                } </p>
                <p class="fw-light my-0">Language: ${
                  repo?.language ? repo.language : "not found"
                }</p>
                <p class="fw-light my-0 ">Updated at: ${
                  new Date(repo?.updated_at).toLocaleString().split(",")[0]
                }</p>
            </div>
            <a href=${
              repo?.html_url
            } target="blank" class="mb-2 btn btn-outline-dark py-2 w-50 mx-auto ">Find in github</a>  
        </div>
            `;
      repoComponent.appendChild(repoCard);
    });
  }
};

const loadFollower = async (url) => {
  const res = await fetch(url);
  if (res.status === 200) {
    const followers = await res.json();
    followers?.forEach((follower, i) => {
      const userCard = document.createElement("div");
      userCard.className="col-md-6 col-sm-12"
      userCard.innerHTML = `
      <div class="card shadow rounded-8 animate__animated ${
        i % 2 == 0 ? "animate__fadeInLeft" : "animate__fadeInRight"
      }">
        <div class="card-body row">
          <div class="col-md-3">
            <img class="img-fluid rounded-circle" src="${
              follower?.avatar_url
            }" alt="" />
          </div>
        <div class="col-md-8 p-2 text-uppercase">
          <h5 class="fs-6 fw-normal text-dark">${follower?.login}</h5>
          <small>
            <a class="fw-light text-decoration-underline text-danger me-1" href=${
              follower?.html_url
            } target="blank">
              find in github
            </a>
            <button onclick="switchAccount('${
              follower?.login
            }')" class="btn btn-danger p-1">switch to this account</button>
          </small>
        </div>
      </div>
    </div>
      `;
      followerComponent.appendChild(userCard);
    });
  }
};
const showRepository = (event) => {
  display(repoComponent, "block");
  display(followerComponent, "none");
};
const showFollower = () => {
  display(followerComponent, "block");
  display(repoComponent, "none");
};

const switchAccount = (username) => {
  usernameInput.value = username;
  usernameInput.autofocus = true;
  showLogin();
};
const logOut = () => {
  location.reload();
};
