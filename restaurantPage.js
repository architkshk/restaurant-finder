let zomatoKey = "431d60419a41cf39e6182c1c7e0d8dc9";
let details = {},
  reviews = [],
  start = 0;
let id = window.location.search.split("?")[1].split("=")[1];

let currentPage = 1;
let recordsPerPage = 2;

getRestaurantDetails = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${id}`;
      let headers = {
        Accept: "application/json",
        "user-key": zomatoKey
      };

      let response = await fetch(url, {
        method: "GET",
        headers
      });
      response = await response.json();

      details = response;
      resolve(details);
    } catch (error) {
      reject(error);
    }
  });
};

getReviews = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://developers.zomato.com/api/v2.1/reviews?res_id=${id}`;
      let headers = {
        Accept: "application/json",
        "user-key": zomatoKey
      };
      let response = await fetch(url, {
        method: "GET",
        headers
      });
      response = await response.json();
      reviews.push(...response.user_reviews);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

renderStars = n => {
  let i = ``,
    index;
  for (index = 0; index < n; index++) {
    i += "&#9733;";
  }
  while (index < 5) {
    i += "&#9734;";
    index++;
  }
  return i;
};

saveRestaurant = id => {
  let a = "";
  if (typeof Storage !== "undefined") {
    if (localStorage.getItem(id)) {
      localStorage.removeItem(id);
    } else {
      localStorage.setItem(id, true);
    }
    renderSaveButton(id);
  }
  return a;
};

renderSaveButton = () => {
  let a = "";
  if (typeof Storage !== "undefined") {
    let btn = document.getElementById(`save-${id}`);
    if (localStorage.getItem(id)) {
      btn.innerHTML = "Saved";
      btn.classList.add("saved");
    } else {
      btn.innerHTML = "Save";
      btn.classList.remove("saved");
    }
  }
  return "";
};

changePage = page => {
  let numPages = Math.ceil(reviews.length / recordsPerPage);
  let h = document.getElementById("reviews");
  h.innerHTML = "";
  let j = recordsPerPage * (page - 1);
  for (let i = j; i < j + recordsPerPage && i < reviews.length; i++) {
    let { review } = reviews[i];
    let b = `<div class="d-flex mb-4">
    <div class="user-pic mr-4">
      <img
        src="${review.user.profile_image}"
        alt=""
      />
    </div>
    <div style="flex: 1;">
      <h3>${review.user.name}</h3>
      <h3 class="mb-2">${renderStars(review.rating)}</h3>
      <p>${review.review_text}
      </p>
    </div>
  </div>`;
    h.innerHTML += b;
  }
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= numPages; i++) {
    let c = `<a class="pagination-btn" onclick="changePage(${i})">${i}</a>`;
    pagination.innerHTML += c;
  }
};

renderRestaurant = async () => {
  let s = document.getElementById("details");

  let a = `<div class="card mt-0 card-restaurant-detail">
    <div class="card-img br-0">
      <img
        class="img"
        src="${details.featured_image}"
      />

    </div>
    <div class="btn" id="save-${id}" onclick="saveRestaurant(${id})">
    Save
    </div>
    <div class="card-body d-flex flex-column">
      <div class="box">
        <h2 class="fw-700">${details.name}</h2>
        <br />
        
        <p>${details.user_rating.aggregate_rating} &starf; | ${
    details.user_rating.votes
  } votes</p>
      </div>
      <hr />
      <div class="box">
        <h4 class="mb-1">Cost for 2</h4>
        <div class="mb-3">Rs.${details.average_cost_for_two}</div>
        <h4 class="mb-1">Address</h4>
        <div class="mb-1" style="max-width: 600px;">${details.location.address}
        </div>
      </div>
      <hr />
      
      <div class="box d-flex">
        <div class="flex-1"><h4 class="mr-4">Photos</h4></div>
        <div class="flex-3">
          <h4 class="mb-1">Find photos <a href="${
            details.photos_url
          }">here</a></h4>
        </div>
      </div>
      <hr />
      
      <div class="box d-flex">
        <div class="flex-1"><h4 class="mr-4">Menu</h4></div>
        <div class="flex-3">
          <h4 class="mb-1">Find menu <a href="${details.menu_url}">here</a></h4>
        </div>
      </div>
      <hr />
      <div class="box">
        <h4 class="mb-2">Ratings</h4>
        <div id="reviews">
        </div>
        <div class="d-flex justify-content-center align-items-center" id="pagination">
        </div>
      </div>
      <hr />
    </div>
  `;
  s.innerHTML = a;
  renderSaveButton(id);
  await getReviews(id);
  changePage(1);
};

document.addEventListener("DOMContentLoaded", async function(event) {
  await getRestaurantDetails(id);
  renderRestaurant();
});
