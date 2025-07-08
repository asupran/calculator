# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Application

This is a pure client-side web application with no build process required:

```bash
# Run the application
open index.html

# Or serve via HTTP server for development
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Code Architecture

### Core Application Structure

This is a **two-country tariff comparison calculator** specifically designed for audio equipment manufacturing decisions. The architecture is intentionally simple with three main files:

- **`index.html`** - Main application UI with two-country selection interface
- **`script-simple.js`** - Core calculation logic and event handling
- **`styles.css`** - Complete styling including responsive design

### Key Data Structures

The application is built around these core data models in `script-simple.js`:

```javascript
// Product database with COGS, ASP, and category classification
const products = {
  'VX62R': { cogs: 61.12, asp: 212.49, category: 'speakers' },
  // ... more products
};

// Country-specific tariff rates by product category
const tariffs = {
  china: { speakers: 0.375, iport: 0.55, amplifiers: 0.375 },
  vietnam: { speakers: 0.20, iport: 0.20, amplifiers: 0.20 },
  // ... more countries
};

// Manufacturing cost premiums by country
const premiums = {
  china: 0.00,
  vietnam: 0.125,
  // ... more countries
};
```

### Application Flow

1. **Product Selection**: User selects from predefined audio equipment products
2. **Country Selection**: User selects two countries for comparison (Country A vs Country B)
3. **Cost Calculation**: System calculates total costs including manufacturing premiums and tariffs
4. **Comparison Display**: Shows side-by-side comparison with winner recommendation
5. **Pricing Strategy**: Provides pricing recommendations to maintain profitability

### Key Functions

- **`selectCountryForComparison(country, selection)`** - Handles country selection for A/B comparison
- **`calculateTwoCountryComparison()`** - Main calculation orchestrator
- **`calculateCountryCost(country)`** - Calculates total cost for a specific country
- **`displayTwoCountryComparison()`** - Updates UI with comparison results
- **`showPricingStrategy(strategy)`** - Calculates pricing recommendations

### UI Components

The interface uses a **split-screen country selection** design:
- Left side: Country A selection with green highlight (`selected-a` class)
- Right side: Country B selection with blue highlight (`selected-b` class)  
- Center: VS indicator with pulsing animation
- Results: Side-by-side comparison cards with winner recommendation

### Tariff Calculation Logic

Total cost calculation per country:
1. **Manufacturing Cost** = `baseCOGS × (1 + manufacturingPremium)`
2. **Tariff Cost** = `manufacturingCost × tariffRate`
3. **Total Cost** = `manufacturingCost + tariffCost`

### Pricing Strategy Options

Three pricing strategies are supported:
- **Keep Same Profit $**: Maintains absolute dollar profit from better country
- **Keep Same Profit %**: Maintains percentage margin from better country
- **Absorb the Cost**: Keeps current price, accepts lower profit

## Product Categories

The system supports three product categories with different tariff rates:
- **speakers**: Audio speakers and related equipment
- **iport**: Electronic interfaces and connectivity products  
- **amplifiers**: Audio amplification equipment

## Supported Countries

Currently supports 6 manufacturing countries:
- China (baseline, 37.5% speakers/55% electronics)
- Vietnam (20% across all categories)
- Malaysia (24% across all categories)
- Thailand (36% across all categories)
- Indonesia (32% across all categories)
- Cambodia (49% across all categories)

## Styling System

The CSS uses a **modern gradient-based design** with:
- Responsive grid layouts for country selection
- CSS animations for interactive feedback
- Color-coded comparison results (green/blue/red)
- Mobile-first responsive design principles

## Data Updates

When updating tariff rates or adding products:
1. Update the relevant constants in `script-simple.js`
2. Modify the breaking news banner in `index.html` if rates change significantly
3. Add new countries to both `tariffs` and `premiums` objects
4. Update `countryNames` mapping for display purposes