// Tariff Calculator JavaScript

// Tariff rates database (simplified for demonstration)
const tariffRates = {
    china: {
        electronics: 0.25,      // 25% tariff on Chinese electronics
        textiles: 0.15,         // 15% tariff on Chinese textiles
        automotive: 0.20,       // 20% tariff on Chinese automotive parts
        machinery: 0.10,        // 10% tariff on Chinese machinery
        steel: 0.35,           // 35% tariff on Chinese steel
        solar: 0.30,           // 30% tariff on Chinese solar panels
        other: 0.08            // 8% general tariff
    },
    mexico: {
        electronics: 0.02,      // 2% under USMCA
        textiles: 0.05,         // 5% textiles
        automotive: 0.00,       // 0% under USMCA
        machinery: 0.03,        // 3% machinery
        steel: 0.10,           // 10% steel
        solar: 0.05,           // 5% solar
        other: 0.02            // 2% general
    },
    canada: {
        electronics: 0.00,      // 0% under USMCA
        textiles: 0.03,         // 3% textiles
        automotive: 0.00,       // 0% under USMCA
        machinery: 0.02,        // 2% machinery
        steel: 0.05,           // 5% steel
        solar: 0.00,           // 0% solar
        other: 0.01            // 1% general
    },
    germany: {
        electronics: 0.06,      // 6% MFN rate
        textiles: 0.08,         // 8% textiles
        automotive: 0.04,       // 4% automotive
        machinery: 0.03,        // 3% machinery
        steel: 0.12,           // 12% steel
        solar: 0.06,           // 6% solar
        other: 0.05            // 5% general MFN
    },
    japan: {
        electronics: 0.04,      // 4% MFN rate
        textiles: 0.07,         // 7% textiles
        automotive: 0.03,       // 3% automotive
        machinery: 0.02,        // 2% machinery
        steel: 0.10,           // 10% steel
        solar: 0.04,           // 4% solar
        other: 0.04            // 4% general MFN
    },
    other: {
        electronics: 0.08,      // 8% general rate
        textiles: 0.10,         // 10% textiles
        automotive: 0.06,       // 6% automotive
        machinery: 0.05,        // 5% machinery
        steel: 0.15,           // 15% steel
        solar: 0.10,           // 10% solar
        other: 0.06            // 6% general
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
const resultsDiv = document.getElementById('results');

// Result display elements
const originalValueSpan = document.getElementById('original-value');
const tariffRateSpan = document.getElementById('tariff-rate');
const tariffAmountSpan = document.getElementById('tariff-amount');
const totalCostSpan = document.getElementById('total-cost');
const tariffExplanationP = document.getElementById('tariff-explanation');

// Event listeners
calculateBtn.addEventListener('click', calculateTariff);

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

function hideResults() {
    resultsDiv.style.display = 'none';
}

function generateExplanation(country, category, agreement, rate) {
    const countryName = country.charAt(0).toUpperCase() + country.slice(1);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    let explanation = `Tariff rate for ${categoryName} from ${countryName}: ${(rate * 100).toFixed(2)}%`;
    
    if (agreement && agreement !== 'none') {
        const agreementNames = {
            'usmca': 'USMCA',
            'mfn': 'Most Favored Nation',
            'gsp': 'Generalized System of Preferences'
        };
        explanation += ` (adjusted for ${agreementNames[agreement]})`;
    }
    
    explanation += '. Rates are simplified estimates based on general trade policies.';
    
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