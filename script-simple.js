// Simple, reliable tariff calculator

// Product data
const products = {
    'VX62R': { cogs: 61.12, category: 'speakers' },
    'IS6': { cogs: 153.71, category: 'speakers' },
    'PS-C63RT WHITE EA': { cogs: 64.10, category: 'speakers' },
    'CONNECT PRO MINI CASE': { cogs: 52.34, category: 'iport' },
    'C-PRO UTILITY CASE 11PRO M4 GN': { cogs: 78.47, category: 'iport' },
    'CONNECT MOUNT Case iPad A16 BK': { cogs: 39.66, category: 'iport' },
    'UA 2-125 DSP AMPLIFIER': { cogs: 172.21, category: 'amplifiers' },
    'DSP 8-130 MKIII': { cogs: 632.14, category: 'amplifiers' }
};

// Tariff rates
const tariffs = {
    china: { speakers: 0.30, iport: 0.30, amplifiers: 0.30 },
    vietnam: { speakers: 0.20, iport: 0.20, amplifiers: 0.20 },
    thailand: { speakers: 0.18, iport: 0.18, amplifiers: 0.18 },
    cambodia: { speakers: 0.08, iport: 0.10, amplifiers: 0.08 }
};

// Manufacturing premiums
const premiums = {
    china: 0.00,
    vietnam: 0.125,
    thailand: 0.125,
    cambodia: 0.15
};

// Current selections
let currentProduct = null;
let currentCountry = null;

// Wait for page to load
window.addEventListener('load', function() {
    console.log('Page loaded, setting up calculator');
    
    // Product selector
    const productSelect = document.getElementById('product-selector');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            console.log('Product selected:', this.value);
            selectProduct(this.value);
        });
    }
    
    // Country buttons
    const countryButtons = document.querySelectorAll('.country-btn');
    countryButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const country = this.getAttribute('data-country');
            console.log('Country selected:', country);
            selectCountry(country);
        });
    });
    
    console.log('Calculator setup complete');
});

function selectProduct(productName) {
    if (!productName || !products[productName]) {
        currentProduct = null;
        hideResults();
        return;
    }
    
    currentProduct = products[productName];
    console.log('Current product:', currentProduct);
    
    // Calculate if country is already selected
    if (currentCountry) {
        calculate();
    }
}

function selectCountry(country) {
    currentCountry = country;
    
    // Update button appearance
    document.querySelectorAll('.country-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector('[data-country="' + country + '"]');
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // Calculate if product is selected
    if (currentProduct) {
        calculate();
    }
}

function calculate() {
    if (!currentProduct || !currentCountry) {
        console.log('Missing product or country');
        return;
    }
    
    console.log('Calculating for:', currentProduct, currentCountry);
    
    // Get rates
    const baseCogs = currentProduct.cogs;
    const premium = premiums[currentCountry] || 0;
    const tariffRate = tariffs[currentCountry][currentProduct.category] || 0;
    
    // Calculate costs
    const adjustedCogs = baseCogs * (1 + premium);
    const tariffCost = adjustedCogs * tariffRate;
    const totalCost = adjustedCogs + tariffCost;
    
    console.log('Costs:', { baseCogs, premium, adjustedCogs, tariffCost, totalCost });
    
    // Show results
    showResults(baseCogs, adjustedCogs, premium, tariffCost, totalCost);
}

function showResults(baseCogs, adjustedCogs, premium, tariffCost, totalCost) {
    const resultsDiv = document.getElementById('results-simple');
    const costBreakdown = document.querySelector('.cost-breakdown');
    
    if (!resultsDiv || !costBreakdown) {
        console.log('Results elements not found');
        return;
    }
    
    // Update cost breakdown
    let html = '';
    
    if (premium > 0) {
        const premiumCost = adjustedCogs - baseCogs;
        html = `
            <div class="cost-row">
                <span>Base COGS (China equivalent):</span>
                <span>$${baseCogs.toFixed(2)}</span>
            </div>
            <div class="cost-row manufacturing-premium">
                <span>Manufacturing Premium (+${(premium * 100).toFixed(1)}%):</span>
                <span>$${premiumCost.toFixed(2)}</span>
            </div>
            <div class="cost-row">
                <span>Adjusted Product Cost:</span>
                <span>$${adjustedCogs.toFixed(2)}</span>
            </div>
            <div class="cost-row tariff-cost">
                <span>Tariff Cost:</span>
                <span>$${tariffCost.toFixed(2)}</span>
            </div>
            <div class="cost-row total-cost">
                <span>Total Cost:</span>
                <span>$${totalCost.toFixed(2)}</span>
            </div>
        `;
    } else {
        html = `
            <div class="cost-row">
                <span>Product Cost:</span>
                <span>$${adjustedCogs.toFixed(2)}</span>
            </div>
            <div class="cost-row tariff-cost">
                <span>Tariff Cost:</span>
                <span>$${tariffCost.toFixed(2)}</span>
            </div>
            <div class="cost-row total-cost">
                <span>Total Cost:</span>
                <span>$${totalCost.toFixed(2)}</span>
            </div>
        `;
    }
    
    costBreakdown.innerHTML = html;
    
    // Update comparison grid
    updateComparison();
    
    // Show results
    resultsDiv.style.display = 'block';
    console.log('Results displayed');
}

function updateComparison() {
    if (!currentProduct) return;
    
    const countries = ['china', 'vietnam', 'thailand'];
    const baseCogs = currentProduct.cogs;
    
    countries.forEach(function(country) {
        const premium = premiums[country] || 0;
        const adjustedCogs = baseCogs * (1 + premium);
        const tariffRate = tariffs[country][currentProduct.category] || 0;
        const tariffCost = adjustedCogs * tariffRate;
        const totalCost = adjustedCogs + tariffCost;
        
        const element = document.getElementById(country + '-cost');
        if (element) {
            element.textContent = '$' + totalCost.toFixed(2);
        }
    });
}

function hideResults() {
    const resultsDiv = document.getElementById('results-simple');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}