export const CRITERIA = [
  {
    id: 1,
    title: 'Strategic asset and ownership or control',
    description: 'Whether the asset is a strategic asset, and whether the proposal involves transfer of ownership or control of it.',
    levels: {
      lower: 'No impact on Council’s ownership or control.',
      moderate: 'Some impact on a strategic asset, but no transfer of ownership or control.',
      higher: 'The decision involves sale or transfer of a strategic asset or control of one. This will also need a Long Term Plan amendment if not already provided for.'
    }
  },
  {
    id: 2,
    title: 'Impact on levels of service',
    description: 'The impact on levels of service Council provides, or how services are delivered.',
    levels: {
      lower: 'Low level of change. No change to Long Term Plan levels of service or delivery method.',
      moderate: 'Medium level of change. Still no change to Long Term Plan levels of service or delivery method.',
      higher: 'Major or long-term change to levels of service for a significant activity, or a change in how a significant activity is delivered. This will need a Long Term Plan amendment.'
    }
  },
  {
    id: 3,
    title: 'Impact on debt, rates and financial capacity',
    description: 'The degree of impact on Council’s debt or rates, and its financial capacity including debt and rates limits.',
    levels: {
      lower: 'Low impact on capital or operational expenditure. Minor value against rates revenue.',
      moderate: 'Moderate impact on capital or operational expenditure. Moderate value against rates revenue.',
      higher: 'Major or long-term impact on debt or rates. High value against rates revenue.'
    }
  },
  {
    id: 4,
    title: 'Reversibility and impact on future generations',
    description: 'Whether the decision is reversible, and the likely impact on future generations.',
    levels: {
      lower: 'Short term or reversible. Low impact on future generations.',
      moderate: 'Medium term. Difficult to reverse. Moderate impact on future generations.',
      higher: 'Longer term or irreversible. High negative impact on future generations.'
    }
  },
  {
    id: 5,
    title: 'Impact on the community',
    description: 'How many people are affected, and by how much.',
    levels: {
      lower: 'Low impact on sections or all of the community.',
      moderate: 'Medium impact on sections or all of the community.',
      higher: 'Major impact on sections or all of the community.'
    }
  },
  {
    id: 6,
    title: 'Public interest',
    description: 'Any past history of the issue generating wide public interest, or a reasonable expectation it would generate this interest now.',
    levels: {
      lower: 'No history and no reasonable expectation of wide or intense interest.',
      moderate: 'Some history of interest in general or within particular sectors, or a low-to-moderate likelihood of wide interest.',
      higher: 'History of wide and intense interest, or a reasonable likelihood of it.'
    }
  },
  {
    id: 7,
    title: 'Relationship to past decisions and community views',
    description: 'Whether the decision flows from, or promotes, a decision already taken by Council, or furthers a community outcome, policy or strategy, and how well the community’s views are already known.',
    levels: {
      lower: 'Consequential to, or promotes, a decision already taken. Community views are known.',
      moderate: 'Relates to previous decisions. Community views are known or somewhat known through previous consultation.',
      higher: 'Significant under other criteria, and the community has not been previously consulted on this matter.'
    }
  }
];

export const STRATEGIC_ASSETS = [
  'Water supply catchments and network',
  'Wastewater network',
  'Stormwater network',
  'Flood protection network',
  'Land transport network',
  'Shareholding in Infrastructure Holdings Ltd',
  'Shareholding in Nelmac Ltd'
];

export const ENGAGEMENT_TOOLS = {
  'In-person': [
    'Drop-in sessions',
    'Focus groups',
    'Public meetings',
    'Surveys'
  ],
  'Print': [
    'Letters',
    'Our Nelson',
    'Media releases',
    'Public notices'
  ],
  'Online': [
    'Council website',
    'Engagement platform',
    'Social media',
    'Email newsletters',
    'Antenno app'
  ]
};

export function calculateSignificance(criteria) {
  const points = { lower: 1, moderate: 2, higher: 3 };
  let total = 0;
  let count = 0;

  Object.values(criteria).forEach(c => {
    if (c.rating) {
      total += points[c.rating];
      count++;
    }
  });

  if (count === 0) return null;

  const avg = total / count;
  if (avg < 1.67) return 'lower';
  if (avg <= 2.33) return 'moderate';
  return 'higher';
}

export function getEngagementLevel(significance) {
  switch (significance) {
    case 'lower':
      return {
        level: 'Inform',
        description: 'Provide information to the community about the decision.'
      };
    case 'moderate':
      return {
        level: 'Consult',
        description: 'Obtain feedback from the community. This could include an advisory committee, focus group, public meetings, or surveys.'
      };
    case 'higher':
      return {
        level: 'Involve, Collaborate or Empower',
        description: 'Work directly with the community, partner with the community, or the community decides. Council may also need the Special Consultative Procedure for matters of high significance, especially Long Term Plan or bylaw decisions.'
      };
    default:
      return null;
  }
}
