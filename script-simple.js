// Simple, reliable tariff calculator

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

// OFFICIAL U.S. Tariff Rates (July 2025) - Corrected with accurate data
const tariffs = {
    china: { speakers: 0.375, amplifiers: 0.55, iport: 0.55 },  // 37.5% speakers, 55% amplifiers/electronics
    vietnam: { speakers: 0.20, amplifiers: 0.20, iport: 0.20 },   // 20% for most goods
    thailand: { speakers: 0.36, amplifiers: 0.36, iport: 0.36 },  // 36% reciprocal
    cambodia: { speakers: 0.49, amplifiers: 0.49, iport: 0.49 },  // 49% reciprocal
    indonesia: { speakers: 0.32, amplifiers: 0.32, iport: 0.32 }, // 32% reciprocal
    malaysia: { speakers: 0.24, amplifiers: 0.24, iport: 0.24 },  // 24% reciprocal (corrected)
};

// Manufacturing premiums
const premiums = {
    china: 0.00,
    vietnam: 0.125,
    thailand: 0.125,
    cambodia: 0.15,
    indonesia: 0.125,
    malaysia: 0.125,
    kazakhstan: 0.20,
    southafrica: 0.18,
    myanmar: 0.25,
    laos: 0.22
};

// Current selections
let currentProduct = null;
let selectedCategory = null;
let selectedCountryA = null;
let selectedCountryB = null;
let countryACost = null;
let countryBCost = null;

// Cached DOM elements for performance
const domElements = {
    // Results elements
    resultsSimple: null,
    countryComparison: null,
    mathBreakdown: null,
    mathSteps: null,
    pricingResults: null,
    costImpactSummary: null,
    
    // Country comparison elements
    countryAName: null,
    countryATotalCost: null,
    countryASellingPrice: null,
    countryAProfit: null,
    countryAMargin: null,
    countryBName: null,
    countryBTotalCost: null,
    countryBProfit: null,
    countryBMargin: null,
    costDifference: null,
    winnerCard: null,
    winnerText: null,
    
    // Cost breakdown elements
    productCost: null,
    tariffCost: null,
    totalCostSimple: null,
    costBreakdown: null,
    
    // Quick scenarios elements
    chinaCost: null,
    chinaBase: null,
    chinaTariffAmount: null,
    vietnamCost: null,
    vietnamBase: null,
    vietnamTariffAmount: null,
    malaysiaCost: null,
    malaysiaBase: null,
    malaysiaTariffAmount: null,
    thailandCost: null,
    thailandBase: null,
    thailandTariffAmount: null,
    
    // Pricing strategy elements
    currentAsp: null,
    currentMarginDollars: null,
    currentMarginPercent: null,
    strategyLabel: null,
    recommendedAsp: null,
    newMarginDollars: null,
    newMarginPercent: null,
    priceIncrease: null,
    costIncreaseAmount: null,
    costIncreasePercent: null,
    
    // Button elements
    showMathBtn: null,
    protectMarginDollarsBtn: null,
    protectMarginPercentBtn: null,
    absorbIncreaseBtn: null
};

// Initialize DOM element cache
function initializeDOMCache() {
    // Results elements
    domElements.resultsSimple = document.getElementById('results-simple');
    domElements.countryComparison = document.getElementById('country-comparison');
    domElements.mathBreakdown = document.getElementById('math-breakdown');
    domElements.mathSteps = document.getElementById('math-steps');
    domElements.pricingResults = document.getElementById('pricing-results');
    domElements.costImpactSummary = document.getElementById('cost-impact-summary');
    
    // Country comparison elements
    domElements.countryAName = document.getElementById('country-a-name');
    domElements.countryATotalCost = document.getElementById('country-a-total-cost');
    domElements.countryASellingPrice = document.getElementById('country-a-selling-price');
    domElements.countryAProfit = document.getElementById('country-a-profit');
    domElements.countryAMargin = document.getElementById('country-a-margin');
    domElements.countryBName = document.getElementById('country-b-name');
    domElements.countryBTotalCost = document.getElementById('country-b-total-cost');
    domElements.countryBProfit = document.getElementById('country-b-profit');
    domElements.countryBMargin = document.getElementById('country-b-margin');
    domElements.costDifference = document.getElementById('cost-difference');
    domElements.winnerCard = document.getElementById('winner-card');
    domElements.winnerText = document.getElementById('winner-text');
    
    // Cost breakdown elements
    domElements.productCost = document.getElementById('product-cost');
    domElements.tariffCost = document.getElementById('tariff-cost');
    domElements.totalCostSimple = document.getElementById('total-cost-simple');
    domElements.costBreakdown = document.querySelector('.cost-breakdown');
    
    // Quick scenarios elements
    domElements.chinaCost = document.getElementById('china-cost');
    domElements.chinaBase = document.getElementById('china-base');
    domElements.chinaTariffAmount = document.getElementById('china-tariff-amount');
    domElements.vietnamCost = document.getElementById('vietnam-cost');
    domElements.vietnamBase = document.getElementById('vietnam-base');
    domElements.vietnamTariffAmount = document.getElementById('vietnam-tariff-amount');
    domElements.malaysiaCost = document.getElementById('malaysia-cost');
    domElements.malaysiaBase = document.getElementById('malaysia-base');
    domElements.malaysiaTariffAmount = document.getElementById('malaysia-tariff-amount');
    domElements.thailandCost = document.getElementById('thailand-cost');
    domElements.thailandBase = document.getElementById('thailand-base');
    domElements.thailandTariffAmount = document.getElementById('thailand-tariff-amount');
    
    // Pricing strategy elements
    domElements.currentAsp = document.getElementById('current-asp');
    domElements.currentMarginDollars = document.getElementById('current-margin-dollars');
    domElements.currentMarginPercent = document.getElementById('current-margin-percent');
    domElements.strategyLabel = document.getElementById('strategy-label');
    domElements.recommendedAsp = document.getElementById('recommended-asp');
    domElements.newMarginDollars = document.getElementById('new-margin-dollars');
    domElements.newMarginPercent = document.getElementById('new-margin-percent');
    domElements.priceIncrease = document.getElementById('price-increase');
    domElements.costIncreaseAmount = document.getElementById('cost-increase-amount');
    domElements.costIncreasePercent = document.getElementById('cost-increase-percent');
    
    // Button elements
    domElements.showMathBtn = document.getElementById('show-math');
    domElements.protectMarginDollarsBtn = document.getElementById('protect-margin-dollars');
    domElements.protectMarginPercentBtn = document.getElementById('protect-margin-percent');
    domElements.absorbIncreaseBtn = document.getElementById('absorb-increase');
}

// Country name mapping
const countryNames = {
    china: '🇨🇳 China',
    vietnam: '🇻🇳 Vietnam',
    malaysia: '🇲🇾 Malaysia',
    thailand: '🇹🇭 Thailand',
    indonesia: '🇮🇩 Indonesia',
    cambodia: '🇰🇭 Cambodia'
};

// Memoization cache for calculations
const calculationCache = new Map();

