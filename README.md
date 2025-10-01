# Grid Averaging Calculator

A React-based grid averaging calculator for DCA (Dollar Cost Averaging) strategies. This tool helps you create a grid of buy orders to average down your entry price.

## Features

- **Grid Configuration**: Set grid size, start price, and total capital
- **Flexible Allocation**: Choose between equal or progressive allocation strategies
- **Advanced Controls**: Configure step percentages, multipliers, and take-profit targets
- **Export Functionality**: Download results as CSV
- **Theme Support**: Light and dark themes
- **Click-to-Copy**: Copy prices and TP prices with a single click
- **Self-Testing**: Built-in validation with test results display

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Set Grid Parameters**:

   - Grid size: Number of buy orders
   - Start price: Initial price point
   - Total capital: Amount to allocate across orders

2. **Configure Strategy**:

   - Step percentage: Price decrease between orders
   - Allocation mode: Equal or progressive distribution
   - Step multiplier: Size increase factor for progressive mode
   - Take-profit percentage: Target profit over average price

3. **Review Results**:
   - View the calculated grid in the table
   - Click on prices to copy them
   - Export data as CSV for external use

## Technical Details

The calculator uses geometric progression for price stepping and supports both equal and progressive capital allocation strategies. All calculations are performed client-side with built-in validation tests.

## License

This project is open source and available under the MIT License.
