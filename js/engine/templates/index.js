// Registry of the 12 activity templates. Content picks one by name.
import { tap, mcq, numpadT, mathkb } from './basic.js';
import { drag, balance } from './drag.js';
import { abacus, numline, clock, bar } from './manip.js';
import { steps, graph, drill, mock, explainer } from './advanced.js';

export const TEMPLATES = {
  tap,            // 1  tap-to-count / tap-to-select
  drag,           // 2  drag-and-drop to target
  balance,        // 3  balance / compare
  numpad: numpadT,// 4  number pad answer
  mathkb,         // 5  maths keyboard
  mcq,            // 6  multiple choice
  steps,          // 7  step-by-step worked solution
  abacus, numline, clock, bar, // 8  manipulatives
  graph,          // 9  graph plotter
  drill,          // 10 timed drill
  mock            // 11 mock test runner
};
export { explainer }; // 12 animated explainer
