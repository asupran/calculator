// Tariff Calculator JavaScript

// Real Product Data from Your Portfolio
const productData = {
    'VX62R': {
        sku: '96012',
        category: 'speakers',
        hts: '8518.22.0000',
        cogs: 61.12,
        asp: 212.49,
        msrp: 550,
        unit: 'pair',
        tariffRate: 0.30
    },
    'IS6': {
        sku: '93478',
        category: 'speakers',
        hts: '8518.22.0000',
        cogs: 153.71,
        asp: 570.44,
        msrp: 1515,
        unit: 'pair',
        tariffRate: 0.30
    },
    'PS-C63RT WHITE EA': {
        sku: '45131',
        category: 'speakers',
        hts: '8518.21.0000',
        cogs: 64.10,
        asp: 137.26,
        msrp: 235,
        unit: 'each',
        tariffRate: 0.30
    },
    'CONNECT PRO MINI CASE': {
        sku: '72329',
        category: 'iport',
        hts: '8473.30.5100',
        cogs: 52.34,
        asp: 196.16,
        msrp: 300,
        unit: 'each',
        tariffRate: 0.30
    },
    'C-PRO UTILITY CASE 11PRO M4 GN': {
        sku: '72494',
        category: 'iport',
        hts: '8473.30.5100',
        cogs: 78.47,
        asp: 215.00,
        msrp: 250,
        unit: 'each',
        tariffRate: 0.30
    },
    'CONNECT MOUNT Case iPad A16 BK': {
        sku: '72496',
        category: 'iport',
        hts: '8473.30.5100',
        cogs: 39.66,
        asp: 78.26,
        msrp: 125,
        unit: 'each',
        tariffRate: 0.30
    },
    'UA 2-125 DSP AMPLIFIER': {
        sku: '93550',
        category: 'amplifiers',
        hts: '8518.40.2000',
        cogs: 172.21,
        asp: 484.00,
        msrp: 1100,
        unit: 'each',
        tariffRate: 0.30
    },
    'DSP 8-130 MKIII': {
        sku: '93538',
        category: 'amplifiers',
        hts: '8518.40.2000',
        cogs: 632.14,
        asp: 1709.88,
        msrp: 3740,
        unit: 'each',
        tariffRate: 0.30
    }
};

// Category-level data for analysis with updated tariff rates
const categoryData = {
    'speakers': {
        hts: ['8518.22.0000', '8518.21.0000'],
        totalCogs2025: 14938000,
        totalRevenue2025: 46027000,
        countryMix: { china: 0.85, vietnam: 0.15 },
        tariffRate: 0.30  // 30% (10% reciprocal + 20% fentanyl)
    },
    'iport': {
        hts: ['8473.30.5100'],
        totalCogs2025: 6228000,
        totalRevenue2025: 15279000,
        countryMix: { china: 0.80, cambodia: 0.20 },
        tariffRate: 0.30  // 30% (10% reciprocal + 20% fentanyl)
    },
    'amplifiers': {
        hts: ['8518.40.2000'],
        totalCogs2025: 3171000,
        totalRevenue2025: 7487000,
        countryMix: { china: 0.15, thailand: 0.85 },
        tariffRate: 0.30  // 30% (10% reciprocal + 20% fentanyl)
    }
};

// Updated tariff rates from official projections (July 9, 2025)
const tariffRates = {
    china: {
        speakers: 0.30,         // 30% (10% reciprocal + 20% fentanyl)
        iport: 0.30,           // 30% (10% reciprocal + 20% fentanyl)
        amplifiers: 0.30,      // 30% (10% reciprocal + 20% fentanyl)
        electronics: 0.30,     // 30% (10% reciprocal + 20% fentanyl)
        other: 0.30            // 30% (10% reciprocal + 20% fentanyl)
    },
    thailand: {
        speakers: 0.18,         // 18% (most likely outcome)
        iport: 0.18,           // 18% (most likely outcome)
        amplifiers: 0.18,      // 18% (most likely outcome)
        electronics: 0.18,     // 18% (most likely outcome)
        other: 0.18            // 18% (most likely outcome)
    },
    vietnam: {
        speakers: 0.20,         // 20% tariff rate
        iport: 0.20,           // 20% tariff rate
        amplifiers: 0.20,      // 20% tariff rate
        electronics: 0.20,     // 20% tariff rate
        other: 0.20            // 20% tariff rate
    },
    cambodia: {
        speakers: 0.08,         // Estimated MFN rate
        iport: 0.10,           // Estimated MFN rate
        amplifiers: 0.08,      // Estimated MFN rate
        electronics: 0.08,     // Estimated MFN rate
        other: 0.08            // Estimated MFN rate
    },
    mexico: {
        speakers: 0.00,         // USMCA
        iport: 0.00,           // USMCA
        amplifiers: 0.00,      // USMCA
        electronics: 0.00,     // USMCA
        other: 0.00            // USMCA
    },
    canada: {
        speakers: 0.00,         // USMCA
        iport: 0.00,           // USMCA
        amplifiers: 0.00,      // USMCA
        electronics: 0.00,     // USMCA
        other: 0.00            // USMCA
    },
    germany: {
        speakers: 0.04,         // MFN rate
        iport: 0.06,           // MFN rate
        amplifiers: 0.04,      // MFN rate
        electronics: 0.04,     // MFN rate
        other: 0.04            // MFN rate
    },
    japan: {
        speakers: 0.04,         // MFN rate
        iport: 0.06,           // MFN rate
        amplifiers: 0.04,      // MFN rate
        electronics: 0.04,     // MFN rate
        other: 0.04            // MFN rate
    },
    other: {
        speakers: 0.08,         // General rate
        iport: 0.10,           // General rate
        amplifiers: 0.08,      // General rate
        electronics: 0.08,     // General rate
        other: 0.08            // General rate
    }
};

