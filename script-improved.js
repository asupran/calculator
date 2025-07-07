// Improved Tariff Calculator - Simplified Interface
console.log('Loading improved tariff calculator...');

// Product data
const products = {
    'VX62R': { cogs: 61.12, asp: 212.49, category: 'speakers', msrp: 550 },
    'IS6': { cogs: 153.71, asp: 570.44, category: 'speakers', msrp: 1515 },
    'PS-C63RT WHITE EA': { cogs: 64.10, asp: 137.26, category: 'speakers', msrp: 235 },
    'CONNECT PRO MINI CASE': { cogs: 52.34, asp: 196.16, category: 'iport', msrp: 300 },
    'C-PRO UTILITY CASE 11PRO M4 GN': { cogs: 78.47, asp: 215.00, category: 'iport', msrp: 250 },
    'CONNECT MOUNT Case iPad A16 BK': { cogs: 39.66, asp: 78.26, category: 'iport', msrp: 125 },
    'UA 2-125 DSP AMPLIFIER': { cogs: 172.21, asp: 484.00, category: 'amplifiers', msrp: 1100 },
    'DSP 8-130 MKIII': { cogs: 632.14, asp: 1709.88, category: 'amplifiers', msrp: 3740 }
};

// Tariff rates (July 2025)
const tariffs = {
    vietnam: { speakers: 0.20, iport: 0.20, amplifiers: 0.20 },
    malaysia: { speakers: 0.24, iport: 0.24, amplifiers: 0.24 },
    japan: { speakers: 0.25, iport: 0.25, amplifiers: 0.25 },
    korea: { speakers: 0.25, iport: 0.25, amplifiers: 0.25 },
    indonesia: { speakers: 0.32, iport: 0.32, amplifiers: 0.32 },
    eu: { speakers: 0.34, iport: 0.34, amplifiers: 0.34 },
    thailand: { speakers: 0.36, iport: 0.36, amplifiers: 0.36 },
    china: { speakers: 0.375, iport: 0.55, amplifiers: 0.375 },
    cambodia: { speakers: 0.49, iport: 0.49, amplifiers: 0.49 }
};

// Manufacturing premiums
const premiums = {
    china: 0.00,
    vietnam: 0.125,
    thailand: 0.125,
    cambodia: 0.15,
    indonesia: 0.125,
    eu: 0.20,
    japan: 0.10,
    korea: 0.10,
    malaysia: 0.125
};

// Country display names and flags
const countryInfo = {
    vietnam: { name: 'Vietnam', flag: '🇻🇳' },
    malaysia: { name: 'Malaysia', flag: '🇲🇾' },
    japan: { name: 'Japan', flag: '🇯🇵' },
    korea: { name: 'South Korea', flag: '🇰🇷' },
    indonesia: { name: 'Indonesia', flag: '🇮🇩' },
    thailand: { name: 'Thailand', flag: '🇹🇭' },
    china: { name: 'China', flag: '🇨🇳' },
    cambodia: { name: 'Cambodia', flag: '🇰🇭' },
    eu: { name: 'EU', flag: '🇪🇺' }
};

// Application state
let currentStep = 1;
let selectedProduct = null;
let selectedCountry = null;
let calculationResult = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing calculator...');
    setupEventListeners();
    showStep(1);
});

// Set up all event listeners
function setupEventListeners() {
    // Product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            selectProduct(this.dataset.product);
        });
    });

    // Country cards
    document.querySelectorAll('.country-card').forEach(card => {
        card.addEventListener('click', function() {
            selectCountry(this.dataset.country);
        });
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Strategy buttons
    document.querySelectorAll('.strategy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showPricingStrategy(btn.onclick.toString().match(/'([^']+)'/)[1]);
        });
    });

    console.log('Event listeners set up successfully');
}

// Product selection
function selectProduct(productKey) {
    console.log('Selecting product:', productKey);
    
    // Update visual selection
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-product="${productKey}"]`).classList.add('selected');
    
    selectedProduct = productKey;
    
    // Auto-advance to step 2
    setTimeout(() => {
        goToStep(2);
    }, 300);
}

// Country selection
function selectCountry(countryKey) {
    console.log('Selecting country:', countryKey);
    
    // Update visual selection
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-country="${countryKey}"]`).classList.add('selected');
    
    selectedCountry = countryKey;
    
    // Calculate results
    calculateTariff();
    
    // Auto-advance to step 3
    setTimeout(() => {
        goToStep(3);
    }, 300);
}

