let zomatoKey = "431d60419a41cf39e6182c1c7e0d8dc9";

let cities = [
  { value: "Delhi NCR" },
  { value: "Bangalore" },
  { value: "Pune" },
  { value: "Mumbai" },
  { value: "Hyderabad" }
];

getCityId = city => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://developers.zomato.com/api/v2.1/cities?q=${city}`;
      let headers = {
        Accept: "application/json",
        "user-key": zomatoKey
      };

      let response = await fetch(url, {
        method: "GET",
        headers
      });
      response = await response.json();
      let location = response.location_suggestions[0];
      resolve(location.id);
    } catch (error) {
      reject(error);
    }
  });
};

document.addEventListener("DOMContentLoaded", function(event) {
  let s = document.getElementById("cities");
  cities = cities.forEach(async ({ value }) => {
    let id = await getCityId(value);
    let a = `<a href="restaurants.html?id=${id}">
    <div class="card city-card">
      <div class="card-body">
        <h3 class="fw-bold text-center">
          ${value}
        </h3>
      </div>
    </div>
    </a>`;
    s.innerHTML += a;
  });
  let h = document.getElementById("name");
  h.innerHTML = `Select a city`;
});