// Trade agreement adjustments
const tradeAgreements = {
    usmca: {
        multiplier: 0.5,        // 50% reduction for USMCA countries
        applicableCountries: ['mexico', 'canada']
    },
    mfn: {
        multiplier: 0.8,        // 20% reduction for MFN status
        applicableCountries: ['germany', 'japan']
    },
    gsp: {
        multiplier: 0.3,        // 70% reduction for GSP eligible
        applicableCountries: ['other']
    }
};

// DOM elements
const productValueInput = document.getElementById('product-value');
const productSelector = document.getElementById('product-selector');
const countryOriginSelect = document.getElementById('country-origin');
const productCategorySelect = document.getElementById('product-category');
const tradeAgreementSelect = document.getElementById('trade-agreement');
const calculateBtn = document.getElementById('calculate-btn');
const weightedCalcBtn = document.getElementById('weighted-calc-btn');
const resultsDiv = document.getElementById('results');
const portfolioAnalysisDiv = document.getElementById('portfolio-analysis');

// Result display elements
const originalValueSpan = document.getElementById('original-value');
const tariffRateSpan = document.getElementById('tariff-rate');
const tariffAmountSpan = document.getElementById('tariff-amount');
const totalCostSpan = document.getElementById('total-cost');
const tariffExplanationP = document.getElementById('tariff-explanation');

let currentProduct = null;
let selectedCountry = null;

// Allow Enter key to trigger calculation
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateTariff();
    }
});

// Real-time calculation on input change
productValueInput.addEventListener('input', debounce(calculateTariff, 500));
countryOriginSelect.addEventListener('change', calculateTariff);
productCategorySelect.addEventListener('change', calculateTariff);
tradeAgreementSelect.addEventListener('change', calculateTariff);

function calculateTariff() {
    // Get input values
    const productValue = parseFloat(productValueInput.value) || 0;
    const countryOrigin = countryOriginSelect.value;
    const productCategory = productCategorySelect.value;
    const tradeAgreement = tradeAgreementSelect.value;

    // Validate inputs
    if (productValue <= 0) {
        hideResults();
        return;
    }

    if (!countryOrigin || !productCategory) {
        hideResults();
        return;
    }

    // Calculate tariff rate
    let baseTariffRate = tariffRates[countryOrigin][productCategory] || 0;
    let finalTariffRate = baseTariffRate;

    // Apply trade agreement adjustments
    if (tradeAgreement && tradeAgreement !== 'none') {
        const agreement = tradeAgreements[tradeAgreement];
        if (agreement && agreement.applicableCountries.includes(countryOrigin)) {
            finalTariffRate = baseTariffRate * agreement.multiplier;
        }
    }

    // Calculate amounts
    const tariffAmount = productValue * finalTariffRate;
    const totalCost = productValue + tariffAmount;

    // Display results
    displayResults(productValue, finalTariffRate, tariffAmount, totalCost, countryOrigin, productCategory, tradeAgreement);
    
    // Show portfolio analysis if a specific product category is selected
    if (productCategory && categoryData[productCategory]) {
        showPortfolioAnalysis(productCategory, productValue);
    }
}