// Step navigation
function goToStep(stepNumber) {
    currentStep = stepNumber;
    showStep(stepNumber);
    updateProgressIndicator();
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${stepNumber}`).classList.add('active');
}

function updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
}

// Main calculation function
function calculateTariff() {
    if (!selectedProduct || !selectedCountry) return;
    
    const product = products[selectedProduct];
    const countryTariffs = tariffs[selectedCountry];
    const manufacturingPremium = premiums[selectedCountry];
    
    // Base costs
    const baseCogs = product.cogs;
    const premiumCost = baseCogs * manufacturingPremium;
    const adjustedCogs = baseCogs + premiumCost;
    
    // Tariff calculation
    const tariffRate = countryTariffs[product.category];
    const tariffCost = adjustedCogs * tariffRate;
    const totalCost = adjustedCogs + tariffCost;
    
    calculationResult = {
        product: product,
        country: selectedCountry,
        baseCogs: baseCogs,
        premiumCost: premiumCost,
        adjustedCogs: adjustedCogs,
        tariffRate: tariffRate,
        tariffCost: tariffCost,
        totalCost: totalCost
    };
    
    displayResults();
    generateComparison();
}

// Display results in Step 3
function displayResults() {
    if (!calculationResult) return;
    
    const result = calculationResult;
    const productDisplay = selectedProduct.length > 20 ? 
        selectedProduct.substring(0, 20) + '...' : selectedProduct;
    
    // Primary results
    document.getElementById('result-product').textContent = productDisplay;
    document.getElementById('result-country').textContent = countryInfo[selectedCountry].name;
    document.getElementById('result-total').textContent = `$${result.totalCost.toFixed(2)}`;
    
    // Cost breakdown
    document.getElementById('breakdown-base').textContent = `$${result.baseCogs.toFixed(2)}`;
    document.getElementById('breakdown-premium').textContent = `$${result.premiumCost.toFixed(2)}`;
    document.getElementById('breakdown-tariff').textContent = `$${result.tariffCost.toFixed(2)}`;
    document.getElementById('breakdown-total').textContent = `$${result.totalCost.toFixed(2)}`;
}

// Generate quick comparison
function generateComparison() {
    if (!selectedProduct) return;
    
    const comparisonGrid = document.getElementById('comparison-grid');
    comparisonGrid.innerHTML = '';
    
    // Calculate costs for top 4 countries
    const topCountries = ['vietnam', 'malaysia', 'japan', 'korea'];
    const comparisons = [];
    
    topCountries.forEach(country => {
        const product = products[selectedProduct];
        const countryTariffs = tariffs[country];
        const manufacturingPremium = premiums[country];
        
        const baseCogs = product.cogs;
        const premiumCost = baseCogs * manufacturingPremium;
        const adjustedCogs = baseCogs + premiumCost;
        const tariffCost = adjustedCogs * countryTariffs[product.category];
        const totalCost = adjustedCogs + tariffCost;
        
        comparisons.push({
            country: country,
            totalCost: totalCost,
            isCurrent: country === selectedCountry
        });
    });
    
    // Sort by cost
    comparisons.sort((a, b) => a.totalCost - b.totalCost);
    
    // Display comparisons
    comparisons.forEach((comp, index) => {
        const item = document.createElement('div');
        item.className = `comparison-item ${comp.isCurrent ? 'current' : ''}`;
        
        const diff = comp.totalCost - comparisons[0].totalCost;
        const diffClass = diff === 0 ? '' : 'expensive';
        const diffText = diff === 0 ? 'Best price' : `+$${diff.toFixed(2)}`;
        
        item.innerHTML = `
            <div class="comparison-country">${countryInfo[comp.country].flag} ${countryInfo[comp.country].name}</div>
            <div class="comparison-cost">$${comp.totalCost.toFixed(2)}</div>
            <div class="comparison-diff ${diffClass}">${diffText}</div>
        `;
        
        comparisonGrid.appendChild(item);
    });
}

// Advanced options toggle
function toggleAdvanced() {
    const options = document.getElementById('advanced-options');
    options.classList.toggle('show');
}

// Tab switching
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// Pricing strategy functions
function showPricingStrategy(strategy) {
    if (!calculationResult) return;
    
    const result = calculationResult;
    const product = result.product;
    
    // Calculate China baseline for comparison
    const chinaBaseCogs = product.cogs;
    const chinaTariff = tariffs.china[product.category];
    const chinaTotalCost = chinaBaseCogs * (1 + chinaTariff);
    
    const resultsDiv = document.getElementById('strategy-results');
    
    let strategyResult = '';
    
    switch(strategy) {
        case 'protect-dollars':
            const currentMarginDollars = product.asp - chinaTotalCost;
            const newASP = result.totalCost + currentMarginDollars;
            const priceIncrease = newASP - product.asp;
            
            strategyResult = `
                <div class="strategy-result">
                    <h5>Keep Same Profit Dollars</h5>
                    <p>Current margin: $${currentMarginDollars.toFixed(2)}</p>
                    <p>New ASP needed: $${newASP.toFixed(2)}</p>
                    <p>Price increase: $${priceIncrease.toFixed(2)}</p>
                </div>
            `;
            break;
            
        case 'protect-percent':
            const currentMarginPercent = (product.asp - chinaTotalCost) / product.asp;
            const newASPPercent = result.totalCost / (1 - currentMarginPercent);
            const priceIncreasePercent = newASPPercent - product.asp;
            
            strategyResult = `
                <div class="strategy-result">
                    <h5>Keep Same Profit %</h5>
                    <p>Current margin: ${(currentMarginPercent * 100).toFixed(1)}%</p>
                    <p>New ASP needed: $${newASPPercent.toFixed(2)}</p>
                    <p>Price increase: $${priceIncreasePercent.toFixed(2)}</p>
                </div>
            `;
            break;
            
        case 'absorb':
            const newMargin = product.asp - result.totalCost;
            const newMarginPercent = newMargin / product.asp;
            
            strategyResult = `
                <div class="strategy-result">
                    <h5>Absorb the Cost</h5>
                    <p>Keep ASP at: $${product.asp.toFixed(2)}</p>
                    <p>New margin: $${newMargin.toFixed(2)}</p>
                    <p>New margin %: ${(newMarginPercent * 100).toFixed(1)}%</p>
                </div>
            `;
            break;
    }
    
    resultsDiv.innerHTML = strategyResult;
}

// Export functions
function exportCSV() {
    if (!calculationResult) return;
    
    const result = calculationResult;
    const csv = `Product,Country,Base Cost,Premium,Tariff,Total Cost
${selectedProduct},${countryInfo[selectedCountry].name},$${result.baseCogs.toFixed(2)},$${result.premiumCost.toFixed(2)},$${result.tariffCost.toFixed(2)},$${result.totalCost.toFixed(2)}`;
    
    downloadFile(csv, 'tariff-analysis.csv', 'text/csv');
}

function exportPDF() {
    alert('PDF export feature coming soon!');
}

function shareLink() {
    const url = `${window.location.origin}${window.location.pathname}?product=${selectedProduct}&country=${selectedCountry}`;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    });
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Breaking news dismissal
function dismissNews() {
    document.getElementById('breaking-news').style.display = 'none';
}

// Detailed math display
function showDetailedMath() {
    if (!calculationResult) return;
    
    const result = calculationResult;
    const mathDiv = document.getElementById('math-details');
    
    mathDiv.innerHTML = `
        <div class="math-step">
            <strong>Step 1:</strong> Base manufacturing cost = $${result.baseCogs.toFixed(2)}
        </div>
        <div class="math-step">
            <strong>Step 2:</strong> Manufacturing premium (${(premiums[selectedCountry] * 100).toFixed(1)}%) = $${result.premiumCost.toFixed(2)}
        </div>
        <div class="math-step">
            <strong>Step 3:</strong> Adjusted COGS = $${result.baseCogs.toFixed(2)} + $${result.premiumCost.toFixed(2)} = $${result.adjustedCogs.toFixed(2)}
        </div>
        <div class="math-step">
            <strong>Step 4:</strong> Import tariff (${(result.tariffRate * 100).toFixed(1)}%) = $${result.adjustedCogs.toFixed(2)} × ${result.tariffRate.toFixed(3)} = $${result.tariffCost.toFixed(2)}
        </div>
        <div class="math-step">
            <strong>Step 5:</strong> Total cost = $${result.adjustedCogs.toFixed(2)} + $${result.tariffCost.toFixed(2)} = <strong>$${result.totalCost.toFixed(2)}</strong>
        </div>
    `;
}

console.log('Improved calculator script loaded successfully');