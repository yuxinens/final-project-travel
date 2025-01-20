document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const popup = document.getElementById('popup');

    async function loadRecommendations() {
        const response = await fetch('travel_recommendation_api.json');
        return response.json();
    }

    function createPopupContent(items) {
        popup.innerHTML = '';
        if (items.length === 0) {
            const noResult = document.createElement('div');
            noResult.textContent = 'No recommendations found.';
            popup.appendChild(noResult);
        } else {
            items.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}"> <br>
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                `;
                popup.appendChild(div);
            });
        }
    }

    document.getElementById('clearButton').addEventListener('click', () => {
        searchBar.value = ''; // Clear the search bar
        popup.classList.remove('active'); // Hide the popup
    });

    searchBar.addEventListener('input', async () => {
        const query = searchBar.value.toLowerCase();
        const data = await loadRecommendations();

        let results = [];

        // Search for cities in countries
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)) {
                    results.push(city);
                }
            });
        });

        // Search for beaches based on name or category
        if (query.includes('beach') || query === 'beach') {
            results = results.concat(data.beaches);
        } else {
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(query)) {
                    results.push(beach);
                }
            });
        }

        // Search for temples based on name or category
        if (query.includes('temple') || query === 'temple') {
            results = results.concat(data.temples);
        } else {
            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(query)) {
                    results.push(temple);
                }
            });
        }

        createPopupContent(results);
        popup.classList.add('active');
    });

    document.addEventListener('click', (event) => {
        if (!popup.contains(event.target) && event.target !== searchBar) {
            popup.classList.remove('active');
        }
    });
});