function calculateWeightedTariff() {
    const productValue = parseFloat(productValueInput.value) || 0;
    const productCategory = productCategorySelect.value;
    
    if (productValue <= 0 || !productCategory) {
        alert('Please enter a product value and select a category first.');
        return;
    }
    
    // Find HTS data for this category
    const htsMatch = Object.values(htsCodeData).find(data => data.category === productCategory);
    
    if (!htsMatch || !htsMatch.countryMix) {
        alert('No sourcing mix data available for this product category.');
        return;
    }
    
    // Calculate weighted tariff rate
    let weightedRate = 0;
    const mixDetails = [];
    
    for (const [country, percentage] of Object.entries(htsMatch.countryMix)) {
        const countryRate = tariffRates[country] && tariffRates[country][productCategory] || 0;
        const weightedContribution = countryRate * percentage;
        weightedRate += weightedContribution;
        
        mixDetails.push({
            country: country,
            percentage: percentage,
            rate: countryRate,
            contribution: weightedContribution
        });
    }
    
    // Calculate amounts
    const tariffAmount = productValue * weightedRate;
    const totalCost = productValue + tariffAmount;
    
    // Display weighted results
    displayWeightedResults(productValue, weightedRate, tariffAmount, totalCost, productCategory, mixDetails);
}

