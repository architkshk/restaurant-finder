let zomatoKey = "431d60419a41cf39e6182c1c7e0d8dc9";
let city = "",
  start = 0,
  continueRequest = true,
  loading = false;

let id = window.location.search.split("?")[1].split("=")[1];

getRestaurants = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://developers.zomato.com/api/v2.1/search?entity_id=${id}&entity_type=city&start=${start}`;
      let headers = {
        Accept: "application/json",
        "user-key": zomatoKey
      };

      let response = await fetch(url, {
        method: "GET",
        headers
      });
      response = await response.json();
      let restaurants;

      if (response.restaurants.length) {
        if (city == "" && response.restaurants[0].restaurant)
          city = response.restaurants[0].restaurant.location.city;
        restaurants = response.restaurants.map(({ restaurant }) => ({
          id: restaurant.R.res_id,
          name: restaurant.name,
          thumb: restaurant.thumb,
          rating: restaurant.user_rating.aggregate_rating,
          votes: restaurant.user_rating.votes
        }));
        start += 20;
      } else {
        continueRequest = false;
      }
      loading = false;

      resolve(restaurants);
    } catch (error) {
      reject(error);
    }
  });
};

renderSaveButton = rid => {
  let a = "";
  if (typeof Storage !== "undefined") {
    let btn = document.getElementById(`save-${rid}`);
    if (localStorage.getItem(rid)) {
      btn.innerHTML = "Saved";
      btn.classList.add("saved");
    } else {
      btn.innerHTML = "Save";
      btn.classList.remove("saved");
    }
  }
  return "";
};

saveRestaurant = rid => {
  let a = "";
  if (typeof Storage !== "undefined") {
    if (localStorage.getItem(rid)) {
      localStorage.removeItem(rid);
    } else {
      localStorage.setItem(rid, true);
    }
    renderSaveButton(rid);
  }
  return a;
};

loadRestaurants = async () => {
  let s = document.getElementById("restaurants");
  let restaurants = await getRestaurants();
  if (restaurants) {
    restaurants.forEach(async ({ id, name, thumb, rating, votes }) => {
      let a = `
    <div class="card restaurant-card">
    <a href="restaurant-page.html?id=${id}">
    <div class="card-img">
        <img
          class="img"
          src=${thumb}
        />
      </div>
      <div class="card-body">
        <h3 class="fw-bold mb-1">
        ${name}
        </h3>
        <p>${rating} &starf; | ${votes} votes</p>
      </div>
      </a>
      <div class="btn" id="save-${id}" onclick="saveRestaurant(${id})">
      Save
      </div>
    </div>`;
      s.innerHTML += a;
      renderSaveButton(id);
    });
  }
};

getDistFromBottom = () => {
  let scrollPosition = window.pageYOffset,
    windowSize = window.innerHeight,
    bodyHeight = document.body.offsetHeight;
  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
};

document.addEventListener("DOMContentLoaded", async function(event) {
  let h = document.getElementById("name");
  await loadRestaurants();
  document.addEventListener("scroll", function() {
    let distToBottom = getDistFromBottom();
    if (
      !loading &&
      continueRequest &&
      distToBottom > 0 &&
      distToBottom <= 1000
    ) {
      loading = true;
      loadRestaurants();
    }
  });
  h.innerHTML = `Restaurants around ${city}`;
});
