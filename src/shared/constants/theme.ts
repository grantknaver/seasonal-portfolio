export enum Theme {
  Fall = 'Fall',
  Winter = 'Winter',
  Spring = 'Spring',
  Summer = 'Summer',
}

export const themeMap = {
  Fall: {
    '--q-primary': '#f7eddc',
    '--q-secondary': '#eac08c',
    '--q-accent': '#8d3a1e',
    '--q-dark': '#3b2718',
  },
  Winter: {
    '--q-primary': '#e3f2fd',
    '--q-secondary': '#bbdefb',
    '--q-accent': '#0d47a1',
    '--q-dark': '#0b1f3b',
  },
  Spring: {
    '--q-primary': '#e8f5e9',
    '--q-secondary': '#c8e6c9',
    '--q-accent': '#00796b',
    '--q-dark': '#233129',
  },
  Summer: {
    '--q-primary': '#fff9c4',
    '--q-secondary': '#ffe082',
    '--q-accent': '#006064',
    '--q-dark': '#0D3B66',
  },
};