function displayResults(productValue, tariffRate, tariffAmount, totalCost, country, category, agreement) {
    // Format and display values
    originalValueSpan.textContent = formatCurrency(productValue);
    tariffRateSpan.textContent = (tariffRate * 100).toFixed(2) + '%';
    tariffAmountSpan.textContent = formatCurrency(tariffAmount);
    totalCostSpan.textContent = formatCurrency(totalCost);

    // Generate explanation
    const explanation = generateExplanation(country, category, agreement, tariffRate);
    tariffExplanationP.textContent = explanation;

    // Show results
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function displayWeightedResults(productValue, weightedRate, tariffAmount, totalCost, category, mixDetails) {
    // Format and display values
    originalValueSpan.textContent = formatCurrency(productValue);
    tariffRateSpan.textContent = (weightedRate * 100).toFixed(2) + '% (Weighted)';
    tariffAmountSpan.textContent = formatCurrency(tariffAmount);
    totalCostSpan.textContent = formatCurrency(totalCost);

    // Generate weighted explanation
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    let explanation = `Weighted tariff rate for ${categoryName}: ${(weightedRate * 100).toFixed(2)}%\n\n`;
    explanation += 'Breakdown by sourcing country:\n';
    
    mixDetails.forEach(detail => {
        const countryName = detail.country.charAt(0).toUpperCase() + detail.country.slice(1);
        explanation += `• ${countryName}: ${(detail.percentage * 100).toFixed(0)}% of sourcing × ${(detail.rate * 100).toFixed(1)}% tariff = ${(detail.contribution * 100).toFixed(2)}%\n`;
    });
    
    explanation += '\nBased on actual sourcing mix data from your product portfolio.';
    
    tariffExplanationP.textContent = explanation;
    tariffExplanationP.style.whiteSpace = 'pre-line';

    // Show results
    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function hideResults() {
    resultsDiv.style.display = 'none';
}

function generateExplanation(country, category, agreement, rate) {
    const countryName = country.charAt(0).toUpperCase() + country.slice(1);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    let explanation = `Tariff rate for ${categoryName} from ${countryName}: ${(rate * 100).toFixed(2)}%`;
    
    // Add Section 301 context for China
    if (country === 'china' && rate > 0) {
        explanation += ` (Section 301 tariff)`;
    }
    
    // Add trade agreement context
    if (agreement && agreement !== 'none') {
        const agreementNames = {
            'usmca': 'USMCA',
            'mfn': 'Most Favored Nation',
            'gsp': 'Generalized System of Preferences'
        };
        explanation += ` (adjusted for ${agreementNames[agreement]})`;
    }
    
    // Add sourcing mix information if available
    const htsMatch = Object.values(htsCodeData).find(data => data.category === category);
    if (htsMatch && htsMatch.countryMix) {
        explanation += '. Typical sourcing: ';
        const mixEntries = Object.entries(htsMatch.countryMix);
        const mixStrings = mixEntries.map(([c, pct]) => `${c}: ${(pct * 100).toFixed(0)}%`);
        explanation += mixStrings.join(', ');
    }
    
    explanation += '. Based on actual HTS codes and Section 301 tariff rates.';
    
    return explanation;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Input validation
productValueInput.addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (value < 0) {
        this.value = 0;
    }
});

function loadProductData(productName) {
    if (typeof productName === 'object') {
        // Called from select dropdown
        productName = productName.target.value;
    }
    
    if (!productName || !productData[productName]) {
        currentProduct = null;
        return;
    }
    
    currentProduct = productData[productName];
    
    // Auto-fill form fields
    productCategorySelect.value = currentProduct.category;
    
    // Set China as default country since most products have China sourcing
    const categoryInfo = categoryData[currentProduct.category];
    if (categoryInfo && categoryInfo.countryMix.china > 0) {
        countryOriginSelect.value = 'china';
    }
    
    // Update value buttons to show actual values
    updateValueButtons();
    
    // Auto-calculate if we have a value
    if (productValueInput.value) {
        calculateTariff();
    }
}

function setValueType(type) {
    if (!currentProduct) {
        alert('Please select a product first');
        return;
    }
    
    productValueInput.value = currentProduct[type].toFixed(2);
    calculateTariff();
}

function updateValueButtons() {
    if (!currentProduct) return;
    
    const buttons = document.querySelectorAll('.value-btn');
    buttons.forEach(btn => {
        const type = btn.dataset.type;
        const value = currentProduct[type];
        btn.textContent = `${type.toUpperCase()}: $${value.toFixed(2)}`;
    });
}

function showPortfolioAnalysis(category, singleProductValue) {
    const categoryInfo = categoryData[category];
    if (!categoryInfo) return;
    
    // Calculate different scenarios
    const totalCogs = categoryInfo.totalCogs2025;
    const currentMix = categoryInfo.countryMix;
    const tariffRate = categoryInfo.tariffRate;
    
    // Current weighted tariff impact
    const chinaPercentage = currentMix.china || 0;
    const currentTariffRate = chinaPercentage * tariffRate;
    const currentImpact = totalCogs * currentTariffRate;
    
    // 100% China scenario
    const chinaImpact = totalCogs * tariffRate;
    
    // No China scenario (0% tariff)
    const noChinaImpact = 0;
    
    // Annual impact based on product value
    const annualImpact = (singleProductValue / totalCogs) * categoryInfo.totalRevenue2025 * currentTariffRate;
    
    // Update display
    document.getElementById('current-impact').textContent = formatCurrency(currentImpact);
    document.getElementById('china-impact').textContent = formatCurrency(chinaImpact);
    document.getElementById('no-china-impact').textContent = formatCurrency(noChinaImpact);
    document.getElementById('annual-impact').textContent = formatCurrency(annualImpact);
    
    // Generate recommendations
    generateRecommendations(category, currentMix, tariffRate);
    
    portfolioAnalysisDiv.style.display = 'block';
}

function generateRecommendations(category, currentMix, tariffRate) {
    const recommendationsDiv = document.getElementById('recommendations');
    let recommendations = [];
    
    const chinaPercentage = currentMix.china || 0;
    
    if (chinaPercentage > 0.5) {
        recommendations.push(`🎯 High China exposure (${(chinaPercentage * 100).toFixed(0)}%) - Consider diversifying sourcing`);
    }
    
    if (tariffRate >= 0.25) {
        recommendations.push(`⚠️ High tariff rate (${(tariffRate * 100).toFixed(1)}%) - Prioritize alternative sourcing countries`);
    }
    
    // Suggest specific countries based on current mix
    const altCountries = Object.keys(currentMix).filter(c => c !== 'china');
    if (altCountries.length > 0) {
        recommendations.push(`✅ Current alternative sources: ${altCountries.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}`);
    }
    
    if (recommendations.length === 0) {
        recommendations.push('✅ Current sourcing mix looks well-diversified');
    }
    
    recommendationsDiv.innerHTML = recommendations.map(rec => `<p>${rec}</p>`).join('');
}

function loadProductDataSimple() {
    const productSelector = document.getElementById('product-selector');
    const productName = productSelector.value;
    console.log('loadProductDataSimple called with:', productName);
    
    if (!productName || !productData[productName]) {
        currentProduct = null;
        hideSimpleResults();
        return;
    }
    
    currentProduct = productData[productName];
    console.log('Product loaded:', currentProduct);
    updateCountryButtons();
    
    // If a country is already selected, calculate immediately
    if (selectedCountry) {
        calculateSimple();
    }
}

function selectCountry(country) {
    console.log('selectCountry called with:', country);
    selectedCountry = country;
    
    // Update button states
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    const selectedBtn = document.querySelector(`[data-country="${country}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // Calculate if we have a product
    if (currentProduct) {
        console.log('Calculating for product:', currentProduct);
        calculateSimple();
    } else {
        console.log('No product selected yet');
    }
}

// Manufacturing cost premiums for non-China sourcing
const manufacturingPremiums = {
    china: 0.00,        // Baseline (no premium)
    vietnam: 0.125,     // 12.5% premium
    thailand: 0.125,    // 12.5% premium  
    cambodia: 0.15,     // 15% premium
    mexico: 0.10,       // 10% premium
    canada: 0.10,       // 10% premium
    germany: 0.20,      // 20% premium
    japan: 0.15,        // 15% premium
    other: 0.15         // 15% premium
};

function calculateSimple() {
    if (!currentProduct || !selectedCountry) return;
    
    const baseCogs = currentProduct.cogs;
    const manufacturingPremium = manufacturingPremiums[selectedCountry] || 0;
    const adjustedCogs = baseCogs * (1 + manufacturingPremium);
    const tariffRate = tariffRates[selectedCountry][currentProduct.category] || 0;
    const tariffCost = adjustedCogs * tariffRate;
    const totalCost = adjustedCogs + tariffCost;
    
    // Update display
    document.getElementById('product-cost').textContent = formatCurrency(adjustedCogs);
    document.getElementById('tariff-cost').textContent = formatCurrency(tariffCost);
    document.getElementById('total-cost-simple').textContent = formatCurrency(totalCost);
    
    // Show manufacturing premium if applicable
    updateCostBreakdown(baseCogs, adjustedCogs, manufacturingPremium, tariffCost, totalCost);
    
    // Show comparison across all countries
    updateComparisonGrid();
    
    // Show results
    document.getElementById('results-simple').style.display = 'block';
}

function updateComparisonGrid() {
    if (!currentProduct) return;
    
    const countries = ['china', 'vietnam', 'thailand'];
    const baseCogs = currentProduct.cogs;
    
    countries.forEach(country => {
        const manufacturingPremium = manufacturingPremiums[country] || 0;
        const adjustedCogs = baseCogs * (1 + manufacturingPremium);
        const tariffRate = tariffRates[country][currentProduct.category] || 0;
        const tariffCost = adjustedCogs * tariffRate;
        const totalCost = adjustedCogs + tariffCost;
        document.getElementById(`${country}-cost`).textContent = formatCurrency(totalCost);
    });
}

function updateCountryButtons() {
    // Remove any existing highlights
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    selectedCountry = null;
}

function updateCostBreakdown(baseCogs, adjustedCogs, manufacturingPremium, tariffCost, totalCost) {
    // Update the cost breakdown to show manufacturing premium if applicable
    const costBreakdown = document.querySelector('.cost-breakdown');
    
    if (manufacturingPremium > 0) {
        // Show detailed breakdown with manufacturing premium
        const premiumCost = adjustedCogs - baseCogs;
        costBreakdown.innerHTML = `
            <div class="cost-row">
                <span>Base COGS (China equivalent):</span>
                <span>${formatCurrency(baseCogs)}</span>
            </div>
            <div class="cost-row manufacturing-premium">
                <span>Manufacturing Premium (+${(manufacturingPremium * 100).toFixed(1)}%):</span>
                <span>${formatCurrency(premiumCost)}</span>
            </div>
            <div class="cost-row">
                <span>Adjusted Product Cost:</span>
                <span>${formatCurrency(adjustedCogs)}</span>
            </div>
            <div class="cost-row tariff-cost">
                <span>Tariff Cost:</span>
                <span>${formatCurrency(tariffCost)}</span>
            </div>
            <div class="cost-row total-cost">
                <span>Total Cost:</span>
                <span>${formatCurrency(totalCost)}</span>
            </div>
        `;
    } else {
        // Simple breakdown for China (no premium)
        costBreakdown.innerHTML = `
            <div class="cost-row">
                <span>Product Cost:</span>
                <span>${formatCurrency(adjustedCogs)}</span>
            </div>
            <div class="cost-row tariff-cost">
                <span>Tariff Cost:</span>
                <span>${formatCurrency(tariffCost)}</span>
            </div>
            <div class="cost-row total-cost">
                <span>Total Cost:</span>
                <span>${formatCurrency(totalCost)}</span>
            </div>
        `;
    }
}

function hideSimpleResults() {
    document.getElementById('results-simple').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Re-attach event listeners after DOM is loaded
    const productSelector = document.getElementById('product-selector');
    if (productSelector) {
        productSelector.addEventListener('change', loadProductDataSimple);
    }
    
    // Re-attach country button listeners
    document.querySelectorAll('.country-btn').forEach(btn => {
        btn.addEventListener('click', () => selectCountry(btn.dataset.country));
    });
    
    console.log('Tariff calculator initialized');
});