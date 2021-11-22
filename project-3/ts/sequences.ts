// songs already in mm.INoteSequence for testing purposes

import * as mm from '@magenta/music/es6';

export const EMPTY: mm.INoteSequence = {
  notes: [],
  tempos: [
    {time: 0, qpm: 60}
  ],
  quantizationInfo: {stepsPerQuarter: 4},
  totalQuantizedSteps: 32
};

export const TWINKLE_FIRST_HALF: mm.INoteSequence = {
  notes: [
    {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2, program: 0},
    {pitch: 60, quantizedStartStep: 2, quantizedEndStep: 4, program: 0},
    {pitch: 67, quantizedStartStep: 4, quantizedEndStep: 6, program: 0},
    {pitch: 67, quantizedStartStep: 6, quantizedEndStep: 8, program: 0},
    {pitch: 69, quantizedStartStep: 8, quantizedEndStep: 10, program: 0},
    {pitch: 69, quantizedStartStep: 10, quantizedEndStep: 12, program: 0},
    {pitch: 67, quantizedStartStep: 12, quantizedEndStep: 16, program: 0},
    {pitch: 65, quantizedStartStep: 16, quantizedEndStep: 18, program: 0},
    {pitch: 65, quantizedStartStep: 18, quantizedEndStep: 20, program: 0},
    {pitch: 64, quantizedStartStep: 20, quantizedEndStep: 22, program: 0},
    {pitch: 64, quantizedStartStep: 22, quantizedEndStep: 24, program: 0},
    {pitch: 62, quantizedStartStep: 24, quantizedEndStep: 26, program: 0},
    {pitch: 62, quantizedStartStep: 26, quantizedEndStep: 28, program: 0},
    {pitch: 60, quantizedStartStep: 28, quantizedEndStep: 32, program: 0}
  ],
  tempos: [
    {time: 0, qpm: 60}
  ],
  quantizationInfo: {stepsPerQuarter: 4},
  totalQuantizedSteps: 32
};

export const TWINKLE_SECOND_HALF: mm.INoteSequence = {
  notes: [
    {pitch: 67, quantizedStartStep: 0, quantizedEndStep: 2, program: 0},
    {pitch: 67, quantizedStartStep: 2, quantizedEndStep: 4, program: 0},
    {pitch: 65, quantizedStartStep: 4, quantizedEndStep: 6, program: 0},
    {pitch: 65, quantizedStartStep: 6, quantizedEndStep: 8, program: 0},
    {pitch: 64, quantizedStartStep: 8, quantizedEndStep: 10, program: 0},
    {pitch: 64, quantizedStartStep: 10, quantizedEndStep: 12, program: 0},
    {pitch: 62, quantizedStartStep: 12, quantizedEndStep: 16, program: 0},
    {pitch: 67, quantizedStartStep: 16, quantizedEndStep: 18, program: 0},
    {pitch: 67, quantizedStartStep: 18, quantizedEndStep: 20, program: 0},
    {pitch: 65, quantizedStartStep: 20, quantizedEndStep: 22, program: 0},
    {pitch: 65, quantizedStartStep: 22, quantizedEndStep: 24, program: 0},
    {pitch: 64, quantizedStartStep: 24, quantizedEndStep: 26, program: 0},
    {pitch: 64, quantizedStartStep: 26, quantizedEndStep: 28, program: 0},
    {pitch: 62, quantizedStartStep: 28, quantizedEndStep: 32, program: 0}
  ],
  tempos: [
    {time: 0, qpm: 60}
  ],
  quantizationInfo: {stepsPerQuarter: 4},
  totalQuantizedSteps: 32
};