// Display two country comparison
function displayTwoCountryComparison() {
    const currentASP = currentProduct.asp;
    
    // Calculate profits at current ASP
    const countryAProfit = currentASP - countryACost.totalCost;
    const countryBProfit = currentASP - countryBCost.totalCost;
    const countryAMargin = (countryAProfit / currentASP) * 100;
    const countryBMargin = (countryBProfit / currentASP) * 100;
    
    // Update country A values using cached elements
    if (domElements.countryAName) domElements.countryAName.textContent = countryNames[selectedCountryA] || '🌍 Country A';
    if (domElements.countryATotalCost) domElements.countryATotalCost.textContent = '$' + countryACost.totalCost.toFixed(2);
    if (domElements.countryASellingPrice) domElements.countryASellingPrice.textContent = '$' + currentASP.toFixed(2);
    if (domElements.countryAProfit) domElements.countryAProfit.textContent = '$' + countryAProfit.toFixed(2);
    if (domElements.countryAMargin) domElements.countryAMargin.textContent = countryAMargin.toFixed(1) + '%';
    
    // Update country B values using cached elements
    if (domElements.countryBName) domElements.countryBName.textContent = countryNames[selectedCountryB] || '🌍 Country B';
    if (domElements.countryBTotalCost) domElements.countryBTotalCost.textContent = '$' + countryBCost.totalCost.toFixed(2);
    if (domElements.countryBProfit) domElements.countryBProfit.textContent = '$' + countryBProfit.toFixed(2);
    if (domElements.countryBMargin) domElements.countryBMargin.textContent = countryBMargin.toFixed(1) + '%';
    
    // Calculate and display cost difference
    const costDifference = countryBCost.totalCost - countryACost.totalCost;
    if (domElements.costDifference) {
        domElements.costDifference.textContent = (costDifference >= 0 ? '+$' : '-$') + Math.abs(costDifference).toFixed(2);
        
        // Color code the cost difference
        if (costDifference > 0) {
            domElements.costDifference.style.color = '#e74c3c';
        } else if (costDifference < 0) {
            domElements.costDifference.style.color = '#27ae60';
        } else {
            domElements.costDifference.style.color = '#2c3e50';
        }
    }
    
    // Show winner recommendation
    if (domElements.winnerCard && domElements.winnerText) {
        if (countryAProfit > countryBProfit) {
            const advantage = countryAProfit - countryBProfit;
            domElements.winnerText.textContent = `${countryNames[selectedCountryA]} is better by $${advantage.toFixed(2)} per unit (${advantage.toFixed(1)}% more profit)`;
            domElements.winnerCard.style.background = 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)';
            domElements.winnerCard.style.borderColor = '#27ae60';
        } else if (countryBProfit > countryAProfit) {
            const advantage = countryBProfit - countryAProfit;
            domElements.winnerText.textContent = `${countryNames[selectedCountryB]} is better by $${advantage.toFixed(2)} per unit (${advantage.toFixed(1)}% more profit)`;
            domElements.winnerCard.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)';
            domElements.winnerCard.style.borderColor = '#3498db';
        } else {
            domElements.winnerText.textContent = 'Both countries have equal profitability';
            domElements.winnerCard.style.background = 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)';
            domElements.winnerCard.style.borderColor = '#ffc107';
        }
        
        domElements.winnerCard.style.display = 'block';
    }
    
    // Show comparison section
    if (domElements.countryComparison) {
        domElements.countryComparison.style.display = 'block';
    }
    
    // Update cost breakdown for main display
    updateMainCostBreakdown();
}

function updateMainCostBreakdown() {
    // Show the more expensive country's costs (what users need to plan for)
    const currentASP = currentProduct.asp;
    const countryAProfit = currentASP - countryACost.totalCost;
    const countryBProfit = currentASP - countryBCost.totalCost;
    
    let displayCountry, displayCost;
    if (countryACost.totalCost >= countryBCost.totalCost) {
        displayCountry = selectedCountryA;
        displayCost = countryACost;
    } else {
        displayCountry = selectedCountryB;
        displayCost = countryBCost;
    }
    
    
    // Update the cost breakdown to show premium if applicable
    const costBreakdownDiv = document.querySelector('.cost-breakdown');
    const baseCogs = currentProduct.cogs;
    const premium = displayCost.premium || 0;
    
    let breakdownHTML = '';
    
    if (premium > 0) {
        const premiumCost = displayCost.manufacturingCost - baseCogs;
        breakdownHTML = `
            <div class="cost-row">
                <span>Base COGS (China equiv):</span>
                <span>$${baseCogs.toFixed(2)}</span>
            </div>
            <div class="cost-row manufacturing-premium">
                <span>Manufacturing Premium (+${(premium * 100).toFixed(1)}%):</span>
                <span>+$${premiumCost.toFixed(2)}</span>
            </div>
            <div class="cost-row">
                <span>Total Manufacturing Cost:</span>
                <span id="product-cost">$${displayCost.manufacturingCost.toFixed(2)}</span>
            </div>
            <div class="cost-row tariff-cost">
                <span>Import Tax (Tariff at ${(displayCost.tariffRate * 100).toFixed(1)}%):</span>
                <span id="tariff-cost">$${displayCost.tariffCost.toFixed(2)}</span>
            </div>
            <div class="cost-row total-cost">
                <span>Total Cost to You:</span>
                <span id="total-cost-simple">$${displayCost.totalCost.toFixed(2)}</span>
            </div>
        `;
    } else {
        breakdownHTML = `
            <div class="cost-row">
                <span>Manufacturing Cost:</span>
                <span id="product-cost">$${displayCost.manufacturingCost.toFixed(2)}</span>
            </div>
            <div class="cost-row tariff-cost">
                <span>Import Tax (Tariff at ${(displayCost.tariffRate * 100).toFixed(1)}%):</span>
                <span id="tariff-cost">$${displayCost.tariffCost.toFixed(2)}</span>
            </div>
            <div class="cost-row total-cost">
                <span>Total Cost to You:</span>
                <span id="total-cost-simple">$${displayCost.totalCost.toFixed(2)}</span>
            </div>
        `;
    }
    
    costBreakdownDiv.innerHTML = breakdownHTML;
    
    // Update quick scenarios for all countries
    updateQuickScenarios();
}

function updateQuickScenarios() {
    if (!currentProduct || !selectedCategory) {
        return;
    }
    
    // Calculate costs for all available countries
    const countries = ['china', 'vietnam', 'malaysia', 'thailand'];
    const baseCogs = currentProduct.cogs;
    
    countries.forEach(function(country) {
        const cost = calculateCountryCost(country);
        
        // Update base COGS using cached elements
        const baseElement = domElements[country + 'Base'];
        if (baseElement) {
            baseElement.textContent = '$' + baseCogs.toFixed(2);
        }
        
        // Update tariff amount using cached elements
        const tariffElement = domElements[country + 'TariffAmount'];
        if (tariffElement) {
            tariffElement.textContent = '$' + cost.tariffCost.toFixed(2);
        }
        
        // Update total cost using cached elements
        const totalElement = domElements[country + 'Cost'];
        if (totalElement) {
            totalElement.textContent = '$' + cost.totalCost.toFixed(0);
        }
    });
    
    // Find and highlight best/worst options
    const costData = countries.map(country => {
        const cost = calculateCountryCost(country);
        return { country: country, totalCost: cost.totalCost };
    });
    
    const minCost = Math.min(...costData.map(c => c.totalCost));
    const maxCost = Math.max(...costData.map(c => c.totalCost));
    
    // Update card styling (keeping this as querySelector since it's less frequent)
    costData.forEach(function(item) {
        const cards = document.querySelectorAll('.scenario-card');
        cards.forEach(function(card) {
            if (card.querySelector('#' + item.country + '-cost')) {
                card.classList.remove('best-option', 'worst-option');
                if (item.totalCost === minCost && countries.length > 1) {
                    card.classList.add('best-option');
                } else if (item.totalCost === maxCost && countries.length > 1) {
                    card.classList.add('worst-option');
                }
            }
        });
    });
}

