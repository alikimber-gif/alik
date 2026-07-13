export const overviewStats = {
  totalSubmissions: 1847,
  submissionsChange: 12.3,
  communityEvents: 34,
  eventsChange: 8.5,
  participationRate: 23.6,
  participationChange: 3.2,
  feedbackResponses: 4218,
  feedbackChange: 15.7,
}

export const consultationPhases = [
  {
    id: 'future-dev',
    name: 'Future Development Strategy',
    status: 'active',
    channel: 'Online & In-person',
    submissions: 482,
    target: 600,
    startDate: '2026-05-15',
    endDate: '2026-08-15',
    color: '#2a78d6',
  },
  {
    id: 'transport',
    name: 'Transport Corridors Plan',
    status: 'active',
    channel: 'Online & Workshops',
    submissions: 316,
    target: 400,
    startDate: '2026-06-01',
    endDate: '2026-09-01',
    color: '#1baf7a',
  },
  {
    id: 'natural-hazards',
    name: 'Natural Hazards Overlay',
    status: 'upcoming',
    channel: 'Drop-in Sessions',
    submissions: 0,
    target: 350,
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    color: '#eda100',
  },
  {
    id: 'housing',
    name: 'Housing Intensification Areas',
    status: 'completed',
    channel: 'Online & Hui',
    submissions: 624,
    target: 500,
    startDate: '2026-01-10',
    endDate: '2026-04-10',
    color: '#008300',
  },
  {
    id: 'coastal',
    name: 'Coastal Environment Plan Change',
    status: 'completed',
    channel: 'Community Meetings',
    submissions: 425,
    target: 450,
    startDate: '2025-10-01',
    endDate: '2026-02-28',
    color: '#4a3aa7',
  },
]

export const submissionsOverTime = [
  { month: 'Jan', online: 142, inPerson: 68, written: 34, workshop: 48 },
  { month: 'Feb', online: 186, inPerson: 82, written: 41, workshop: 55 },
  { month: 'Mar', online: 224, inPerson: 96, written: 52, workshop: 72 },
  { month: 'Apr', online: 198, inPerson: 74, written: 38, workshop: 61 },
  { month: 'May', online: 256, inPerson: 108, written: 58, workshop: 84 },
  { month: 'Jun', online: 312, inPerson: 124, written: 64, workshop: 96 },
  { month: 'Jul', online: 348, inPerson: 138, written: 72, workshop: 108 },
]

export const engagementChannels = [
  { channel: 'Online Portal', submissions: 1166, percentage: 63.1 },
  { channel: 'Community Meetings', submissions: 312, percentage: 16.9 },
  { channel: 'Written Submissions', submissions: 189, percentage: 10.2 },
  { channel: 'Workshops & Hui', submissions: 124, percentage: 6.7 },
  { channel: 'Drop-in Sessions', submissions: 56, percentage: 3.1 },
]

export const topicDistribution = [
  { name: 'Housing & Density', value: 28.4, color: '#2a78d6' },
  { name: 'Transport & Access', value: 22.1, color: '#1baf7a' },
  { name: 'Natural Hazards', value: 16.8, color: '#eda100' },
  { name: 'Open Space & Recreation', value: 14.2, color: '#008300' },
  { name: 'Heritage & Character', value: 10.3, color: '#4a3aa7' },
  { name: 'Infrastructure', value: 8.2, color: '#e34948' },
]

export const demographicReach = [
  { group: '18-24', reached: 320, target: 500 },
  { group: '25-34', reached: 580, target: 600 },
  { group: '35-44', reached: 720, target: 650 },
  { group: '45-54', reached: 640, target: 550 },
  { group: '55-64', reached: 480, target: 450 },
  { group: '65+', reached: 340, target: 400 },
]

export const recentFeedback = [
  {
    id: 1,
    consultation: 'Future Development Strategy',
    channel: 'Online Portal',
    summary: 'Supports higher density housing near town centres but concerned about parking provisions.',
    sentiment: 'mixed',
    submittedAt: '2026-07-12T14:30:00Z',
    ward: 'Stoke-Tahunanui',
  },
  {
    id: 2,
    consultation: 'Transport Corridors Plan',
    channel: 'Workshop',
    summary: 'Strong support for dedicated cycling infrastructure on Waimea Road corridor.',
    sentiment: 'positive',
    submittedAt: '2026-07-12T10:15:00Z',
    ward: 'Nelson Central',
  },
  {
    id: 3,
    consultation: 'Future Development Strategy',
    channel: 'Written',
    summary: 'Opposes rezoning of rural-residential land in Marsden Valley for medium density.',
    sentiment: 'negative',
    submittedAt: '2026-07-11T16:45:00Z',
    ward: 'Maitai-Mahitahi',
  },
  {
    id: 4,
    consultation: 'Transport Corridors Plan',
    channel: 'Online Portal',
    summary: 'Requests improved public transport frequency to Atawhai before any road changes.',
    sentiment: 'mixed',
    submittedAt: '2026-07-11T09:00:00Z',
    ward: 'Atawhai-Wakapuaka',
  },
  {
    id: 5,
    consultation: 'Housing Intensification Areas',
    channel: 'Community Meeting',
    summary: 'Welcomes papakāinga provisions and asks for streamlined consenting for iwi-led housing.',
    sentiment: 'positive',
    submittedAt: '2026-07-10T13:20:00Z',
    ward: 'Nelson Central',
  },
]

export const sentimentData = [
  { month: 'Jan', positive: 42, mixed: 35, negative: 23 },
  { month: 'Feb', positive: 48, mixed: 32, negative: 20 },
  { month: 'Mar', positive: 44, mixed: 38, negative: 18 },
  { month: 'Apr', positive: 51, mixed: 30, negative: 19 },
  { month: 'May', positive: 46, mixed: 34, negative: 20 },
  { month: 'Jun', positive: 53, mixed: 28, negative: 19 },
  { month: 'Jul', positive: 55, mixed: 27, negative: 18 },
]
