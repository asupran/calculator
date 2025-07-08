// Clean tariff calculator - simplified and working

// Product data with ASP for margin calculations
const products = {
    'VX62R': { cogs: 61.12, asp: 212.49, category: 'speakers' },
    'IS6': { cogs: 153.71, asp: 570.44, category: 'speakers' },
    'PS-C63RT WHITE EA': { cogs: 64.10, asp: 137.26, category: 'speakers' },
    'CONNECT PRO MINI CASE': { cogs: 52.34, asp: 196.16, category: 'iport' },
    'C-PRO UTILITY CASE 11PRO M4 GN': { cogs: 78.47, asp: 215.00, category: 'iport' },
    'CONNECT MOUNT Case iPad A16 BK': { cogs: 39.66, asp: 78.26, category: 'iport' },
    'UA 2-125 DSP AMPLIFIER': { cogs: 172.21, asp: 484.00, category: 'amplifiers' },
    'DSP 8-130 MKIII': { cogs: 632.14, asp: 1709.88, category: 'amplifiers' }
};

// OFFICIAL U.S. Tariff Rates
const tariffs = {
    china: { speakers: 0.375, amplifiers: 0.55, iport: 0.55 },
    vietnam: { speakers: 0.20, amplifiers: 0.20, iport: 0.20 },
    thailand: { speakers: 0.36, amplifiers: 0.36, iport: 0.36 },
    cambodia: { speakers: 0.00, amplifiers: 0.00, iport: 0.00 },
    indonesia: { speakers: 0.32, amplifiers: 0.32, iport: 0.32 },
    malaysia: { speakers: 0.24, amplifiers: 0.24, iport: 0.24 }
};

// Manufacturing premiums
const premiums = {
    china: 0.00,
    vietnam: 0.125,
    thailand: 0.125,
    cambodia: 0.15,
    indonesia: 0.125,
    malaysia: 0.125
};

// Country name mapping
const countryNames = {
    china: '🇨🇳 China',
    vietnam: '🇻🇳 Vietnam',
    malaysia: '🇲🇾 Malaysia',
    thailand: '🇹🇭 Thailand',
    indonesia: '🇮🇩 Indonesia',
    cambodia: '🇰🇭 Cambodia'
};

// Current selections
let currentProduct = null;
let selectedCategory = null;
let selectedCountryA = null;
let selectedCountryB = null;

// Calculate total cost for a country
function calculateCountryCost(productKey, category, country) {
    const product = products[productKey];
    if (!product) return null;
    
    const baseCost = product.cogs;
    const manufacturingPremium = premiums[country] || 0;
    const manufacturingCost = baseCost * (1 + manufacturingPremium);
    
    const tariffRate = tariffs[country] ? tariffs[country][category] || 0 : 0;
    const tariffAmount = manufacturingCost * tariffRate;
    const totalCost = manufacturingCost + tariffAmount;
    
    
    return {
        baseCost,
        manufacturingCost,
        tariffRate,
        tariffAmount,
        totalCost
    };
}

// Update results display
function updateResults() {
    if (!currentProduct || !selectedCategory || !selectedCountryA || !selectedCountryB) {
        return;
    }
    
    const costA = calculateCountryCost(currentProduct, selectedCategory, selectedCountryA);
    const costB = calculateCountryCost(currentProduct, selectedCategory, selectedCountryB);
    
    if (!costA || !costB) return;
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Determine winner
    const winner = costA.totalCost < costB.totalCost ? 'A' : 'B';
    const savings = Math.abs(costA.totalCost - costB.totalCost);
    const winnerCountry = winner === 'A' ? selectedCountryA : selectedCountryB;
    
    // Update winner section
    document.getElementById('winner-title').textContent = `🏆 Winner: ${countryNames[winnerCountry]}`;
    document.getElementById('winner-text').textContent = `${countryNames[winnerCountry]} saves you $${savings.toFixed(2)} per unit`;
    
    // Update country A results
    document.getElementById('country-a-name').textContent = countryNames[selectedCountryA];
    document.getElementById('country-a-base').textContent = `$${costA.manufacturingCost.toFixed(2)}`;
    document.getElementById('country-a-tariff').textContent = `$${costA.tariffAmount.toFixed(2)}`;
    document.getElementById('country-a-total').textContent = `$${costA.totalCost.toFixed(2)}`;
    
    // Update country B results
    document.getElementById('country-b-name').textContent = countryNames[selectedCountryB];
    document.getElementById('country-b-base').textContent = `$${costB.manufacturingCost.toFixed(2)}`;
    document.getElementById('country-b-tariff').textContent = `$${costB.tariffAmount.toFixed(2)}`;
    document.getElementById('country-b-total').textContent = `$${costB.totalCost.toFixed(2)}`;
    
    // Update tariff labels with correct rates for selected category
    const tariffRateA = (costA.tariffRate * 100).toFixed(1);
    const tariffRateB = (costB.tariffRate * 100).toFixed(1);
    
    document.getElementById('country-a-tariff-label').textContent = `Tariff (${tariffRateA}%):`;
    document.getElementById('country-b-tariff-label').textContent = `Tariff (${tariffRateB}%):`;
    
    // Add winner styling
    const countryAResult = document.getElementById('country-a-result');
    const countryBResult = document.getElementById('country-b-result');
    
    countryAResult.classList.remove('winner');
    countryBResult.classList.remove('winner');
    
    if (winner === 'A') {
        countryAResult.classList.add('winner');
    } else {
        countryBResult.classList.add('winner');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Product selection
    document.getElementById('product-select').addEventListener('change', function() {
        const productKey = this.value;
        if (productKey && products[productKey]) {
            currentProduct = productKey;
            selectedCategory = products[productKey].category;
            
            // Auto-select category button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.category === selectedCategory) {
                    btn.classList.add('selected');
                }
            });
            
            updateResults();
        }
    });
    
    // Category selection
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedCategory = this.dataset.category;
            updateResults();
        });
    });
    
    // Country selection
    document.querySelectorAll('.country-btn').forEach(button => {
        button.addEventListener('click', function() {
            const country = this.dataset.country;
            const selection = this.dataset.selection;
            
            if (selection === 'a') {
                // Clear previous Country A selection
                document.querySelectorAll('[data-selection="a"]').forEach(btn => {
                    btn.classList.remove('selected-a');
                });
                this.classList.add('selected-a');
                selectedCountryA = country;
            } else if (selection === 'b') {
                // Clear previous Country B selection
                document.querySelectorAll('[data-selection="b"]').forEach(btn => {
                    btn.classList.remove('selected-b');
                });
                this.classList.add('selected-b');
                selectedCountryB = country;
            }
            
            updateResults();
        });
    });
});