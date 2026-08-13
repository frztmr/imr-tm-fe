import { 
  Trip, 
  TripStatus, 
  Photo, 
  MarketIntel, 
  Competitor, 
  Appointment, 
  Toolkit, 
  ToolkitItem,
  RetailAudit, 
  AuditDetail,
  PartnerLog, 
  SentimentLog, 
  TripReport, 
  ExpenditureCategory,
  ExpenditureLine,
  WorkPlanRow,
  TripApproval,
  Moment,
  MomentKind,
  ApprovalFile,
  ExpenseEntry,
  ExpenseCategory,
  ExpenseCurrency,
  FeedPost,
  PostReply,
  Poll,
  PollOption,
  Account,
  Invitation
} from './types';

// Helper to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatDateTime = (date: Date) => date.toISOString();

// Sample photos
export const mockPhotos: Photo[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Product display' },
  { id: '2', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Store entrance' },
  { id: '3', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Competitor shelf' },
  { id: '4', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Meeting room' },
  { id: '5', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Product packaging' },
  { id: '6', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Receipt' },
  { id: '7', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Hotel room' },
  { id: '8', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Poll result' },
];

// Mock MarketIntel
export const mockMarketIntel: MarketIntel = {
  importDuty: '15%',
  vat: '10%',
  certifications: 'ISO 9001, Halal, FDA',
};

// Mock Competitors
export const mockCompetitors: Competitor[] = [
  {
    id: '1',
    brand: 'Indomie',
    flavour: 'Chicken',
    noodleType: 'Instant',
    price: '$1.50',
    presence: 'High',
    caption: 'Popular local brand',
    photo: mockPhotos[0],
    isDraft: false,
  },
  {
    id: '2',
    brand: 'Nissin',
    flavour: 'Beef',
    noodleType: 'Cup',
    price: '$2.00',
    presence: 'Medium',
    caption: 'International brand',
    photo: mockPhotos[2],
    isDraft: false,
  },
  {
    id: '3',
    brand: 'Samyang',
    flavour: 'Spicy',
    noodleType: 'Instant',
    price: '$2.50',
    presence: 'Growing',
    caption: 'Korean brand gaining traction',
    isDraft: true,
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    partner: 'PT. Indofood',
    date: '2026-08-15',
    status: 'confirmed',
    location: 'Jakarta, Indonesia',
    contact: '+62 812-3456-7890',
    agenda: 'Product distribution discussion',
    outcome: 'Agreed on trial shipment',
    notes: 'Positive meeting',
    isDraft: false,
  },
  {
    id: '2',
    partner: 'Walmart Indonesia',
    date: '2026-08-16',
    status: 'pending',
    location: 'Jakarta, Indonesia',
    contact: '+62 819-8765-4321',
    agenda: 'Shelf space negotiation',
    outcome: 'Pending approval',
    notes: 'Follow up next week',
    isDraft: false,
  },
  {
    id: '3',
    partner: 'Carrefour',
    date: '2026-08-18',
    status: 'cancelled',
    location: 'Bandung, Indonesia',
    contact: '+62 817-2345-6789',
    agenda: 'Promotion planning',
    outcome: 'Rescheduled',
    notes: 'Need to reschedule',
    isDraft: true,
  },
];

// Mock Toolkit
export const mockToolkitItems: ToolkitItem[] = [
  { id: '1', label: 'Product Samples', checked: true, notes: '10 units each' },
  { id: '2', label: 'Price List', checked: true, notes: 'Updated version' },
  { id: '3', label: 'Marketing Materials', checked: false, notes: 'Brochures and flyers' },
  { id: '4', label: 'Laptop', checked: true, notes: 'For presentations' },
  { id: '5', label: 'Camera', checked: false, notes: 'For product photos' },
];

export const mockToolkit: Toolkit = {
  items: mockToolkitItems,
};

// Mock Audit Details
export const mockAuditDetails: AuditDetail[] = [
  { id: '1', label: 'Shelf Position', value: 'Eye level' },
  { id: '2', label: 'Stock Level', value: 'Adequate' },
  { id: '3', label: 'Promotion', value: 'Buy 1 Get 1 Free' },
  { id: '4', label: 'Availability', value: 'High' },
];

// Mock Retail Audits
export const mockRetailAudits: RetailAudit[] = [
  {
    id: '1',
    storeName: 'Supermarket ABC',
    lat: -6.2088,
    lng: 106.8456,
    shelfPrice: '$2.50',
    promoPrice: '$1.99',
    category: 'Instant Noodles',
    contactPerson: 'Jane Doe',
    notes: 'Good visibility',
    details: mockAuditDetails,
    photos: [mockPhotos[0], mockPhotos[3]],
    isDraft: false,
  },
  {
    id: '2',
    storeName: 'Mini Mart XYZ',
    lat: -6.2146,
    lng: 106.8451,
    shelfPrice: '$2.75',
    promoPrice: '$2.25',
    category: 'Cup Noodles',
    contactPerson: 'John Smith',
    notes: 'Limited shelf space',
    details: mockAuditDetails,
    photos: [mockPhotos[2]],
    isDraft: true,
  },
];

// Mock Partner Logs
export const mockPartnerLogs: PartnerLog[] = [
  {
    id: '1',
    partner: 'PT. Indofood',
    notes: 'Interested in new product line',
    painPoint: 'Distribution logistics',
    evidence: 'Email correspondence',
    photos: [mockPhotos[4]],
    isDraft: false,
  },
  {
    id: '2',
    partner: 'Walmart Indonesia',
    notes: 'Demanding better pricing',
    painPoint: 'Price sensitivity',
    evidence: 'Meeting minutes',
    photos: [mockPhotos[1]],
    isDraft: false,
  },
];

// Mock Sentiment Logs
export const mockSentimentLogs: SentimentLog[] = [
  {
    id: '1',
    note: 'Consumers prefer spicy variants',
    competitor: 'Samyang',
    photos: [mockPhotos[2]],
    isDraft: false,
  },
  {
    id: '2',
    note: 'Price perception is key differentiator',
    competitor: 'Indomie',
    photos: [],
    isDraft: false,
  },
];

// Mock Post-Visit Photos
export const mockPostVisitPhotos: Photo[] = [
  { id: '9', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Overall store view' },
  { id: '10', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', caption: 'Competitive landscape' },
];

// Mock Moments
export const mockMoments: Moment[] = [
  {
    id: '1',
    createdAt: formatDateTime(new Date()),
    day: '2026-08-15',
    kind: 'meeting',
    title: 'Product Launch Meeting',
    note: 'Discussed Q4 product launch strategy',
    location: 'Jakarta, Indonesia',
    photos: [mockPhotos[3]],
    includeInReport: true,
    isDraft: false,
    contact: 'Michael Chen, Marketing Director',
    impression: 'Very enthusiastic about our product',
    isBusinessMeeting: true,
  },
  {
    id: '2',
    createdAt: formatDateTime(new Date()),
    day: '2026-08-16',
    kind: 'observation',
    title: 'Market Observation',
    note: 'Consumers showing interest in premium products',
    location: 'Bandung, Indonesia',
    photos: [mockPhotos[0]],
    includeInReport: true,
    isDraft: false,
    expiresAt: '2026-09-16',
  },
  {
    id: '3',
    createdAt: formatDateTime(new Date()),
    day: '2026-08-17',
    kind: 'retail',
    title: 'Retail Visit',
    note: 'Checked shelf placement and pricing',
    location: 'Surabaya, Indonesia',
    photos: [mockPhotos[1]],
    includeInReport: false,
    isDraft: true,
  },
];

// Mock Trip Report
export const mockTripReport: TripReport = {
  followUpSent: true,
  forecastVolume: 50000,
  adjustments: 'Increase production capacity by 20%',
};

// Mock Expenditure Lines
export const mockExpenditureLines: ExpenditureLine[] = [
  { category: 'Airticket', idr: 5000000, usd: 350, local: 0, note: 'Round trip' },
  { category: 'Visa', idr: 1500000, usd: 100, local: 0 },
  { category: 'Hotel Accomodation', idr: 8000000, usd: 560, local: 0, note: '3 nights' },
  { category: 'Meals', idr: 3000000, usd: 210, local: 0 },
  { category: 'Simcard', idr: 200000, usd: 14, local: 0 },
  { category: 'Transport', idr: 2500000, usd: 175, local: 0 },
  { category: 'Daily Allowance', idr: 4500000, usd: 315, local: 0 },
  { category: 'Others', idr: 1000000, usd: 70, local: 0, note: 'Miscellaneous' },
];

// Mock Work Plan Rows
export const mockWorkPlanRows: WorkPlanRow[] = [
  { id: '1', date: '2026-08-15', city: 'Jakarta', activities: 'Visit distributor, Product presentation', note: 'Confirm meeting' },
  { id: '2', date: '2026-08-16', city: 'Bandung', activities: 'Retail store visits, Customer interviews', note: 'Bring samples' },
  { id: '3', date: '2026-08-17', city: 'Surabaya', activities: 'Partnership meeting, Market survey', note: 'Prepare proposal' },
];

// Mock Trip Approval
export const mockTripApproval: TripApproval = {
  country: 'Indonesia',
  cities: ['Jakarta', 'Bandung', 'Surabaya'],
  startDate: '2026-08-15',
  endDate: '2026-08-17',
  days: 3,
  purposes: 'Market research and partnership development',
  localCurrency: 'IDR',
  expenditures: mockExpenditureLines,
  cashInAdvance: { idr: 15000000, usd: 1000, local: 0 },
  workPlan: mockWorkPlanRows,
  submitted: true,
  updatedAt: formatDateTime(new Date()),
};

// Mock Approval File
export const mockApprovalFile: ApprovalFile = {
  name: 'Business_Trip_Approval_Indonesia_Aug2026.pdf',
  dataUrl: 'data:application/pdf;base64,...',
  uploadedAt: formatDateTime(new Date()),
};

// Mock Expense Entries (NEW)
export const mockExpenses: ExpenseEntry[] = [
  {
    id: '1',
    createdAt: formatDateTime(new Date('2026-08-15')),
    author: 'John Doe',
    date: '2026-08-15',
    description: 'Hotel stay in Jakarta',
    category: 'Accomodation',
    currency: 'IDR',
    amount: 2500000,
    receipt: true,
    notes: '3 nights at Grand Hotel',
    photos: [mockPhotos[7]],
  },
  {
    id: '2',
    createdAt: formatDateTime(new Date('2026-08-16')),
    author: 'John Doe',
    date: '2026-08-16',
    description: 'Business lunch with partners',
    category: 'Meals',
    currency: 'USD',
    amount: 45.50,
    receipt: true,
    notes: 'Met with Indofood team',
    photos: [mockPhotos[6]],
  },
  {
    id: '3',
    createdAt: formatDateTime(new Date('2026-08-17')),
    author: 'John Doe',
    date: '2026-08-17',
    description: 'Taxi to airport',
    category: 'Transport',
    currency: 'IDR',
    amount: 350000,
    receipt: false,
    notes: 'Blue Bird taxi',
    photos: [],
  },
  {
    id: '4',
    createdAt: formatDateTime(new Date('2026-08-15')),
    author: 'Jane Smith',
    date: '2026-08-15',
    description: 'Visa processing fee',
    category: 'Visa',
    currency: 'USD',
    amount: 150,
    receipt: true,
    notes: 'Business visa for Vietnam',
    photos: [mockPhotos[6]],
  },
  {
    id: '5',
    createdAt: formatDateTime(new Date('2026-08-16')),
    author: 'Jane Smith',
    date: '2026-08-16',
    description: 'Local SIM card',
    category: 'Communication',
    currency: 'LOCAL',
    localCurrency: 'VND',
    amount: 200000,
    receipt: true,
    notes: 'Vietnam mobile data',
    photos: [],
  },
  {
    id: '6',
    createdAt: formatDateTime(new Date('2026-08-17')),
    author: 'Jane Smith',
    date: '2026-08-17',
    description: 'Entertainment with clients',
    category: 'Entertainment',
    currency: 'USD',
    amount: 78.25,
    receipt: true,
    notes: 'Dinner with distributors',
    photos: [mockPhotos[7]],
  },
  {
    id: '7',
    createdAt: formatDateTime(new Date('2026-08-18')),
    author: 'Alex Johnson',
    date: '2026-08-18',
    description: 'Promotional materials printing',
    category: 'Promotion',
    currency: 'IDR',
    amount: 1500000,
    receipt: true,
    notes: 'Brochures and flyers for launch',
    photos: [mockPhotos[6]],
  },
  {
    id: '8',
    createdAt: formatDateTime(new Date('2026-08-19')),
    author: 'Alex Johnson',
    date: '2026-08-19',
    description: 'Laundry service',
    category: 'Laundry',
    currency: 'IDR',
    amount: 150000,
    receipt: false,
    notes: 'Hotel laundry',
    photos: [],
  },
];

// Mock Poll Options and Polls (NEW)
export const mockPollOptions: PollOption[] = [
  {
    id: '1',
    label: 'Excellent',
    votes: ['John Doe', 'Jane Smith', 'Alex Johnson'],
  },
  {
    id: '2',
    label: 'Good',
    votes: ['Sarah Lee', 'Mike Johnson'],
  },
  {
    id: '3',
    label: 'Average',
    votes: ['Lisa Chen'],
  },
  {
    id: '4',
    label: 'Poor',
    votes: [],
  },
];

export const mockPoll: Poll = {
  question: 'How would you rate the product launch event?',
  options: mockPollOptions,
  closesAt: '2026-09-15',
};

export const mockPoll2: Poll = {
  question: 'Which market should we prioritize next?',
  options: [
    {
      id: '5',
      label: 'Philippines',
      votes: ['John Doe', 'Sarah Lee'],
    },
    {
      id: '6',
      label: 'Malaysia',
      votes: ['Alex Johnson'],
    },
    {
      id: '7',
      label: 'Singapore',
      votes: ['Jane Smith', 'Mike Johnson', 'Lisa Chen'],
    },
  ],
  closesAt: '2026-10-01',
};

// Mock Feed Posts with new fields
export const mockFeedPosts: FeedPost[] = [
  {
    id: '1',
    author: 'John Doe',
    createdAt: formatDateTime(new Date()),
    text: 'Just landed in Jakarta! Ready for an exciting week of market research.',
    location: 'Jakarta, Indonesia',
    tags: ['Indonesia', 'MarketResearch', 'BusinessTrip'],
    photos: [mockPhotos[0]],
    kind: 'post',
    visibility: 'public',
    tripId: '1',
    tripTitle: 'Indonesia Market Research Trip',
    replies: [
      {
        id: '1',
        author: 'Sarah Lee',
        text: 'Good luck with the research!',
        createdAt: formatDateTime(new Date()),
        photos: [],
      },
    ],
  },
  {
    id: '2',
    author: 'Jane Smith',
    createdAt: formatDateTime(new Date()),
    text: 'Product launch in Vietnam was a huge success! Great team effort.',
    location: 'Ho Chi Minh City, Vietnam',
    tags: ['Vietnam', 'ProductLaunch', 'Success'],
    photos: [mockPhotos[3], mockPhotos[4]],
    kind: 'meet',
    visibility: 'public',
    tripId: '2',
    tripTitle: 'Vietnam Product Launch',
    contact: 'Mai Nguyen',
    impression: 'Excellent partnership potential',
    replies: [
      {
        id: '2',
        author: 'Mike Johnson',
        text: 'Congratulations! This is amazing news.',
        createdAt: formatDateTime(new Date()),
        photos: [],
      },
      {
        id: '3',
        author: 'Lisa Chen',
        text: 'I heard the market response was very positive!',
        createdAt: formatDateTime(new Date()),
        photos: [],
      },
    ],
  },
  {
    id: '3',
    author: 'Alex Johnson',
    createdAt: formatDateTime(new Date()),
    text: 'Observing market trends in Thailand. Interesting consumer behavior patterns.',
    location: 'Bangkok, Thailand',
    tags: ['Thailand', 'MarketObservation', 'ConsumerInsights'],
    photos: [mockPhotos[2]],
    kind: 'see',
    visibility: 'public',
    tripId: '3',
    tripTitle: 'Thailand Supplier Visit',
    expiresAt: '2026-10-01',
    replies: [],
  },
  {
    id: '4',
    author: 'John Doe',
    createdAt: formatDateTime(new Date('2026-08-15')),
    text: 'Submitted my expense report for the Indonesia trip.',
    location: 'Jakarta, Indonesia',
    tags: ['Expenses', 'Indonesia'],
    photos: [mockPhotos[6]],
    kind: 'expense',
    visibility: 'restricted',
    allowedViewers: ['Jane Smith', 'Alex Johnson'],
    tripId: '1',
    tripTitle: 'Indonesia Market Research Trip',
    replies: [],
  },
  {
    id: '5',
    author: 'Sarah Lee',
    createdAt: formatDateTime(new Date('2026-08-16')),
    text: 'Just arrived in Singapore. Excited to explore the market here!',
    location: 'Singapore',
    tags: ['Singapore', 'MarketResearch'],
    photos: [mockPhotos[1]],
    kind: 'feeling',
    visibility: 'public',
    rating: 5,
    replies: [
      {
        id: '4',
        author: 'John Doe',
        text: 'Enjoy Singapore! The food is amazing.',
        createdAt: formatDateTime(new Date()),
        photos: [],
      },
    ],
  },
  {
    id: '6',
    author: 'Team Lead',
    createdAt: formatDateTime(new Date('2026-08-17')),
    text: 'Please share your feedback on the recent product launch.',
    location: 'Virtual',
    tags: ['Feedback', 'ProductLaunch'],
    photos: [],
    kind: 'poll',
    visibility: 'public',
    poll: mockPoll,
    replies: [
      {
        id: '5',
        author: 'John Doe',
        text: 'Voted! Great event overall.',
        createdAt: formatDateTime(new Date()),
        photos: [],
      },
    ],
  },
  {
    id: '7',
    author: 'Alex Johnson',
    createdAt: formatDateTime(new Date('2026-08-18')),
    text: 'Feeling optimistic about the Thai market.',
    location: 'Bangkok, Thailand',
    tags: ['Thailand', 'Optimism'],
    photos: [mockPhotos[5]],
    kind: 'feeling',
    visibility: 'public',
    rating: 4,
    tripId: '3',
    tripTitle: 'Thailand Supplier Visit',
    replies: [],
  },
  {
    id: '8',
    author: 'Jane Smith',
    createdAt: formatDateTime(new Date('2026-08-19')),
    text: 'Which market should we prioritize for Q4?',
    location: 'Ho Chi Minh City, Vietnam',
    tags: ['Strategy', 'Q4', 'MarketPriority'],
    photos: [],
    kind: 'poll',
    visibility: 'public',
    poll: mockPoll2,
    tripId: '2',
    tripTitle: 'Vietnam Product Launch',
    replies: [],
  },
];

// Mock Accounts
export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword1',
    role: 'admin',
    createdAt: formatDateTime(new Date()),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'hashedpassword2',
    role: 'user',
    createdAt: formatDateTime(new Date()),
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: 'hashedpassword3',
    role: 'user',
    createdAt: formatDateTime(new Date()),
  },
  {
    id: '4',
    name: 'Sarah Lee',
    email: 'sarah.lee@example.com',
    password: 'hashedpassword4',
    role: 'user',
    createdAt: formatDateTime(new Date()),
  },
  {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: 'hashedpassword5',
    role: 'user',
    createdAt: formatDateTime(new Date()),
  },
];

// Mock Invitations
export const mockInvitations: Invitation[] = [
  {
    id: '1',
    pin: '123456',
    email: 'new.user1@example.com',
    createdAt: formatDateTime(new Date()),
    used: false,
  },
  {
    id: '2',
    pin: '789012',
    email: 'new.user2@example.com',
    createdAt: formatDateTime(new Date()),
    used: true,
  },
  {
    id: '3',
    pin: '345678',
    email: 'new.user3@example.com',
    createdAt: formatDateTime(new Date()),
    used: false,
  },
  {
    id: '4',
    pin: '901234',
    email: 'new.user4@example.com',
    createdAt: formatDateTime(new Date()),
    used: false,
  },
];

// Main Mock Trips with expenses
export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Indonesia Market Research Trip',
    country: 'Indonesia',
    cities: ['Jakarta', 'Bandung', 'Surabaya'],
    assignee: 'John Doe',
    startDate: '2026-08-15',
    endDate: '2026-08-17',
    status: 'planned',
    isDraft: false,
    marketIntel: mockMarketIntel,
    competitors: mockCompetitors,
    appointments: mockAppointments,
    toolkit: mockToolkit,
    retailAudits: mockRetailAudits,
    partnerLogs: mockPartnerLogs,
    sentiment: mockSentimentLogs,
    postVisitPhotos: mockPostVisitPhotos,
    moments: mockMoments,
    report: mockTripReport,
    expenses: mockExpenses.slice(0, 3),
    approval: mockTripApproval,
    approvalFile: mockApprovalFile,
  },
  {
    id: '2',
    title: 'Vietnam Product Launch',
    country: 'Vietnam',
    cities: ['Ho Chi Minh City', 'Hanoi'],
    assignee: 'Jane Smith',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    status: 'completed',
    isDraft: false,
    marketIntel: {
      importDuty: '10%',
      vat: '8%',
      certifications: 'ISO, Halal',
    },
    competitors: [
      {
        id: '4',
        brand: 'Acecook',
        flavour: 'Shrimp',
        noodleType: 'Instant',
        price: '$1.20',
        presence: 'High',
        caption: 'Market leader in Vietnam',
        photo: mockPhotos[0],
        isDraft: false,
      },
    ],
    appointments: [
      {
        id: '4',
        partner: 'Vietnam Distributors Ltd.',
        date: '2026-07-11',
        status: 'confirmed',
        location: 'Ho Chi Minh City, Vietnam',
        contact: '+84 912-345-6789',
        agenda: 'Launch planning',
        outcome: 'Approved product line',
        notes: 'Successful launch',
        isDraft: false,
      },
    ],
    toolkit: {
      items: [
        { id: '6', label: 'Product samples', checked: true, notes: 'All variants' },
        { id: '7', label: 'Marketing materials', checked: true, notes: 'Vietnamese translations' },
      ],
    },
    retailAudits: [
      {
        id: '3',
        storeName: 'Big C Vietnam',
        lat: 10.8231,
        lng: 106.6297,
        shelfPrice: '$1.50',
        promoPrice: '$1.20',
        category: 'Noodles',
        contactPerson: 'Mai Nguyen',
        notes: 'Good placement',
        details: [
          { id: '5', label: 'Visibility', value: 'Excellent' },
          { id: '6', label: 'Stock', value: 'Full' },
        ],
        photos: [mockPhotos[1]],
        isDraft: false,
      },
    ],
    partnerLogs: [],
    sentiment: [],
    postVisitPhotos: [mockPhotos[4]],
    moments: [
      {
        id: '4',
        createdAt: formatDateTime(new Date()),
        day: '2026-07-11',
        kind: 'meeting',
        title: 'Launch Kickoff',
        note: 'Product officially launched in Vietnam',
        location: 'Ho Chi Minh City',
        photos: [mockPhotos[3]],
        includeInReport: true,
        isDraft: false,
        contact: 'Sales Team',
        impression: 'Positive reception',
        isBusinessMeeting: true,
      },
    ],
    report: {
      followUpSent: true,
      forecastVolume: 75000,
      adjustments: 'Adjust packaging for local preferences',
    },
    expenses: mockExpenses.slice(3, 6),
    approval: {
      country: 'Vietnam',
      cities: ['Ho Chi Minh City', 'Hanoi'],
      startDate: '2026-07-10',
      endDate: '2026-07-15',
      days: 6,
      purposes: 'Product launch',
      localCurrency: 'VND',
      expenditures: [
        { category: 'Airticket', idr: 4000000, usd: 280, local: 0 },
        { category: 'Hotel Accomodation', idr: 6000000, usd: 420, local: 0 },
        { category: 'Meals', idr: 2500000, usd: 175, local: 0 },
      ],
      cashInAdvance: { idr: 12000000, usd: 840, local: 0 },
      workPlan: [
        { id: '4', date: '2026-07-10', city: 'Ho Chi Minh City', activities: 'Arrival, Setup', note: '' },
        { id: '5', date: '2026-07-11', city: 'Ho Chi Minh City', activities: 'Launch event', note: 'Main day' },
      ],
      submitted: true,
      updatedAt: formatDateTime(new Date()),
    },
  },
  {
    id: '3',
    title: 'Thailand Supplier Visit',
    country: 'Thailand',
    cities: ['Bangkok', 'Chiang Mai'],
    assignee: 'Alex Johnson',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    status: 'planned',
    isDraft: true,
    marketIntel: {
      importDuty: '12%',
      vat: '7%',
      certifications: 'GMP, Halal',
    },
    competitors: [],
    appointments: [],
    toolkit: { items: [] },
    retailAudits: [],
    partnerLogs: [],
    sentiment: [],
    postVisitPhotos: [],
    moments: [],
    report: {
      followUpSent: false,
      forecastVolume: 0,
      adjustments: '',
    },
    expenses: mockExpenses.slice(6, 8),
    approvalFile: mockApprovalFile,
  },
];

// Export all mock data as a single object
export const mockData = {
  photos: mockPhotos,
  marketIntel: mockMarketIntel,
  competitors: mockCompetitors,
  appointments: mockAppointments,
  toolkit: mockToolkit,
  retailAudits: mockRetailAudits,
  partnerLogs: mockPartnerLogs,
  sentimentLogs: mockSentimentLogs,
  postVisitPhotos: mockPostVisitPhotos,
  moments: mockMoments,
  tripReport: mockTripReport,
  tripApproval: mockTripApproval,
  expenses: mockExpenses,
  polls: [mockPoll, mockPoll2],
  pollOptions: mockPollOptions,
  feedPosts: mockFeedPosts,
  accounts: mockAccounts,
  invitations: mockInvitations,
  trips: mockTrips,
};

export default mockData;