// Wait for page to load
window.addEventListener('load', function() {
    // Initialize DOM element cache for better performance
    initializeDOMCache();
    
    // Test that we can find elements
    const productSelect = document.getElementById('product-selector');
    
    const countryButtons = document.querySelectorAll('.country-btn');
    
    // Product selector
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            selectProduct(this.value);
        });
    }
    
    // Category selector
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            selectCategory(category);
        });
    });
    
    // Country buttons
    countryButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            const country = this.getAttribute('data-country');
            const selection = this.getAttribute('data-selection');
            selectCountryForComparison(country, selection);
        });
    });
    
    // Pricing strategy buttons - Correct IDs from HTML
    const showDetailsBtn = document.getElementById('show-math');
    const keepSameProfitDollarsBtn = document.getElementById('protect-margin-dollars');
    const keepSameProfitPercentBtn = document.getElementById('protect-margin-percent');
    const absorbCostBtn = document.getElementById('absorb-increase');
    
    if (showDetailsBtn) {
        showDetailsBtn.addEventListener('click', function() {
            showDetailedMath();
        });
    }
    
    if (keepSameProfitDollarsBtn) {
        keepSameProfitDollarsBtn.addEventListener('click', function() {
            showPricingStrategy('protect-dollars');
        });
    }
    
    if (keepSameProfitPercentBtn) {
        keepSameProfitPercentBtn.addEventListener('click', function() {
            showPricingStrategy('protect-percent');
        });
    }
    
    if (absorbCostBtn) {
        absorbCostBtn.addEventListener('click', function() {
            showPricingStrategy('absorb');
        });
    }
    
    // AI Analysis buttons
    const analyzeTrendsBtn = document.getElementById('analyze-trends');
    const analyzeCountryBtn = document.getElementById('analyze-country');
    const analyzeForecastBtn = document.getElementById('analyze-forecast');
    
    if (analyzeTrendsBtn) {
        analyzeTrendsBtn.addEventListener('click', function() {
            performAIAnalysis('trends');
        });
    }
    
    if (analyzeCountryBtn) {
        analyzeCountryBtn.addEventListener('click', function() {
            performAIAnalysis('country');
        });
    }
    
    if (analyzeForecastBtn) {
        analyzeForecastBtn.addEventListener('click', function() {
            performAIAnalysis('forecast');
        });
    }
    
    // Portfolio functionality removed for simplicity
    
    // Sourcing wizard button
    const getRecommendationsBtn = document.getElementById('get-recommendations');
    if (getRecommendationsBtn) {
        getRecommendationsBtn.addEventListener('click', getSmartRecommendations);
    }
    
});

function selectProduct(productName) {
    
    if (!productName || !products[productName]) {
        currentProduct = null;
        hideResults();
        return;
    }
    
    currentProduct = products[productName];
    
    // Auto-select category based on product, but allow user to override
    if (!selectedCategory) {
        selectedCategory = currentProduct.category;
        updateCategoryButtons();
    }
    
    // Add visual feedback
    updateStatusDisplay();
    
    // Calculate if both countries are already selected
    if (selectedCategory && selectedCountryA && selectedCountryB) {
        calculateTwoCountryComparison();
    }
}

function selectCategory(category) {
    selectedCategory = category;
    updateCategoryButtons();
    updateStatusDisplay();
    
    // Recalculate if we have all required data
    if (currentProduct && selectedCountryA && selectedCountryB) {
        calculateTwoCountryComparison();
    }
}

function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });
    
    if (selectedCategory) {
        const selectedBtn = document.querySelector('.category-btn[data-category="' + selectedCategory + '"]');
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }
}

function updateStatusDisplay() {
    const statusDiv = document.getElementById('status-display');
    if (!statusDiv) return;
    
    let status = '';
    let color = '#fff3cd'; // yellow
    
    if (currentProduct) {
        status += '✅ Product: ' + Object.keys(products).find(key => products[key] === currentProduct) + ' ';
    } else {
        status += '🔴 Product: Not selected ';
    }
    
    if (selectedCategory) {
        status += '✅ Category: ' + selectedCategory + ' ';
    } else {
        status += '🔴 Category: Not selected ';
    }
    
    if (selectedCountryA) {
        status += '✅ Country A: ' + countryNames[selectedCountryA] + ' ';
    } else {
        status += '🔴 Country A: Not selected ';
    }
    
    if (selectedCountryB) {
        status += '✅ Country B: ' + countryNames[selectedCountryB] + ' ';
    } else {
        status += '🔴 Country B: Not selected ';
    }
    
    if (currentProduct && selectedCategory && selectedCountryA && selectedCountryB) {
        color = '#d1edff'; // green
        status += '🎉 READY TO CALCULATE!';
    }
    
    statusDiv.innerHTML = status;
    statusDiv.style.background = color;
}

function selectCountryForComparison(country, selection) {
    
    if (selection === 'a') {
        selectedCountryA = country;
        // Update button states for country A
        document.querySelectorAll('.country-btn[data-selection="a"]').forEach(function(btn) {
            btn.classList.remove('selected-a');
        });
        document.querySelector('.country-btn[data-country="' + country + '"][data-selection="a"]').classList.add('selected-a');
    } else if (selection === 'b') {
        selectedCountryB = country;
        // Update button states for country B
        document.querySelectorAll('.country-btn[data-selection="b"]').forEach(function(btn) {
            btn.classList.remove('selected-b');
        });
        document.querySelector('.country-btn[data-country="' + country + '"][data-selection="b"]').classList.add('selected-b');
    }
    
    
    updateStatusDisplay();
    
    // Calculate and display results if we have all required data
    if (currentProduct && selectedCategory && selectedCountryA && selectedCountryB) {
        calculateTwoCountryComparison();
    }
}

function calculateTwoCountryComparison() {
    
    if (!currentProduct || !selectedCategory || !selectedCountryA || !selectedCountryB) {
        return;
    }
    
    
    // Calculate costs for both countries
    countryACost = calculateCountryCost(selectedCountryA);
    countryBCost = calculateCountryCost(selectedCountryB);
    
    
    // Display comparison results
    displayTwoCountryComparison();
    
    // Show results section
    const resultsDiv = document.getElementById('results-simple');
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
        // Debug: Results should now be visible
        
        // Set up button event listeners now that results are visible (only once)
        if (!window.pricingButtonsSetup) {
            setupPricingButtons();
            window.pricingButtonsSetup = true;
        }
    } else {
        console.error('ERROR: Could not find results div!');
    }
}

function setupPricingButtons() {
    
    // Pricing strategy buttons - Correct IDs from HTML
    const showDetailsBtn = document.getElementById('show-math');
    const keepSameProfitDollarsBtn = document.getElementById('protect-margin-dollars');
    const keepSameProfitPercentBtn = document.getElementById('protect-margin-percent');
    const absorbCostBtn = document.getElementById('absorb-increase');
    
    if (showDetailsBtn) {
        showDetailsBtn.addEventListener('click', function() {
            showDetailedMath();
        });
    }
    
    if (keepSameProfitDollarsBtn) {
        keepSameProfitDollarsBtn.addEventListener('click', function() {
            showPricingStrategy('protect-dollars');
        });
    }
    
    if (keepSameProfitPercentBtn) {
        keepSameProfitPercentBtn.addEventListener('click', function() {
            showPricingStrategy('protect-percent');
        });
    }
    
    if (absorbCostBtn) {
        absorbCostBtn.addEventListener('click', function() {
            showPricingStrategy('absorb');
        });
    }
}

function calculateCountryCost(country) {
    // Create cache key from current calculation parameters
    const cacheKey = `${country}-${selectedCategory}-${currentProduct?.cogs || 0}`;
    
    // Check if result is already cached
    if (calculationCache.has(cacheKey)) {
        return calculationCache.get(cacheKey);
    }
    
    const tariffRate = tariffs[country][selectedCategory];
    const premium = premiums[country] || 0;
    const baseCogs = currentProduct.cogs;
    
    // Calculate manufacturing cost with premium
    const manufacturingCost = baseCogs * (1 + premium);
    
    // Calculate tariff
    const tariffCost = manufacturingCost * tariffRate;
    
    // Total cost
    const totalCost = manufacturingCost + tariffCost;
    
    const result = {
        manufacturingCost: manufacturingCost,
        tariffCost: tariffCost,
        totalCost: totalCost,
        tariffRate: tariffRate,
        premium: premium
    };
    
    // Cache the result
    calculationCache.set(cacheKey, result);
    
    return result;
}

