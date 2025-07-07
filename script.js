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
        tariffRate: 0.60
    },
    'IS6': {
        sku: '93478',
        category: 'speakers',
        hts: '8518.22.0000',
        cogs: 153.71,
        asp: 570.44,
        msrp: 1515,
        unit: 'pair',
        tariffRate: 0.60
    },
    'PS-C63RT WHITE EA': {
        sku: '45131',
        category: 'speakers',
        hts: '8518.21.0000',
        cogs: 64.10,
        asp: 137.26,
        msrp: 235,
        unit: 'each',
        tariffRate: 0.60
    },
    'CONNECT PRO MINI CASE': {
        sku: '72329',
        category: 'iport',
        hts: '8473.30.5100',
        cogs: 52.34,
        asp: 196.16,
        msrp: 300,
        unit: 'each',
        tariffRate: 0.60
    },
    'C-PRO UTILITY CASE 11PRO M4 GN': {
        sku: '72494',
        category: 'iport',
        hts: '8473.30.5100',
        cogs: 78.47,
        asp: 215.00,
        msrp: 250,
        unit: 'each',
        tariffRate: 0.60
    },
    'CONNECT MOUNT Case iPad A16 BK': {
        sku: '72496',
        category: 'iport',
        hts: '8473.30.5100',
        cogs: 39.66,
        asp: 78.26,
        msrp: 125,
        unit: 'each',
        tariffRate: 0.60
    },
    'UA 2-125 DSP AMPLIFIER': {
        sku: '93550',
        category: 'amplifiers',
        hts: '8518.40.2000',
        cogs: 172.21,
        asp: 484.00,
        msrp: 1100,
        unit: 'each',
        tariffRate: 0.60
    },
    'DSP 8-130 MKIII': {
        sku: '93538',
        category: 'amplifiers',
        hts: '8518.40.2000',
        cogs: 632.14,
        asp: 1709.88,
        msrp: 3740,
        unit: 'each',
        tariffRate: 0.60
    }
};

// Category-level data for analysis with updated tariff rates
const categoryData = {
    'speakers': {
        hts: ['8518.22.0000', '8518.21.0000'],
        totalCogs2025: 14938000,
        totalRevenue2025: 46027000,
        countryMix: { china: 0.85, vietnam: 0.15 },
        tariffRate: 0.60  // Updated to 60%
    },
    'iport': {
        hts: ['8473.30.5100'],
        totalCogs2025: 6228000,
        totalRevenue2025: 15279000,
        countryMix: { china: 0.80, cambodia: 0.20 },
        tariffRate: 0.60  // Updated to 60%
    },
    'amplifiers': {
        hts: ['8518.40.2000'],
        totalCogs2025: 3171000,
        totalRevenue2025: 7487000,
        countryMix: { china: 0.15, thailand: 0.85 },
        tariffRate: 0.60  // Updated to 60%
    }
};

// Updated tariff rates with new China/Vietnam rates
const tariffRates = {
    china: {
        speakers: 0.60,         // 60% new tariff rate
        iport: 0.60,           // 60% new tariff rate  
        amplifiers: 0.60,      // 60% new tariff rate
        electronics: 0.60,     // 60% new tariff rate
        other: 0.60            // 60% new tariff rate
    },
    thailand: {
        speakers: 0.00,         // No tariff
        iport: 0.00,           // No tariff
        amplifiers: 0.00,      // No tariff
        electronics: 0.00,     // No tariff
        other: 0.00            // No tariff
    },
    vietnam: {
        speakers: 0.35,         // 35% new tariff rate
        iport: 0.35,           // 35% new tariff rate
        amplifiers: 0.35,      // 35% new tariff rate
        electronics: 0.35,     // 35% new tariff rate
        other: 0.35            // 35% new tariff rate
    },
    cambodia: {
        speakers: 0.00,         // No tariff
        iport: 0.00,           // No tariff
        amplifiers: 0.00,      // No tariff
        electronics: 0.00,     // No tariff
        other: 0.00            // No tariff
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

// Event listeners
calculateBtn.addEventListener('click', calculateTariff);
weightedCalcBtn.addEventListener('click', calculateWeightedTariff);
productSelector.addEventListener('change', loadProductData);

// Preset product buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => loadProductData(btn.dataset.product));
});

// Value type buttons (COGS, ASP, MSRP)
document.querySelectorAll('.value-btn').forEach(btn => {
    btn.addEventListener('click', () => setValueType(btn.dataset.type));
});

let currentProduct = null;

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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set default values if needed
    productValueInput.value = '';
    hideResults();
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Update value buttons initially
    updateValueButtons();
});