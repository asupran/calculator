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

// Tariff rates
const tariffs = {
    china: { speakers: 0.30, iport: 0.30, amplifiers: 0.30 },
    vietnam: { speakers: 0.20, iport: 0.20, amplifiers: 0.20 },
    thailand: { speakers: 0.18, iport: 0.18, amplifiers: 0.18 },
    cambodia: { speakers: 0.25, iport: 0.25, amplifiers: 0.25 }
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
let currentTotalCost = null;

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
    
    // Pricing strategy buttons
    const protectDollarsBtn = document.getElementById('protect-margin-dollars');
    const protectPercentBtn = document.getElementById('protect-margin-percent');
    const absorbBtn = document.getElementById('absorb-increase');
    
    if (protectDollarsBtn) {
        protectDollarsBtn.addEventListener('click', function() {
            showPricingStrategy('protect-dollars');
        });
    }
    
    if (protectPercentBtn) {
        protectPercentBtn.addEventListener('click', function() {
            showPricingStrategy('protect-percent');
        });
    }
    
    if (absorbBtn) {
        absorbBtn.addEventListener('click', function() {
            showPricingStrategy('absorb');
        });
    }
    
    // Show math button
    const showMathBtn = document.getElementById('show-math');
    if (showMathBtn) {
        showMathBtn.addEventListener('click', function() {
            showDetailedMath();
        });
    }
    
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
    
    // Store for pricing calculations
    currentTotalCost = totalCost;
    
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

function showPricingStrategy(strategy) {
    if (!currentProduct || !currentCountry || !currentTotalCost) {
        console.log('Missing data for pricing strategy');
        return;
    }
    
    const currentASP = currentProduct.asp;
    const originalCOGS = currentProduct.cogs; // China baseline COGS
    const newCOGS = currentTotalCost; // New total cost including tariffs
    
    // Current margins (based on China baseline)
    const currentMarginDollars = currentASP - originalCOGS;
    const currentMarginPercent = (currentMarginDollars / currentASP) * 100;
    
    let recommendedASP = currentASP;
    let strategyLabel = 'Current ASP:';
    
    if (strategy === 'protect-dollars') {
        // Keep same margin dollars: New ASP = New COGS + Current Margin $
        recommendedASP = newCOGS + currentMarginDollars;
        strategyLabel = 'ASP to Protect Margin $:';
    } else if (strategy === 'protect-percent') {
        // Keep same margin percent: New ASP = New COGS / (1 - Margin %)
        recommendedASP = newCOGS / (1 - (currentMarginPercent / 100));
        strategyLabel = 'ASP to Protect Margin %:';
    } else if (strategy === 'absorb') {
        // Keep current ASP, absorb the cost increase
        recommendedASP = currentASP;
        strategyLabel = 'Current ASP (Absorb Cost):';
    }
    
    // Calculate new margins
    const newMarginDollars = recommendedASP - newCOGS;
    const newMarginPercent = (newMarginDollars / recommendedASP) * 100;
    const priceIncrease = recommendedASP - currentASP;
    
    // Update display
    document.getElementById('current-asp').textContent = '$' + currentASP.toFixed(2);
    document.getElementById('current-margin-dollars').textContent = '$' + currentMarginDollars.toFixed(2);
    document.getElementById('current-margin-percent').textContent = currentMarginPercent.toFixed(1) + '%';
    
    document.getElementById('strategy-label').textContent = strategyLabel;
    document.getElementById('recommended-asp').textContent = '$' + recommendedASP.toFixed(2);
    document.getElementById('new-margin-dollars').textContent = '$' + newMarginDollars.toFixed(2);
    document.getElementById('new-margin-percent').textContent = newMarginPercent.toFixed(1) + '%';
    document.getElementById('price-increase').textContent = (priceIncrease >= 0 ? '+$' : '-$') + Math.abs(priceIncrease).toFixed(2);
    
    // Update button states
    document.querySelectorAll('.strategy-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    if (strategy === 'protect-dollars') {
        document.getElementById('protect-margin-dollars').classList.add('active');
    } else if (strategy === 'protect-percent') {
        document.getElementById('protect-margin-percent').classList.add('active');
    } else if (strategy === 'absorb') {
        document.getElementById('absorb-increase').classList.add('active');
    }
    
    // Show pricing results
    document.getElementById('pricing-results').style.display = 'block';
    
    console.log('Pricing strategy:', strategy, {
        currentASP,
        recommendedASP,
        currentMarginDollars,
        newMarginDollars,
        currentMarginPercent,
        newMarginPercent,
        priceIncrease
    });
}

function showDetailedMath() {
    if (!currentProduct || !currentCountry || !currentTotalCost) {
        console.log('Missing data for math breakdown');
        return;
    }
    
    const baseCogs = currentProduct.cogs;
    const premium = premiums[currentCountry] || 0;
    const tariffRate = tariffs[currentCountry][currentProduct.category] || 0;
    
    // Calculate step by step
    const adjustedCogs = baseCogs * (1 + premium);
    const tariffCost = adjustedCogs * tariffRate;
    const totalCost = adjustedCogs + tariffCost;
    
    // Build math explanation
    let mathHtml = '<div class="math-step-by-step">';
    
    mathHtml += '<div class="math-step">';
    mathHtml += '<div class="step-title">📊 Step 1: Base COGS (China Baseline)</div>';
    mathHtml += '<div class="step-calc">Base COGS = $' + baseCogs.toFixed(2) + '</div>';
    mathHtml += '</div>';
    
    if (premium > 0) {
        const premiumCost = adjustedCogs - baseCogs;
        mathHtml += '<div class="math-step">';
        mathHtml += '<div class="step-title">🏭 Step 2: Manufacturing Premium (' + currentCountry.toUpperCase() + ')</div>';
        mathHtml += '<div class="step-calc">Premium = ' + (premium * 100).toFixed(1) + '% of Base COGS</div>';
        mathHtml += '<div class="step-calc">Premium Cost = $' + baseCogs.toFixed(2) + ' × ' + (premium * 100).toFixed(1) + '% = $' + premiumCost.toFixed(2) + '</div>';
        mathHtml += '<div class="step-calc">Adjusted COGS = $' + baseCogs.toFixed(2) + ' + $' + premiumCost.toFixed(2) + ' = $' + adjustedCogs.toFixed(2) + '</div>';
        mathHtml += '</div>';
    } else {
        mathHtml += '<div class="math-step">';
        mathHtml += '<div class="step-title">🏭 Step 2: Manufacturing Premium (CHINA)</div>';
        mathHtml += '<div class="step-calc">No premium (China baseline) = $0.00</div>';
        mathHtml += '<div class="step-calc">Adjusted COGS = $' + baseCogs.toFixed(2) + '</div>';
        mathHtml += '</div>';
    }
    
    mathHtml += '<div class="math-step">';
    mathHtml += '<div class="step-title">💰 Step 3: Tariff Calculation</div>';
    mathHtml += '<div class="step-calc">Tariff Rate = ' + (tariffRate * 100).toFixed(1) + '%</div>';
    mathHtml += '<div class="step-calc">Tariff Cost = $' + adjustedCogs.toFixed(2) + ' × ' + (tariffRate * 100).toFixed(1) + '% = $' + tariffCost.toFixed(2) + '</div>';
    mathHtml += '</div>';
    
    mathHtml += '<div class="math-step final-step">';
    mathHtml += '<div class="step-title">🎯 Final Total Cost</div>';
    mathHtml += '<div class="step-calc">Total = Adjusted COGS + Tariff Cost</div>';
    mathHtml += '<div class="step-calc">Total = $' + adjustedCogs.toFixed(2) + ' + $' + tariffCost.toFixed(2) + ' = $' + totalCost.toFixed(2) + '</div>';
    mathHtml += '</div>';
    
    // Add comparison with China
    if (currentCountry !== 'china') {
        const chinaBaseCogs = baseCogs;
        const chinaTariffRate = tariffs.china[currentProduct.category];
        const chinaTariffCost = chinaBaseCogs * chinaTariffRate;
        const chinaTotalCost = chinaBaseCogs + chinaTariffCost;
        const costDifference = totalCost - chinaTotalCost;
        
        mathHtml += '<div class="math-step comparison-step">';
        mathHtml += '<div class="step-title">📈 vs China Comparison</div>';
        mathHtml += '<div class="step-calc">China Total = $' + chinaBaseCogs.toFixed(2) + ' + ($' + chinaBaseCogs.toFixed(2) + ' × ' + (chinaTariffRate * 100).toFixed(1) + '%) = $' + chinaTotalCost.toFixed(2) + '</div>';
        mathHtml += '<div class="step-calc">Difference = $' + totalCost.toFixed(2) + ' - $' + chinaTotalCost.toFixed(2) + ' = ' + (costDifference >= 0 ? '+$' : '-$') + Math.abs(costDifference).toFixed(2) + '</div>';
        mathHtml += '<div class="step-calc">' + currentCountry.charAt(0).toUpperCase() + currentCountry.slice(1) + ' is ' + (costDifference >= 0 ? Math.abs(costDifference).toFixed(2) + ' MORE expensive' : Math.abs(costDifference).toFixed(2) + ' LESS expensive') + ' than China</div>';
        mathHtml += '</div>';
    }
    
    mathHtml += '</div>';
    
    // Update display
    document.getElementById('math-steps').innerHTML = mathHtml;
    document.getElementById('math-breakdown').style.display = 'block';
    
    // Update button states
    document.querySelectorAll('.strategy-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.getElementById('show-math').classList.add('active');
    
    console.log('Math breakdown displayed');
}