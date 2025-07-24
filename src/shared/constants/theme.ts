export enum Theme {
  Fall = 'Fall',
  Winter = 'Winter',
  Spring = 'Spring',
  Summer = 'Summer',
}

export const themeMap = {
  Fall: {
    '--q-primary': '#f4e7e1',
    '--q-secondary': '#ff9b45',
    '--q-accent': '#d5451b',
    '--q-dark': '#521c0d',
  },
  Winter: {
    '--q-primary': '#e0f7fa',
    '--q-secondary': '#81d4fa',
    '--q-accent': '#00acc1',
    '--q-dark': '#37474f',
  },
  Spring: {
    '--q-primary': '#dcedc8',
    '--q-secondary': '#aed581',
    '--q-accent': '#8bc34a',
    '--q-dark': '#33691e',
  },
  Summer: {
    '--q-primary': '#fff9c4',
    '--q-secondary': '#ffe082',
    '--q-accent': '#ffca28',
    '--q-dark': '#ef6c00',
  },
};
