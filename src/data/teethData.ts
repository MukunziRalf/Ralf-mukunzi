import { Tooth } from '../types';

export const TEETH_DATA: Tooth[] = [
  // Upper Right (1 - 8)
  { number: 1, name: 'Third Molar (Wisdom Tooth)', quadrant: 'upper-right', type: 'Molar' },
  { number: 2, name: 'Second Molar', quadrant: 'upper-right', type: 'Molar' },
  { number: 3, name: 'First Molar (6-Year Molar)', quadrant: 'upper-right', type: 'Molar' },
  { number: 4, name: 'Second Premolar (Bicuspid)', quadrant: 'upper-right', type: 'Premolar' },
  { number: 5, name: 'First Premolar (Bicuspid)', quadrant: 'upper-right', type: 'Premolar' },
  { number: 6, name: 'Canine (Eyetooth)', quadrant: 'upper-right', type: 'Canine' },
  { number: 7, name: 'Lateral Incisor', quadrant: 'upper-right', type: 'Incisor' },
  { number: 8, name: 'Central Incisor (Front Tooth)', quadrant: 'upper-right', type: 'Incisor' },

  // Upper Left (9 - 16)
  { number: 9, name: 'Central Incisor (Front Tooth)', quadrant: 'upper-left', type: 'Incisor' },
  { number: 10, name: 'Lateral Incisor', quadrant: 'upper-left', type: 'Incisor' },
  { number: 11, name: 'Canine (Eyetooth)', quadrant: 'upper-left', type: 'Canine' },
  { number: 12, name: 'First Premolar (Bicuspid)', quadrant: 'upper-left', type: 'Premolar' },
  { number: 13, name: 'Second Premolar (Bicuspid)', quadrant: 'upper-left', type: 'Premolar' },
  { number: 14, name: 'First Molar (6-Year Molar)', quadrant: 'upper-left', type: 'Molar' },
  { number: 15, name: 'Second Molar', quadrant: 'upper-left', type: 'Molar' },
  { number: 16, name: 'Third Molar (Wisdom Tooth)', quadrant: 'upper-left', type: 'Molar' },

  // Lower Left (17 - 24)
  { number: 17, name: 'Third Molar (Wisdom Tooth)', quadrant: 'lower-left', type: 'Molar' },
  { number: 18, name: 'Second Molar', quadrant: 'lower-left', type: 'Molar' },
  { number: 19, name: 'First Molar (6-Year Molar)', quadrant: 'lower-left', type: 'Molar' },
  { number: 20, name: 'Second Premolar (Bicuspid)', quadrant: 'lower-left', type: 'Premolar' },
  { number: 21, name: 'First Premolar (Bicuspid)', quadrant: 'lower-left', type: 'Premolar' },
  { number: 22, name: 'Canine (Eyetooth)', quadrant: 'lower-left', type: 'Canine' },
  { number: 23, name: 'Lateral Incisor', quadrant: 'lower-left', type: 'Incisor' },
  { number: 24, name: 'Central Incisor (Front Tooth)', quadrant: 'lower-left', type: 'Incisor' },

  // Lower Right (25 - 32)
  { number: 25, name: 'Central Incisor (Front Tooth)', quadrant: 'lower-right', type: 'Incisor' },
  { number: 26, name: 'Lateral Incisor', quadrant: 'lower-right', type: 'Incisor' },
  { number: 27, name: 'Canine (Eyetooth)', quadrant: 'lower-right', type: 'Canine' },
  { number: 28, name: 'First Premolar (Bicuspid)', quadrant: 'lower-right', type: 'Premolar' },
  { number: 29, name: 'Second Premolar (Bicuspid)', quadrant: 'lower-right', type: 'Premolar' },
  { number: 30, name: 'First Molar (6-Year Molar)', quadrant: 'lower-right', type: 'Molar' },
  { number: 31, name: 'Second Molar', quadrant: 'lower-right', type: 'Molar' },
  { number: 32, name: 'Third Molar (Wisdom Tooth)', quadrant: 'lower-right', type: 'Molar' },
];

export const COMMON_SYMPTOMS_LIST = [
  'Sharp stabbing pain',
  'Dull continuous ache',
  'Throbbing pain',
  'Sensitivity to cold drinks/ice',
  'Sensitivity to hot foods/coffee',
  'Pain when biting or chewing',
  'Swollen or bleeding gums',
  'Bad taste or odor in mouth',
  'Jaw stiffness or popping',
  'Cracked or chipped enamel',
  'Sensitivity to sweets',
  'Loosened tooth or restoration',
  'Facial swelling or fever'
];

export const COMMON_TRIGGERS_LIST = [
  'Cold drinks / ice cream',
  'Hot liquids / soups',
  'Chewing / Pressure',
  'Sweet foods',
  'Lying down / night time',
  'Cold wind / air',
  'Touch / Brushing'
];
