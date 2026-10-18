export type Operation = {
  id: string;
  name: string;
  icon: string;
  screen: string;
  color: string;
  description: string;
  group: 'Practice' | 'Tools';
};

export const getOperations = (navigation: any): Operation[] => [
  { id: '1', name: 'Addition', icon: 'plus', screen: 'Add', color: '#0B6B3A', description: 'Flash-number sums', group: 'Practice' },
  { id: '2', name: 'Subtraction', icon: 'minus', screen: 'Sub', color: '#E4572E', description: 'Add and take away', group: 'Practice' },
  { id: '3', name: 'Multiplication', icon: 'close', screen: 'Mul', color: '#3A6EA5', description: 'Beat the clock', group: 'Practice' },
  { id: '4', name: 'Division', icon: 'division', screen: 'Div', color: '#8E5BB5', description: 'Exact quotients', group: 'Practice' },
  { id: '5', name: 'Square Root', icon: 'square-root', screen: 'Square', color: '#D98E04', description: 'Find the root', group: 'Practice' },
  { id: '6', name: 'Cube Root', icon: 'cube-outline', screen: 'Cube', color: '#1B9AAA', description: 'Cubes made easy', group: 'Practice' },
  { id: '9', name: 'Tables', icon: 'table', screen: 'Table', color: '#C2437A', description: 'Learn and quiz', group: 'Practice' },
  { id: '10', name: 'Math Riddles', icon: 'math-compass', screen: 'Riddles', color: '#5B6ABF', description: 'Think it through', group: 'Practice' },
  { id: '7', name: 'Stopwatch', icon: 'clock-outline', screen: 'StopWatch', color: '#5E7B6B', description: 'Time yourself', group: 'Tools' },
  { id: '8', name: 'Timer', icon: 'timer-outline', screen: 'Timer', color: '#7A6A53', description: 'Count down', group: 'Tools' },
];
