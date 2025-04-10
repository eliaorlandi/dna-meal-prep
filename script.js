document.addEventListener('DOMContentLoaded', () => {
    const foodListContainer = document.getElementById('foodListContainer');
    const searchInput = document.getElementById('searchInput');
    let allFoodData = []; // To store all data fetched from JSON

    // --- Fetch data from JSON file ---
    fetch('alimenti.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allFoodData = data;
            displayFood(allFoodData); // Initial display of all data
        })
        .catch(error => {
            console.error("Errore nel caricamento del file JSON:", error);
            foodListContainer.innerHTML = `<p class="error-message">Impossibile caricare i dati degli alimenti. Riprova più tardi.</p>`;
        });

    // --- Function to determine color based on value ---
    function getValueColorClass(value) {
        if (value >= 0 && value <= 15) return 'color-red';
        if (value >= 16 && value <= 35) return 'color-orange';
        if (value >= 36 && value <= 70) return 'color-yellow';
        if (value >= 71 && value <= 100) return 'color-green';
        return ''; // Default case (shouldn't happen with valid data)
    }

    // --- Function to display food items ---
    function displayFood(foodArray) {
        foodListContainer.innerHTML = ''; // Clear previous content or loading message

        if (foodArray.length === 0) {
            foodListContainer.innerHTML = `<p class="no-results-message">Nessun alimento trovato.</p>`;
            return;
        }

        // Group food items by category
        const groupedByCategory = foodArray.reduce((acc, item) => {
            const category = item.category || 'Senza Categoria'; // Fallback category
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        // Sort categories alphabetically (optional)
        const sortedCategories = Object.keys(groupedByCategory).sort();

        // Create HTML for each category and its items
        sortedCategories.forEach(category => {
            const categorySection = document.createElement('section');
            categorySection.className = 'category-section';

            const categoryHeader = document.createElement('h2');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category;
            categorySection.appendChild(categoryHeader);

            // Sort items within the category alphabetically by name (optional)
            groupedByCategory[category].sort((a, b) => a.name.localeCompare(b.name));

            groupedByCategory[category].forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'food-item';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'food-name';
                nameSpan.textContent = item.name;

                const valueSpan = document.createElement('span');
                valueSpan.className = 'food-value';
                valueSpan.textContent = item.value;

                const barContainer = document.createElement('div');
                barContainer.className = 'value-bar-container';

                const bar = document.createElement('div');
                bar.className = `value-bar ${getValueColorClass(item.value)}`;
                // Set width based on value (assuming max is 100)
                bar.style.width = `${item.value}%`;

                barContainer.appendChild(bar);

                itemDiv.appendChild(nameSpan);
                itemDiv.appendChild(valueSpan);
                itemDiv.appendChild(barContainer);

                categorySection.appendChild(itemDiv);
            });

            foodListContainer.appendChild(categorySection);
        });
    }

    // --- Event Listener for Search Input ---
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();

        const filteredFood = allFoodData.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) // Optional: search also in category
        );

        displayFood(filteredFood);
    });

});