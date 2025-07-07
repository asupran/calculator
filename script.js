// Tariff Calculator JavaScript

// Real HTS Code and Tariff Data from Audio Equipment Industry
const htsCodeData = {
    '8518.22.0000': {
        category: 'speakers',
        description: 'Speakers',
        tariffRate: 0.075,      // 7.5% 301 tariff
        products: ['VX62R', 'IS6'],
        countryMix: { china: 0.85, vietnam: 0.15 }
    },
    '8518.21.0000': {
        category: 'speakers',
        description: 'Speakers',
        tariffRate: 0.075,      // 7.5% 301 tariff
        products: ['PS-C63RT WHITE EA'],
        countryMix: { china: 0.85, vietnam: 0.15 }
    },
    '8473.30.5100': {
        category: 'iport',
        description: 'iPort Cases',
        tariffRate: 0.25,       // 25% 301 tariff
        products: ['CONNECT PRO MINI CASE', 'C-PRO UTILITY CASE', 'CONNECT MOUNT Case'],
        countryMix: { china: 0.80, cambodia: 0.20 }
    },
    '8518.40.2000': {
        category: 'amplifiers',
        description: 'Amplifiers',
        tariffRate: 0.25,       // 25% 301 tariff
        products: ['UA 2-125 DSP AMPLIFIER', 'DSP 8-130 MKIII'],
        countryMix: { china: 0.15, thailand: 0.85 }
    }
};

// Tariff rates database based on real data
const tariffRates = {
    china: {
        speakers: 0.075,        // 7.5% 301 tariff
        iport: 0.25,           // 25% 301 tariff
        amplifiers: 0.25,      // 25% 301 tariff
        electronics: 0.075,    // Default audio electronics
        other: 0.075           // Default for other items
    },
    thailand: {
        speakers: 0.00,         // No tariff
        iport: 0.00,           // No tariff
        amplifiers: 0.00,      // No tariff
        electronics: 0.00,     // No tariff
        other: 0.00            // No tariff
    },
    vietnam: {
        speakers: 0.00,         // No tariff
        iport: 0.00,           // No tariff
        amplifiers: 0.00,      // No tariff
        electronics: 0.00,     // No tariff
        other: 0.00            // No tariff
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
const countryOriginSelect = document.getElementById('country-origin');
const productCategorySelect = document.getElementById('product-category');
const tradeAgreementSelect = document.getElementById('trade-agreement');
const calculateBtn = document.getElementById('calculate-btn');
const weightedCalcBtn = document.getElementById('weighted-calc-btn');
const resultsDiv = document.getElementById('results');

// Result display elements
const originalValueSpan = document.getElementById('original-value');
const tariffRateSpan = document.getElementById('tariff-rate');
const tariffAmountSpan = document.getElementById('tariff-amount');
const totalCostSpan = document.getElementById('total-cost');
const tariffExplanationP = document.getElementById('tariff-explanation');

// Event listeners
calculateBtn.addEventListener('click', calculateTariff);
weightedCalcBtn.addEventListener('click', calculateWeightedTariff);

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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set default values if needed
    productValueInput.value = '';
    hideResults();
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
});