const URL = "https://restcountries.com/v3.1/all";

let allCountries = document.querySelector('.allCountries .row');
let logo = document.querySelector('header .logo-block');

// Fetch all countries and populate the initial list
fetch(URL)
    .then(res => res.json())
    .then(data => {
        data.forEach((country, index) => {
            let { flags, name, capital, population } = country;

            let svg = flags.svg;
            let commonName = name.common;
            let mainIndex = index + 1;

            const card = `<div class="col-lg-3 mb-4">
                            <div class="card" id="${mainIndex}">
                                <div class="card-img">
                                    <img src="${svg}" alt="" class="img-fluid">
                                </div>
                                <div class="card-body">
                                    <h3>${commonName}</h3>
                                    <h5>${capital}</h5>
                                    <span>Population: ${population}</span>
                                    <a href="#" class="single-page" data-name="${commonName}">view details</a>
                                </div>
                            </div>
                        </div>`;

            allCountries.innerHTML += card;

            // Add India logo if the country is India
            if (commonName === 'India') {
                let india_img = flags.svg;
                let logo_img = `<img src="${india_img}" alt="" class="img-fluid">`;
                logo.innerHTML = logo_img;
            }
        });
    });

// Event delegation for 'view details' buttons
allCountries.addEventListener('click', function (e) {
    if (e.target.classList.contains('single-page')) {
        e.preventDefault(); // Prevent default anchor behavior
        let countryName = e.target.getAttribute('data-name');
        let encodedCountryName = encodeURIComponent(countryName); // Encode the country name
        window.location.href = `https://ratnadeeplca.github.io/country/single.html?countryname=${encodedCountryName}`;
    }
});


// Search Field ------------------------------

const newUrl = 'https://restcountries.com/v3.1/all';

let search_field = document.getElementById('search');
const all_Countries = document.querySelector('.allCountries .row'); // Ensure this element exists

// Debounce function to limit API calls while typing
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

// Function to handle the search logic
function performSearch() {
    let searchValue = search_field.value.trim(); // Remove extra spaces
    let searchLower = searchValue.toLowerCase(); // Convert search to lowercase

    // Ensure the "allCountries" element is not null and exists in the DOM
    if (!all_Countries) {
        console.error('Element with class "allCountries" not found.');
        return;
    }

    // Clear the previous result
    all_Countries.innerHTML = '';

    fetch(newUrl)
        .then(res => res.json())
        .then(data => {
            let found = false; // To track if we found the country
            data.forEach((country) => {
                let { flags, name, capital, population } = country;
                let commonName = name.common; // Country name
                let lowerCommonName = commonName.toLowerCase(); // Lowercase country name
                let lowerCapital = (capital && capital.length > 0) ? capital[0].toLowerCase() : ''; // Lowercase capital name
                let svg = flags.svg;

                // Show all countries if the search field is empty
                if (searchLower === '') {
                    found = true; // Mark as found
                    showCountryCard(svg, commonName, capital, population);
                }
                // Otherwise, show countries whose names or capital names include the search string (partial match)
                else if (lowerCommonName.includes(searchLower) || lowerCapital.includes(searchLower)) {
                    found = true; // Mark as found
                    showCountryCard(svg, commonName, capital, population);
                }
            });

            // If no country was found, display an error message
            if (!found && searchLower !== '') {
                all_Countries.innerHTML = `<p>Country or capital not found. Please try again.</p>`;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

// Function to display a country's card
function showCountryCard(svg, commonName, capital, population) {
    const card = `<div class="col-lg-3 mb-4">
                    <div class="card">
                        <div class="card-img">
                            <img src="${svg}" alt="" class="img-fluid">
                        </div>
                        <div class="card-body">
                            <h3>${commonName.toUpperCase()}</h3>
                            <h5>${capital}</h5>
                            <span>Population: ${population}</span>
                            <a href="#" class="single-page" data-name="${commonName}">view details</a>
                        </div>
                    </div>
                </div>`;

    // Add the card to the all_Countries container
    all_Countries.innerHTML += card;
}

// Add input event listener with debounce
search_field.addEventListener('input', debounce(performSearch, 300)); // 300ms delay for debounce