// Legacy function removed - using calculateTwoCountryComparison instead

function showResults(baseCogs, adjustedCogs, premium, tariffCost, totalCost) {
    const resultsDiv = document.getElementById('results-simple');
    const costBreakdown = document.querySelector('.cost-breakdown');
    
    if (!resultsDiv || !costBreakdown) {
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
    
    // Add simple recommendation
    addSimpleRecommendation(totalCost, baseCogs, currentCountry);
    
    // Show results
    resultsDiv.style.display = 'block';
}

function updateComparison() {
    if (!currentProduct) return;
    
    const countries = ['china', 'vietnam', 'malaysia', 'thailand'];
    const baseCogs = currentProduct.cogs;
    const costs = [];
    
    // Calculate costs for all countries
    countries.forEach(function(country) {
        const premium = premiums[country] || 0;
        const adjustedCogs = baseCogs * (1 + premium);
        const tariffRate = tariffs[country][currentProduct.category] || 0;
        const tariffCost = adjustedCogs * tariffRate;
        const totalCost = adjustedCogs + tariffCost;
        
        costs.push({ country: country, cost: totalCost });
        
        const element = document.getElementById(country + '-cost');
        if (element) {
            element.textContent = '$' + totalCost.toFixed(2);
        }
    });
    
    // Find min and max costs
    const minCost = Math.min(...costs.map(c => c.cost));
    const maxCost = Math.max(...costs.map(c => c.cost));
    
    // Add visual indicators
    costs.forEach(function(item) {
        const card = document.getElementById(item.country + '-cost').parentElement;
        card.classList.remove('best-option', 'worst-option');
        
        if (item.cost === minCost && countries.length > 1) {
            card.classList.add('best-option');
        } else if (item.cost === maxCost && countries.length > 1) {
            card.classList.add('worst-option');
        }
    });
}

function hideResults() {
    const resultsDiv = document.getElementById('results-simple');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

function showPricingStrategy(strategy) {
    if (!currentProduct || !selectedCountryA || !selectedCountryB || !countryACost || !countryBCost) {
        return;
    }
    
    const currentASP = currentProduct.asp;
    const originalCOGS = currentProduct.cogs; // China baseline COGS
    
    // Use the more expensive country's cost as the basis for pricing strategy
    const expensiveCountry = countryACost.totalCost >= countryBCost.totalCost ? selectedCountryA : selectedCountryB;
    const expensiveCost = countryACost.totalCost >= countryBCost.totalCost ? countryACost : countryBCost;
    const newCOGS = expensiveCost.totalCost;
    
    // Current margins (based on China total cost including tariffs)
    const chinaTariffRate = tariffs.china[currentProduct.category];
    const chinaTotalCost = originalCOGS + (originalCOGS * chinaTariffRate);
    const currentMarginDollars = currentASP - chinaTotalCost;
    const currentMarginPercent = (currentMarginDollars / currentASP) * 100;
    
    let recommendedASP = currentASP;
    let strategyLabel = 'Current ASP:';
    
    if (strategy === 'protect-dollars') {
        // Keep same margin dollars: New ASP = New COGS + Current Margin $
        recommendedASP = newCOGS + currentMarginDollars;
        strategyLabel = 'Price to Keep Same Profit $:';
    } else if (strategy === 'protect-percent') {
        // Keep same margin percent: New ASP = New COGS / (1 - Margin %)
        recommendedASP = newCOGS / (1 - (currentMarginPercent / 100));
        strategyLabel = 'Price to Keep Same Profit %:';
    } else if (strategy === 'absorb') {
        // Keep current ASP, absorb the cost increase
        recommendedASP = currentASP;
        strategyLabel = 'Current Price (Absorb Cost):';
    }
    
    // Calculate new margins
    const newMarginDollars = recommendedASP - newCOGS;
    const newMarginPercent = (newMarginDollars / recommendedASP) * 100;
    const priceIncrease = recommendedASP - currentASP;
    const priceIncreasePercent = (priceIncrease / currentASP) * 100;
    
    // Update display
    const currentAspElement = document.getElementById('current-asp');
    const currentMarginDollarsElement = document.getElementById('current-margin-dollars');
    const currentMarginPercentElement = document.getElementById('current-margin-percent');
    const strategyLabelElement = document.getElementById('strategy-label');
    const recommendedAspElement = document.getElementById('recommended-asp');
    const newMarginDollarsElement = document.getElementById('new-margin-dollars');
    const newMarginPercentElement = document.getElementById('new-margin-percent');
    const priceIncreaseElement = document.getElementById('price-increase');
    
    if (currentAspElement) currentAspElement.textContent = '$' + currentASP.toFixed(2);
    if (currentMarginDollarsElement) currentMarginDollarsElement.textContent = '$' + currentMarginDollars.toFixed(2);
    if (currentMarginPercentElement) currentMarginPercentElement.textContent = currentMarginPercent.toFixed(1) + '%';
    if (strategyLabelElement) strategyLabelElement.textContent = strategyLabel;
    if (recommendedAspElement) recommendedAspElement.textContent = '$' + recommendedASP.toFixed(2);
    if (newMarginDollarsElement) newMarginDollarsElement.textContent = '$' + newMarginDollars.toFixed(2);
    if (newMarginPercentElement) newMarginPercentElement.textContent = newMarginPercent.toFixed(1) + '%';
    if (priceIncreaseElement) priceIncreaseElement.textContent = (priceIncrease >= 0 ? '+$' : '-$') + Math.abs(priceIncrease).toFixed(2) + ' (' + (priceIncreasePercent >= 0 ? '+' : '') + priceIncreasePercent.toFixed(1) + '%)';
    
    // Update button states
    document.querySelectorAll('.strategy-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    if (strategy === 'protect-dollars') {
        const btn = document.getElementById('protect-margin-dollars');
        if (btn) btn.classList.add('active');
    } else if (strategy === 'protect-percent') {
        const btn = document.getElementById('protect-margin-percent');
        if (btn) btn.classList.add('active');
    } else if (strategy === 'absorb') {
        const btn = document.getElementById('absorb-increase');
        if (btn) btn.classList.add('active');
    }
    
    // Show pricing results
    const costIncrease = newCOGS - chinaTotalCost;
    const pricingResultsElement = document.getElementById('pricing-results');
    const costImpactSummaryElement = document.getElementById('cost-impact-summary');
    
    if (pricingResultsElement) pricingResultsElement.style.display = 'block';
    if (costImpactSummaryElement) costImpactSummaryElement.style.display = 'block';
    
    // Update cost impact summary
    const costIncreasePercent = (costIncrease / chinaTotalCost) * 100;
    const costIncreaseAmountElement = document.getElementById('cost-increase-amount');
    const costIncreasePercentElement = document.getElementById('cost-increase-percent');
    
    if (costIncreaseAmountElement) costIncreaseAmountElement.textContent = (costIncrease >= 0 ? '+$' : '-$') + Math.abs(costIncrease).toFixed(2);
    if (costIncreasePercentElement) costIncreasePercentElement.textContent = (costIncreasePercent >= 0 ? '+' : '') + costIncreasePercent.toFixed(1) + '%';
}

function showDetailedMath() {
    if (!currentProduct || !selectedCountryA || !selectedCountryB || !countryACost || !countryBCost) {
        return;
    }
    
    const baseCogs = currentProduct.cogs;
    
    // Build math explanation for both countries
    let mathHtml = '<div class="math-step-by-step">';
    
    mathHtml += '<div class="math-step">';
    mathHtml += '<div class="step-title">📊 Step 1: Base COGS (China Baseline)</div>';
    mathHtml += '<div class="step-calc">Base COGS = $' + baseCogs.toFixed(2) + '</div>';
    mathHtml += '</div>';
    
    // Country A calculation
    mathHtml += '<div class="math-step">';
    mathHtml += '<div class="step-title">🏭 ' + countryNames[selectedCountryA] + ' Calculation</div>';
    
    const premiumA = premiums[selectedCountryA] || 0;
    const tariffRateA = tariffs[selectedCountryA][selectedCategory] || 0;
    
    if (premiumA > 0) {
        const premiumCostA = countryACost.manufacturingCost - baseCogs;
        mathHtml += '<div class="step-calc">Premium = ' + (premiumA * 100).toFixed(1) + '% of Base COGS</div>';
        mathHtml += '<div class="step-calc">Premium Cost = $' + baseCogs.toFixed(2) + ' × ' + (premiumA * 100).toFixed(1) + '% = $' + premiumCostA.toFixed(2) + '</div>';
        mathHtml += '<div class="step-calc">Adjusted COGS = $' + baseCogs.toFixed(2) + ' + $' + premiumCostA.toFixed(2) + ' = $' + countryACost.manufacturingCost.toFixed(2) + '</div>';
    } else {
        mathHtml += '<div class="step-calc">No premium (China baseline) = $0.00</div>';
        mathHtml += '<div class="step-calc">Adjusted COGS = $' + baseCogs.toFixed(2) + '</div>';
    }
    
    mathHtml += '<div class="step-calc">Tariff Rate = ' + (tariffRateA * 100).toFixed(1) + '%</div>';
    mathHtml += '<div class="step-calc">Tariff Cost = $' + countryACost.manufacturingCost.toFixed(2) + ' × ' + (tariffRateA * 100).toFixed(1) + '% = $' + countryACost.tariffCost.toFixed(2) + '</div>';
    mathHtml += '<div class="step-calc">Total = $' + countryACost.manufacturingCost.toFixed(2) + ' + $' + countryACost.tariffCost.toFixed(2) + ' = $' + countryACost.totalCost.toFixed(2) + '</div>';
    mathHtml += '</div>';
    
    // Country B calculation
    mathHtml += '<div class="math-step">';
    mathHtml += '<div class="step-title">🏭 ' + countryNames[selectedCountryB] + ' Calculation</div>';
    
    const premiumB = premiums[selectedCountryB] || 0;
    const tariffRateB = tariffs[selectedCountryB][selectedCategory] || 0;
    
    if (premiumB > 0) {
        const premiumCostB = countryBCost.manufacturingCost - baseCogs;
        mathHtml += '<div class="step-calc">Premium = ' + (premiumB * 100).toFixed(1) + '% of Base COGS</div>';
        mathHtml += '<div class="step-calc">Premium Cost = $' + baseCogs.toFixed(2) + ' × ' + (premiumB * 100).toFixed(1) + '% = $' + premiumCostB.toFixed(2) + '</div>';
        mathHtml += '<div class="step-calc">Adjusted COGS = $' + baseCogs.toFixed(2) + ' + $' + premiumCostB.toFixed(2) + ' = $' + countryBCost.manufacturingCost.toFixed(2) + '</div>';
    } else {
        mathHtml += '<div class="step-calc">No premium (China baseline) = $0.00</div>';
        mathHtml += '<div class="step-calc">Adjusted COGS = $' + baseCogs.toFixed(2) + '</div>';
    }
    
    mathHtml += '<div class="step-calc">Tariff Rate = ' + (tariffRateB * 100).toFixed(1) + '%</div>';
    mathHtml += '<div class="step-calc">Tariff Cost = $' + countryBCost.manufacturingCost.toFixed(2) + ' × ' + (tariffRateB * 100).toFixed(1) + '% = $' + countryBCost.tariffCost.toFixed(2) + '</div>';
    mathHtml += '<div class="step-calc">Total = $' + countryBCost.manufacturingCost.toFixed(2) + ' + $' + countryBCost.tariffCost.toFixed(2) + ' = $' + countryBCost.totalCost.toFixed(2) + '</div>';
    mathHtml += '</div>';
    
    // Add comparison between countries
    const costDifference = countryBCost.totalCost - countryACost.totalCost;
    mathHtml += '<div class="math-step comparison-step">';
    mathHtml += '<div class="step-title">📈 Country Comparison</div>';
    mathHtml += '<div class="step-calc">' + countryNames[selectedCountryA] + ' Total = $' + countryACost.totalCost.toFixed(2) + '</div>';
    mathHtml += '<div class="step-calc">' + countryNames[selectedCountryB] + ' Total = $' + countryBCost.totalCost.toFixed(2) + '</div>';
    mathHtml += '<div class="step-calc">Difference = $' + countryBCost.totalCost.toFixed(2) + ' - $' + countryACost.totalCost.toFixed(2) + ' = ' + (costDifference >= 0 ? '+$' : '-$') + Math.abs(costDifference).toFixed(2) + '</div>';
    
    if (costDifference > 0) {
        mathHtml += '<div class="step-calc">' + countryNames[selectedCountryB] + ' is $' + Math.abs(costDifference).toFixed(2) + ' MORE expensive than ' + countryNames[selectedCountryA] + '</div>';
    } else if (costDifference < 0) {
        mathHtml += '<div class="step-calc">' + countryNames[selectedCountryB] + ' is $' + Math.abs(costDifference).toFixed(2) + ' LESS expensive than ' + countryNames[selectedCountryA] + '</div>';
    } else {
        mathHtml += '<div class="step-calc">Both countries have the same total cost</div>';
    }
    mathHtml += '</div>';
    
    mathHtml += '</div>';
    
    // Update display
    document.getElementById('math-steps').innerHTML = mathHtml;
    document.getElementById('math-breakdown').style.display = 'block';
    
    // Update button states
    document.querySelectorAll('.strategy-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    const showMathBtn = document.getElementById('show-math');
    if (showMathBtn) {
        showMathBtn.classList.add('active');
    }
    
}

function addSimpleRecommendation(totalCost, baseCogs, country) {
    const costIncrease = totalCost - (baseCogs * (1 + tariffs.china[currentProduct.category]));
    const increasePercent = (costIncrease / (baseCogs * (1 + tariffs.china[currentProduct.category]))) * 100;
    
    let recommendation = '';
    let recommendationClass = '';
    
    if (country === 'china') {
        recommendation = '🎯 China is your current baseline for comparison';
        recommendationClass = 'neutral';
    } else if (costIncrease < 0) {
        recommendation = `✅ Great choice! ${country.charAt(0).toUpperCase() + country.slice(1)} costs $${Math.abs(costIncrease).toFixed(2)} LESS than China`;
        recommendationClass = 'positive';
    } else if (increasePercent < 10) {
        recommendation = `👍 Good option: ${country.charAt(0).toUpperCase() + country.slice(1)} costs only ${increasePercent.toFixed(1)}% more than China`;
        recommendationClass = 'positive';
    } else if (increasePercent < 25) {
        recommendation = `⚠️ Moderate impact: ${country.charAt(0).toUpperCase() + country.slice(1)} costs ${increasePercent.toFixed(1)}% more than China`;
        recommendationClass = 'warning';
    } else {
        recommendation = `❌ Expensive option: ${country.charAt(0).toUpperCase() + country.slice(1)} costs ${increasePercent.toFixed(1)}% more than China`;
        recommendationClass = 'negative';
    }
    
    // Update or create recommendation element
    let recElement = document.getElementById('simple-recommendation');
    if (!recElement) {
        recElement = document.createElement('div');
        recElement.id = 'simple-recommendation';
        recElement.className = 'simple-recommendation';
        
        const resultsDiv = document.getElementById('results-simple');
        const firstChild = resultsDiv.querySelector('.impact-summary');
        resultsDiv.insertBefore(recElement, firstChild);
    }
    
    recElement.textContent = recommendation;
    recElement.className = `simple-recommendation ${recommendationClass}`;
}

function showChinaMessage() {
    // Add message explaining why pricing options aren't available for China
    let messageElement = document.getElementById('china-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'china-message';
        messageElement.className = 'china-message';
        
        const strategySection = document.getElementById('pricing-strategy');
        const buttonsDiv = strategySection.querySelector('.strategy-buttons');
        strategySection.insertBefore(messageElement, buttonsDiv.nextSibling);
    }
    
    messageElement.innerHTML = `
        <p>💡 <strong>China is your baseline.</strong> Select another country above to see pricing strategies for cost differences.</p>
    `;
    messageElement.style.display = 'block';
}

function hideChinaMessage() {
    const messageElement = document.getElementById('china-message');
    if (messageElement) {
        messageElement.style.display = 'none';
    }
}

async function performAIAnalysis(analysisType) {
    if (!currentProduct || !currentCountry) {
        alert('Please select a product and country first');
        return;
    }
    
    const button = document.getElementById(`analyze-${analysisType}`);
    const resultsDiv = document.getElementById('analysis-results');
    const contentDiv = document.getElementById('analysis-content');
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;
    button.textContent = 'Analyzing...';
    
    try {
        let query = '';
        let title = '';
        
        switch (analysisType) {
            case 'trends':
                query = `Current US tariff trends for ${currentProduct.category} imports from ${analysisCountry} China Vietnam Thailand Cambodia. Latest trade policy changes July 2025`;
                title = '📈 Current Tariff Trends';
                break;
            case 'country':
                query = `${analysisCountry} manufacturing risk assessment trade policy stability supply chain ${currentProduct.category} audio equipment 2025`;
                title = `🏭 ${analysisCountry.charAt(0).toUpperCase() + analysisCountry.slice(1)} Risk Assessment`;
                break;
            case 'forecast':
                query = `US tariff forecast next 6 months ${analysisCountry} ${currentProduct.category} audio equipment trade policy predictions 2025`;
                title = '🔮 6-Month Forecast';
                break;
        }
        
        // Simulate AI analysis with realistic delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate realistic analysis based on current data
        const analysis = generateAIAnalysis(analysisType, analysisCountry, currentProduct);
        
        // Display results
        contentDiv.innerHTML = `
            <h5>${title}</h5>
            ${analysis}
        `;
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Analysis error:', error);
        contentDiv.innerHTML = `
            <div style="color: #e74c3c; text-align: center; padding: 20px;">
                <strong>⚠️ Analysis temporarily unavailable</strong><br>
                Please try again later or contact support.
            </div>
        `;
        resultsDiv.style.display = 'block';
    } finally {
        // Reset button state
        button.classList.remove('loading');
        button.disabled = false;
        
        switch (analysisType) {
            case 'trends':
                button.textContent = 'Analyze Current Trends';
                break;
            case 'country':
                button.textContent = 'Country Risk Assessment';
                break;
            case 'forecast':
                button.textContent = '6-Month Forecast';
                break;
        }
    }
}

function generateAIAnalysis(type, country, product) {
    const countryName = country.charAt(0).toUpperCase() + country.slice(1);
    const tariffRate = tariffs[country][product.category] * 100;
    const premium = premiums[country] * 100;
    
    switch (type) {
        case 'trends':
            return `
                <p><strong>🚨 BREAKING: July 9, 2025 Updates</strong></p>
                <ul>
                    <li>Trump announced <span class="highlight">new reciprocal tariffs</span> via letters to world leaders</li>
                    <li>Japan and South Korea now face <span class="highlight">25% tariffs</span> (effective August 1)</li>
                    <li>Malaysia and other countries hit with <span class="highlight">up to 40% tariffs</span></li>
                    <li>Deadline extended from July 9 to <span class="highlight">August 1, 2025</span> for negotiations</li>
                </ul>
                <p><strong>Key Trends:</strong></p>
                <ul>
                    <li>${countryName} now faces <span class="highlight">${tariffRate}% tariffs</span> under the new framework</li>
                    <li>Vietnam remains the <span class="highlight">best alternative</span> at only 20% tariff rate</li>
                    <li>Auto stocks dropped sharply: Nissan -7%, Toyota/Honda -4%</li>
                    <li>Manufacturing premiums: ${countryName} shows ${premium}% premium vs China</li>
                </ul>
                <p><strong>Strategic Implications:</strong></p>
                <ul>
                    <li>Immediate diversification needed from high-tariff countries</li>
                    <li>Companies rushing to finalize deals before August 1 deadline</li>
                    <li>Vietnam and Indonesia becoming primary China alternatives</li>
                </ul>
            `;
            
        case 'country':
            const riskLevel = tariffRate > 35 ? 'High' : tariffRate > 25 ? 'Medium' : 'Low';
            const riskColor = tariffRate > 35 ? '#e74c3c' : tariffRate > 25 ? '#f39c12' : '#27ae60';
            
            return `
                <p><strong>Risk Level:</strong> <span style="color: ${riskColor}; font-weight: bold;">${riskLevel}</span></p>
                
                <h5>Political Stability</h5>
                <ul>
                    <li>${countryName === 'Vietnam' ? 'Stable government with strong US trade relations' : 'Moderate political stability with some trade uncertainties'}</li>
                    <li>Current tariff rate: <span class="highlight">${tariffRate}%</span></li>
                </ul>
                
                <h5>Supply Chain Factors</h5>
                <ul>
                    <li>Manufacturing cost premium: <span class="highlight">+${premium}%</span> vs China</li>
                    <li>${countryName === 'Vietnam' ? 'Well-established electronics manufacturing base' : 'Developing manufacturing infrastructure'}</li>
                    <li>${premium < 15 ? 'Competitive labor costs' : 'Higher labor costs offset by trade advantages'}</li>
                </ul>
                
                <h5>Recommendations</h5>
                <ul>
                    <li>${riskLevel === 'Low' ? 'Excellent choice for diversification strategy' : riskLevel === 'Medium' ? 'Suitable for medium-term planning with monitoring' : 'Consider only for specific strategic needs'}</li>
                    <li>${tariffRate < 25 ? 'Cost-effective alternative to China' : 'Premium option requiring pricing adjustments'}</li>
                </ul>
            `;
            
        case 'forecast':
            return `
                <p><strong>6-Month Outlook (July - December 2025):</strong></p>
                
                <h5>Probability Scenarios</h5>
                <ul>
                    <li><strong>Most Likely (60%):</strong> Current rates remain stable through Q4 2025</li>
                    <li><strong>Optimistic (25%):</strong> Bilateral negotiations reduce rates by 5-10%</li>
                    <li><strong>Pessimistic (15%):</strong> Additional 10-15% increases due to trade tensions</li>
                </ul>
                
                <h5>Key Events to Watch</h5>
                <ul>
                    <li>August 2025: Trade negotiation outcomes</li>
                    <li>September 2025: Congressional trade policy reviews</li>
                    <li>Q4 2025: Election cycle impacts on trade policy</li>
                </ul>
                
                <h5>Strategic Recommendations</h5>
                <ul>
                    <li><strong>Short-term:</strong> Lock in current rates with 90-day contracts</li>
                    <li><strong>Medium-term:</strong> ${tariffRate < 25 ? 'Increase sourcing from ' + countryName : 'Monitor for rate improvements before major commitments'}</li>
                    <li><strong>Hedging:</strong> Maintain 2-3 country portfolio to manage risk</li>
                </ul>
            `;
    }
}

// Portfolio Management
let portfolio = [];

function addToPortfolio() {
    if (!currentProduct || !selectedCountryA || !selectedCountryB) {
        alert('Please select a product and two countries first');
        return;
    }
    
    // Use the more expensive country for portfolio analysis
    const portfolioCountry = countryACost.totalCost >= countryBCost.totalCost ? selectedCountryA : selectedCountryB;
    const portfolioCost = countryACost.totalCost >= countryBCost.totalCost ? countryACost.totalCost : countryBCost.totalCost;
    
    const item = {
        id: Date.now(),
        product: currentProduct,
        productName: Object.keys(products).find(key => products[key] === currentProduct),
        country: portfolioCountry,
        totalCost: portfolioCost,
        timestamp: new Date().toLocaleString()
    };
    
    portfolio.push(item);
    updatePortfolioDisplay();
    
    // Show success message
    const btn = document.getElementById('add-to-portfolio');
    const originalText = btn.textContent;
    btn.textContent = '✅ Added!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

function clearPortfolio() {
    portfolio = [];
    updatePortfolioDisplay();
}

function updatePortfolioDisplay() {
    const portfolioList = document.getElementById('portfolio-list');
    const portfolioItems = document.getElementById('portfolio-items');
    
    if (portfolio.length === 0) {
        portfolioList.style.display = 'none';
        return;
    }
    
    portfolioList.style.display = 'block';
    
    portfolioItems.innerHTML = portfolio.map(item => `
        <div class="portfolio-item">
            <span>${item.productName} (${item.country.charAt(0).toUpperCase() + item.country.slice(1)}) - $${item.totalCost.toFixed(2)}</span>
            <button class="portfolio-item-remove" onclick="removeFromPortfolio(${item.id})">Remove</button>
        </div>
    `).join('');
}

function removeFromPortfolio(id) {
    portfolio = portfolio.filter(item => item.id !== id);
    updatePortfolioDisplay();
}

function analyzePortfolio() {
    if (portfolio.length === 0) {
        alert('Add some products to your portfolio first');
        return;
    }
    
    const resultsDiv = document.getElementById('portfolio-results');
    const summaryDiv = document.getElementById('portfolio-summary');
    
    // Calculate portfolio metrics
    const totalItems = portfolio.length;
    const totalValue = portfolio.reduce((sum, item) => sum + item.totalCost, 0);
    const avgCost = totalValue / totalItems;
    
    // Country distribution
    const countryDistribution = {};
    portfolio.forEach(item => {
        countryDistribution[item.country] = (countryDistribution[item.country] || 0) + 1;
    });
    
    // Best/worst performing items
    const sortedByCost = [...portfolio].sort((a, b) => a.totalCost - b.totalCost);
    const bestItem = sortedByCost[0];
    const worstItem = sortedByCost[sortedByCost.length - 1];
    
    summaryDiv.innerHTML = `
        <h5>📊 Portfolio Analysis Summary</h5>
        <div class="portfolio-metrics">
            <div class="metric-card">
                <div class="metric-value">${totalItems}</div>
                <div class="metric-label">Products Analyzed</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">$${totalValue.toFixed(2)}</div>
                <div class="metric-label">Total Portfolio Value</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">$${avgCost.toFixed(2)}</div>
                <div class="metric-label">Average Cost per Item</div>
            </div>
        </div>
        
        <h6>Country Distribution:</h6>
        <div class="country-distribution">
            ${Object.entries(countryDistribution).map(([country, count]) => 
                `<span class="country-tag">${country.charAt(0).toUpperCase() + country.slice(1)}: ${count} items</span>`
            ).join('')}
        </div>
        
        <h6>Best vs Worst Performers:</h6>
        <div class="performance-comparison">
            <div class="best-performer">
                <strong>🏆 Best:</strong> ${bestItem.productName} (${bestItem.country}) - $${bestItem.totalCost.toFixed(2)}
            </div>
            <div class="worst-performer">
                <strong>📉 Highest Cost:</strong> ${worstItem.productName} (${worstItem.country}) - $${worstItem.totalCost.toFixed(2)}
            </div>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
}

// Smart Sourcing Wizard
function getSmartRecommendations() {
    if (!currentProduct) {
        alert('Please select a product first');
        return;
    }
    
    const priority = document.getElementById('priority-selector').value;
    const volume = parseInt(document.getElementById('annual-volume').value) || 10000;
    const resultsDiv = document.getElementById('wizard-results');
    
    const recommendations = generateRecommendations(priority, volume, currentProduct);
    
    resultsDiv.innerHTML = `
        <h5>🎯 Smart Recommendations for ${currentProduct.category}</h5>
        <p><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)} | <strong>Volume:</strong> ${volume.toLocaleString()} units/year</p>
        ${recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-details">${rec.details}</div>
            </div>
        `).join('')}
    `;
    
    resultsDiv.style.display = 'block';
}

function generateRecommendations(priority, volume, product) {
    const countries = ['vietnam', 'malaysia', 'thailand', 'indonesia'];
    const baseCogs = product.cogs;
    
    // Calculate costs for all countries
    const options = countries.map(country => {
        const premium = premiums[country] || 0;
        const adjustedCogs = baseCogs * (1 + premium);
        const tariffRate = tariffs[country][product.category] || 0;
        const tariffCost = adjustedCogs * tariffRate;
        const totalCost = adjustedCogs + tariffCost;
        
        return {
            country,
            totalCost,
            tariffRate: tariffRate * 100,
            premium: premium * 100,
            riskScore: getRiskScore(country),
            qualityScore: getQualityScore(country),
            speedScore: getSpeedScore(country),
            stabilityScore: getStabilityScore(country)
        };
    });
    
    let recommendations = [];
    
    switch (priority) {
        case 'cost':
            const cheapest = options.sort((a, b) => a.totalCost - b.totalCost).slice(0, 3);
            recommendations = cheapest.map((opt, i) => ({
                title: `${i + 1}. ${opt.country.charAt(0).toUpperCase() + opt.country.slice(1)} - $${opt.totalCost.toFixed(2)}`,
                details: `Lowest cost option with ${opt.tariffRate}% tariff. Annual savings vs China: $${((calculateChinaCost(product) - opt.totalCost) * volume).toLocaleString()}`
            }));
            break;
            
        case 'risk':
            const safest = options.sort((a, b) => a.riskScore - b.riskScore).slice(0, 3);
            recommendations = safest.map((opt, i) => ({
                title: `${i + 1}. ${opt.country.charAt(0).toUpperCase() + opt.country.slice(1)} - Low Risk`,
                details: `Political stability score: ${opt.riskScore}/10. Tariff: ${opt.tariffRate}%, Cost: $${opt.totalCost.toFixed(2)}`
            }));
            break;
            
        case 'quality':
            const highest_quality = options.sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 3);
            recommendations = highest_quality.map((opt, i) => ({
                title: `${i + 1}. ${opt.country.charAt(0).toUpperCase() + opt.country.slice(1)} - High Quality`,
                details: `Manufacturing quality score: ${opt.qualityScore}/10. Cost: $${opt.totalCost.toFixed(2)}, Tariff: ${opt.tariffRate}%`
            }));
            break;
            
        case 'speed':
            const fastest = options.sort((a, b) => b.speedScore - a.speedScore).slice(0, 3);
            recommendations = fastest.map((opt, i) => ({
                title: `${i + 1}. ${opt.country.charAt(0).toUpperCase() + opt.country.slice(1)} - Fast Delivery`,
                details: `Delivery speed score: ${opt.speedScore}/10. Typical lead time: ${getLeadTime(opt.country)} days`
            }));
            break;
            
        case 'stability':
            const most_stable = options.sort((a, b) => b.stabilityScore - a.stabilityScore).slice(0, 3);
            recommendations = most_stable.map((opt, i) => ({
                title: `${i + 1}. ${opt.country.charAt(0).toUpperCase() + opt.country.slice(1)} - Rate Stability`,
                details: `Tariff stability score: ${opt.stabilityScore}/10. Current rate: ${opt.tariffRate}%, Cost: $${opt.totalCost.toFixed(2)}`
            }));
            break;
    }
    
    return recommendations;
}

function calculateChinaCost(product) {
    const baseCogs = product.cogs;
    const tariffRate = tariffs.china[product.category];
    const tariffCost = baseCogs * tariffRate;
    return baseCogs + tariffCost;
}

function getRiskScore(country) {
    const scores = {
        vietnam: 8, malaysia: 7, 
        thailand: 6, indonesia: 6, cambodia: 4
    };
    return scores[country] || 5;
}

function getQualityScore(country) {
    const scores = {
        vietnam: 7, malaysia: 7,
        thailand: 6, indonesia: 6, cambodia: 4
    };
    return scores[country] || 5;
}

function getSpeedScore(country) {
    const scores = {
        vietnam: 8, malaysia: 7, thailand: 7, indonesia: 6,
        cambodia: 5
    };
    return scores[country] || 5;
}

function getStabilityScore(country) {
    const scores = {
        vietnam: 8, malaysia: 7,
        thailand: 5, indonesia: 6, cambodia: 3
    };
    return scores[country] || 5;
}

function getLeadTime(country) {
    const leadTimes = {
        vietnam: '14-21', malaysia: '16-23', thailand: '18-25', 
        indonesia: '20-28', 
        cambodia: '25-35'
    };
    return leadTimes[country] || '20-30';
}

// Export Functionality
function exportReport() {
    if (portfolio.length === 0 && !currentProduct) {
        alert('Please add products to your portfolio or select a product to export');
        return;
    }
    
    const reportData = generateReportData();
    const csvContent = generateCSV(reportData);
    downloadFile(csvContent, 'tariff-analysis-report.csv', 'text/csv');
    
    // Also generate a summary report
    const summaryReport = generateSummaryReport(reportData);
    downloadFile(summaryReport, 'tariff-summary-report.txt', 'text/plain');
}

function generateReportData() {
    const timestamp = new Date().toLocaleString();
    const data = {
        timestamp,
        currentProduct: currentProduct ? {
            name: Object.keys(products).find(key => products[key] === currentProduct),
            countryA: selectedCountryA,
            countryB: selectedCountryB,
            costA: countryACost ? countryACost.totalCost : 0,
            costB: countryBCost ? countryBCost.totalCost : 0,
            category: currentProduct.category,
            cogs: currentProduct.cogs,
            asp: currentProduct.asp
        } : null,
        portfolio: portfolio,
        tariffRates: tariffs,
        manufacturingPremiums: premiums
    };
    
    return data;
}

function generateCSV(data) {
    let csv = 'Tariff Analysis Report\n';
    csv += `Generated: ${data.timestamp}\n\n`;
    
    // Current product section
    if (data.currentProduct) {
        csv += 'CURRENT ANALYSIS\n';
        csv += 'Product,Country,Category,Base COGS,Total Cost,ASP\n';
        csv += `${data.currentProduct.name},${data.currentProduct.country},${data.currentProduct.category},$${data.currentProduct.cogs},$${data.currentProduct.cost.toFixed(2)},$${data.currentProduct.asp}\n\n`;
    }
    
    // Portfolio section
    if (data.portfolio.length > 0) {
        csv += 'PORTFOLIO ANALYSIS\n';
        csv += 'Product,Country,Category,Total Cost,Timestamp\n';
        data.portfolio.forEach(item => {
            csv += `${item.productName},${item.country},${item.product.category},$${item.totalCost.toFixed(2)},${item.timestamp}\n`;
        });
        csv += '\n';
    }
    
    // Tariff rates section
    csv += 'CURRENT TARIFF RATES\n';
    csv += 'Country,Speakers,Electronics/iPort,Amplifiers\n';
    Object.entries(data.tariffRates).forEach(([country, rates]) => {
        csv += `${country.charAt(0).toUpperCase() + country.slice(1)},${(rates.speakers * 100).toFixed(1)}%,${(rates.iport * 100).toFixed(1)}%,${(rates.amplifiers * 100).toFixed(1)}%\n`;
    });
    
    return csv;
}

function generateSummaryReport(data) {
    let report = '🎵 AUDIO EQUIPMENT TARIFF ANALYSIS REPORT\n';
    report += '=' .repeat(50) + '\n';
    report += `Generated: ${data.timestamp}\n\n`;
    
    if (data.currentProduct) {
        report += '📊 CURRENT PRODUCT ANALYSIS\n';
        report += '-'.repeat(30) + '\n';
        report += `Product: ${data.currentProduct.name}\n`;
        report += `Country: ${data.currentProduct.country.charAt(0).toUpperCase() + data.currentProduct.country.slice(1)}\n`;
        report += `Category: ${data.currentProduct.category}\n`;
        report += `Base COGS: $${data.currentProduct.cogs.toFixed(2)}\n`;
        report += `Total Cost (incl. tariffs): $${data.currentProduct.cost.toFixed(2)}\n`;
        report += `Current ASP: $${data.currentProduct.asp.toFixed(2)}\n`;
        
        const margin = data.currentProduct.asp - data.currentProduct.cost;
        const marginPercent = (margin / data.currentProduct.asp) * 100;
        report += `Profit Margin: $${margin.toFixed(2)} (${marginPercent.toFixed(1)}%)\n\n`;
    }
    
    if (data.portfolio.length > 0) {
        report += '📈 PORTFOLIO SUMMARY\n';
        report += '-'.repeat(30) + '\n';
        report += `Total Products Analyzed: ${data.portfolio.length}\n`;
        
        const totalValue = data.portfolio.reduce((sum, item) => sum + item.totalCost, 0);
        const avgCost = totalValue / data.portfolio.length;
        report += `Total Portfolio Value: $${totalValue.toFixed(2)}\n`;
        report += `Average Cost per Item: $${avgCost.toFixed(2)}\n\n`;
        
        // Country distribution
        const countryDist = {};
        data.portfolio.forEach(item => {
            countryDist[item.country] = (countryDist[item.country] || 0) + 1;
        });
        
        report += 'COUNTRY DISTRIBUTION:\n';
        Object.entries(countryDist).forEach(([country, count]) => {
            const percentage = ((count / data.portfolio.length) * 100).toFixed(1);
            report += `• ${country.charAt(0).toUpperCase() + country.slice(1)}: ${count} products (${percentage}%)\n`;
        });
        report += '\n';
    }
    
    report += '💰 CURRENT TARIFF RATES (July 2025)\n';
    report += '-'.repeat(30) + '\n';
    report += 'Country           Speakers  Electronics  Amplifiers\n';
    Object.entries(data.tariffRates).forEach(([country, rates]) => {
        const countryName = (country.charAt(0).toUpperCase() + country.slice(1)).padEnd(17);
        const speakers = `${(rates.speakers * 100).toFixed(1)}%`.padEnd(9);
        const electronics = `${(rates.iport * 100).toFixed(1)}%`.padEnd(12);
        const amplifiers = `${(rates.amplifiers * 100).toFixed(1)}%`;
        report += `${countryName}${speakers}${electronics}${amplifiers}\n`;
    });
    
    report += '\n🎯 KEY INSIGHTS:\n';
    report += '• Vietnam remains the most cost-effective alternative to China\n';
    report += '• Japan and Korea offer quality advantages at 25% tariff rates\n';
    report += '• Malaysia is competitive at 24% for most products\n';
    report += '• China electronics face 55% tariffs vs 37.5% for speakers\n';
    report += '\n📞 For questions about this analysis, contact your trade compliance team.\n';
    
    return report;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}