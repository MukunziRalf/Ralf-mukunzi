import { PostOpInstruction } from '../types';

export const POST_OP_GUIDES: Record<string, PostOpInstruction> = {
  'extraction': {
    title: 'Tooth Extraction & Wisdom Tooth Recovery',
    category: 'Surgical Procedure',
    doList: [
      'Keep firm pressure on the gauze pad for 30–45 minutes after the procedure.',
      'Apply an ice pack to the cheek in 15-minute intervals for the first 24 hours to reduce swelling.',
      'Elevate your head with 2–3 pillows when sleeping or resting.',
      'Eat soft, cool foods (yoghurt, applesauce, smoothies, lukewarm soup).',
      'Begin gentle warm salt water rinses (1/2 tsp salt in 8 oz warm water) starting 24 hours post-procedure.'
    ],
    dontList: [
      'DO NOT drink through a straw for at least 5–7 days (suction can cause painful Dry Socket).',
      'DO NOT smoke or use vape products for a minimum of 72 hours.',
      'DO NOT spit forcibly or rinse vigorously for the first 24 hours.',
      'Avoid hard, crunchy, spicy, or seeds/nuts that can get lodged in the extraction socket.',
      'Avoid heavy exercise or lifting for 48 hours to prevent bleeding spikes.'
    ],
    warningSigns: [
      'Throbbing severe pain developing 3–5 days after (possible Dry Socket).',
      'Uncontrolled heavy bleeding that saturates gauze after 2 hours of direct pressure.',
      'Fever over 101°F (38.3°C) or visible pus discharge.',
      'Progressive swelling or difficulty swallowing/breathing.'
    ],
    timeline: [
      { title: 'Day 1 (First 24 hrs)', detail: 'Blood clot forms. Rest, ice pack, cold soft food, no suction or spitting.' },
      { title: 'Days 2 - 3', detail: 'Swelling peaks and begins subsiding. Start gentle salt water rinses after meals.' },
      { title: 'Days 4 - 7', detail: 'Tissue starts closing. Transition to soft solid foods (scrambled eggs, pasta).' },
      { title: 'Weeks 2 - 4', detail: 'Socket continues filling with soft tissue. Bone healing underway over 3-6 months.' }
    ]
  },
  'root-canal': {
    title: 'Root Canal Treatment (Endodontics)',
    category: 'Endodontic Therapy',
    doList: [
      'Take prescribed anti-inflammatory medication (e.g. Ibuprofen) as directed before local anesthetic completely wears off.',
      'Maintain normal gentle brushing and flossing around the treated tooth.',
      'Schedule your permanent crown or restoration appointment with your dentist promptly.'
    ],
    dontList: [
      'DO NOT chew or bite on the treated tooth until your permanent crown is placed to prevent tooth fracture.',
      'Avoid sticky or hard candies that could pull off temporary fillings.',
      'Avoid hot beverages while numbness persists to prevent cheek or tongue burns.'
    ],
    warningSigns: [
      'Severe pain that persists or worsens 3+ days after treatment.',
      'Visible swelling inside the mouth or external facial swelling.',
      'Temporary filling falling out entirely leaving open cavity.'
    ],
    timeline: [
      { title: 'First 24 - 48 Hours', detail: 'Mild to moderate tenderness when pressing. Managed with OTC analgesics.' },
      { title: 'Day 3 - 7', detail: 'Tenderness diminishes rapidly. Avoid chewing hard items on temporary restoration.' },
      { title: 'Within 2 - 3 Weeks', detail: 'Permanent crown/core build-up completed to seal tooth against reinfection.' }
    ]
  },
  'filling': {
    title: 'Dental Composite / Amalgam Filling',
    category: 'Restorative Care',
    doList: [
      'Wait until local anesthesia (numbness) wears off completely before eating.',
      'Practice good oral hygiene; brush twice daily with fluoride toothpaste.',
      'Call if your bite feels uneven or higher on one side when clenching.'
    ],
    dontList: [
      'DO NOT chew hard ice, hard candy, or crunch unpopped popcorn kernels on new restorations.',
      'Avoid biting down forcibly on numb lips, tongue, or cheeks.'
    ],
    warningSigns: [
      'Constant throbbing pain without touching or chewing.',
      'Sharp pain when biting down that does not improve after 3 days (may need bite adjustment).'
    ],
    timeline: [
      { title: 'First 24 Hours', detail: 'Composite fillings set immediately with light. Mild temperature sensitivity is normal.' },
      { title: 'Days 2 - 14', detail: 'Cold sensitivity usually fades gradually over 1-2 weeks.' }
    ]
  },
  'crown': {
    title: 'Crown / Bridge Procedure (Temporary & Permanent)',
    category: 'Prosthodontics',
    doList: [
      'Floss by pulling the thread out sideways rather than lifting straight up to protect temporary cement.',
      'Eat soft foods on the opposite side of the mouth while wearing a temporary crown.'
    ],
    dontList: [
      'DO NOT chew gum, caramel, taffy, or hard nuts on temporary crowns.',
      'Do not ignore a loose temporary crown; contact the office to re-cement it to protect the prepped tooth.'
    ],
    warningSigns: [
      'Temporary crown comes off and tooth experiences extreme temperature sensitivity.',
      'Uneven bite height causing sharp localized pain.'
    ],
    timeline: [
      { title: 'Temporary Phase (1-2 Weeks)', detail: 'Protects prepped tooth while lab fabricates custom ceramic/zirconia crown.' },
      { title: 'Permanent Cementation', detail: 'Final placement. Normal chewing restored within 24 hours.' }
    ]
  },
  'scaling': {
    title: 'Deep Cleaning (Scaling & Root Planing)',
    category: 'Periodontal Therapy',
    doList: [
      'Rinse with warm salt water 3 times daily to soothe tender gum tissue.',
      'Use a soft-bristled or electric toothbrush with gentle circular motions.',
      'Use sensitivity-formulated toothpaste if cold sensitivity occurs.'
    ],
    dontList: [
      'DO NOT smoke or consume alcoholic drinks for at least 48 hours to promote gum reattachment.',
      'Avoid spicy, acidic (citrus, tomatoes), or small seed foods for 3 days.'
    ],
    warningSigns: [
      'Excessive bleeding that does not stop after gentle pressure.',
      'Fever or worsening throbbing gum pain.'
    ],
    timeline: [
      { title: 'First 24-48 Hours', detail: 'Gums may feel sore and bleed slightly during brushing. Mild cold sensitivity.' },
      { title: 'Week 1-2', detail: 'Gum inflammation decreases, tissue turns healthy pink and firm.' },
      { title: 'Re-evaluation (4-6 Weeks)', detail: 'Periodontal pocket depth measurement to check healing.' }
    ]
  }
};
