
//Types
import {
    Photo,
    Competitor,
    Appointment,
    Toolkit,
    RetailAudit,
    PartnerLog,
    SentimentLog,
    Moment,
    ExpenseEntry,
    ExpenditureLine,
    WorkPlanRow,
    Trip,
    FeedPost,
    Account,
    Invitation
} from './types'

// Helper function to generate dates

const getDate = (daysOffset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString();
};

const getDateString = (daysOffset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

// Dummy Photos
const dummyPhotos: Photo[] = [
    { id: 'p1', url: 'https://example.com/photo1.jpg', caption: 'Store front' },
    { id: 'p2', url: 'https://example.com/photo2.jpg', caption: 'Shelf display' },
    { id: 'p3', url: 'https://example.com/photo3.jpg', caption: 'Product packaging' },
    { id: 'p4', url: 'https://example.com/photo4.jpg', caption: 'Competitor shelf' },
    { id: 'p5', url: 'https://example.com/photo5.jpg', caption: 'Meeting with partner' },
];

// Dummy Competitors
const dummyCompetitors: Competitor[] = [
    {
        id: 'c1',
        brand: 'Indomie',
        flavour: 'Mi Goreng Original',
        noodleType: 'Fried',
        price: 'Rp 3,500',
        presence: 'High',
        caption: 'Strong presence in modern trade',
        photo: dummyPhotos[3],
    },
    {
        id: 'c2',
        brand: 'Supermi',
        flavour: 'Chicken',
        noodleType: 'Soup',
        price: 'Rp 2,800',
        presence: 'Medium',
        caption: 'Competitive pricing',
        isDraft: false,
    },
    {
        id: 'c3',
        brand: 'Mie Sedaap',
        flavour: 'Original',
        noodleType: 'Fried',
        price: 'Rp 3,200',
        presence: 'High',
        caption: 'Strong in convenience stores',
        photo: dummyPhotos[0],
    },
];

// Dummy Appointments
const dummyAppointments: Appointment[] = [
    {
        id: 'a1',
        partner: 'PT Indofood',
        date: getDateString(2),
        status: 'confirmed',
        location: 'Jakarta, Indonesia',
        contact: 'Budi Santoso',
        agenda: 'Discuss Q4 distribution targets',
        outcome: 'Agreed on 20% increase',
        notes: 'Follow up on pricing strategy',
    },
    {
        id: 'a2',
        partner: 'PT Mayora',
        date: getDateString(5),
        status: 'pending',
        location: 'Tangerang, Indonesia',
        contact: 'Siti Rahayu',
        agenda: 'New product launch collaboration',
        outcome: '',
        notes: 'Prepare presentation materials',
        isDraft: true,
    },
];

// Dummy Toolkit
const dummyToolkit: Toolkit = {
    items: [
        { id: 't1', label: 'Product samples', checked: true, notes: '5 units of new flavor' },
        { id: 't2', label: 'Presentation deck', checked: true, notes: 'Updated Q3 version' },
        { id: 't3', label: 'Price list', checked: false, notes: 'Need to print' },
        { id: 't4', label: 'Competitor analysis', checked: true, notes: 'Completed' },
    ],
};

// Dummy Retail Audits
const dummyRetailAudits: RetailAudit[] = [
    {
        id: 'r1',
        storeName: 'Supermarket ABC',
        lat: -6.2088,
        lng: 106.8456,
        shelfPrice: 'Rp 3,500',
        promoPrice: 'Rp 3,200',
        category: 'Instant Noodles',
        contactPerson: 'Ibu Ani',
        notes: 'Good visibility, high stock',
        details: [
            { id: 'd1', label: 'Shelf Position', value: 'Middle shelf, eye level' },
            { id: 'd2', label: 'Stock Level', value: '80 units' },
        ],
        photos: [dummyPhotos[1]],
        isDraft: false,
    },
    {
        id: 'r2',
        storeName: 'Mini Market XYZ',
        lat: -6.2146,
        lng: 106.8451,
        shelfPrice: 'Rp 3,700',
        promoPrice: 'Rp 3,400',
        category: 'Instant Noodles',
        contactPerson: 'Pak Joko',
        notes: 'Limited display space',
        details: [
            { id: 'd3', label: 'Shelf Position', value: 'Bottom shelf' },
            { id: 'd4', label: 'Stock Level', value: '30 units' },
        ],
        photos: [dummyPhotos[2]],
        isDraft: true,
    },
];

// Dummy Partner Logs
const dummyPartnerLogs: PartnerLog[] = [
    {
        id: 'pl1',
        partner: 'PT Indofood',
        notes: 'Expressed interest in new product line',
        painPoint: 'Distribution delays in Eastern Indonesia',
        evidence: 'Email correspondence attached',
        photos: [dummyPhotos[4]],
        isDraft: false,
    },
    {
        id: 'pl2',
        partner: 'PT Mayora',
        notes: 'Need to finalize contract terms',
        painPoint: 'Pricing negotiation ongoing',
        evidence: 'Meeting minutes recorded',
        photos: [],
        isDraft: false,
    },
];

// Dummy Sentiment Logs
const dummySentimentLogs: SentimentLog[] = [
    {
        id: 's1',
        note: 'Customers prefer Indomie Mi Goreng over competitors',
        competitor: 'Indomie',
        photos: [dummyPhotos[3]],
        isDraft: false,
    },
    {
        id: 's2',
        note: 'Supermi gaining traction with younger demographic',
        competitor: 'Supermi',
        photos: [],
        isDraft: true,
    },
];

// Dummy Moments
const dummyMoments: Moment[] = [
    {
        id: 'm1',
        createdAt: getDate(-1),
        day: getDateString(-1),
        kind: 'meeting',
        title: 'Product Launch Strategy Meeting',
        note: 'Discussed go-to-market strategy for new flavor',
        location: 'Jakarta Office',
        photos: [dummyPhotos[4]],
        includeInReport: true,
        isDraft: false,
        contact: 'Budi Santoso',
        impression: 'Very professional and collaborative',
        isBusinessMeeting: true,
    },
    {
        id: 'm2',
        createdAt: getDate(-2),
        day: getDateString(-2),
        kind: 'observation',
        title: 'Shelf Placement Observation',
        note: 'Our products placed at eye level, competitor below',
        location: 'Supermarket ABC',
        photos: [dummyPhotos[1]],
        includeInReport: true,
        isDraft: false,
        expiresAt: getDateString(7),
    },
];

// Dummy Expenses
const dummyExpenses: ExpenseEntry[] = [
    {
        id: 'e1',
        createdAt: getDate(-1),
        author: 'John Doe',
        date: getDateString(-1),
        description: 'Hotel stay in Jakarta',
        category: 'Accomodation',
        currency: 'IDR',
        amount: 850000,
        receipt: true,
        notes: '2 nights at Hilton',
        photos: [],
    },
    {
        id: 'e2',
        createdAt: getDate(-2),
        author: 'John Doe',
        date: getDateString(-2),
        description: 'Airport transfer',
        category: 'Transport',
        currency: 'IDR',
        amount: 150000,
        receipt: true,
        notes: 'Taxi from airport to hotel',
        photos: [],
    },
];

// Dummy Expenditure Lines
const dummyExpenditureLines: ExpenditureLine[] = [
    {
        category: 'Airticket',
        idr: 5000000,
        usd: 0,
        local: 0,
        note: 'Round trip Jakarta-Singapore',
    },
    {
        category: 'Hotel Accomodation',
        idr: 8500000,
        usd: 0,
        local: 0,
        note: '3 nights at Grand Hyatt',
    },
    {
        category: 'Meals',
        idr: 1500000,
        usd: 0,
        local: 0,
    },
];

// Dummy Work Plan
const dummyWorkPlan: WorkPlanRow[] = [
    {
        id: 'wp1',
        date: getDateString(1),
        city: 'Jakarta',
        activities: 'Meet with PT Indofood team',
        note: 'Discuss distribution agreement',
    },
    {
        id: 'wp2',
        date: getDateString(2),
        city: 'Bandung',
        activities: 'Retail visits',
        note: 'Visit 5 major supermarkets',
    },
    {
        id: 'wp3',
        date: getDateString(3),
        city: 'Surabaya',
        activities: 'Trade show participation',
        note: 'Set up booth at Food Expo',
    },
];

// Dummy Trip
export const dummyTrip: Trip = {
    id: 'trip1',
    title: 'Indonesia Market Research Q3 2026',
    country: 'Indonesia',
    cities: ['Jakarta', 'Bandung', 'Surabaya'],
    assignee: 'John Doe',
    startDate: getDateString(-3),
    endDate: getDateString(3),
    status: 'in_progress',
    isDraft: false,
    marketIntel: {
        importDuty: '5% - 10% depending on product',
        vat: '11%',
        certifications: 'BPOM registration required',
    },
    competitors: dummyCompetitors,
    appointments: dummyAppointments,
    toolkit: dummyToolkit,
    retailAudits: dummyRetailAudits,
    partnerLogs: dummyPartnerLogs,
    sentiment: dummySentimentLogs,
    postVisitPhotos: [dummyPhotos[0], dummyPhotos[2]],
    moments: dummyMoments,
    report: {
        followUpSent: true,
        forecastVolume: 15000,
        adjustments: 'Increased marketing spend by 10%',
    },
    expenses: dummyExpenses,
    approval: {
        country: 'Indonesia',
        cities: ['Jakarta', 'Bandung', 'Surabaya'],
        startDate: getDateString(-3),
        endDate: getDateString(3),
        days: 6,
        purposes: 'Market research and distributor meetings',
        localCurrency: 'IDR',
        expenditures: dummyExpenditureLines,
        cashInAdvance: { idr: 5000000, usd: 1000, local: 0 },
        workPlan: dummyWorkPlan,
        submitted: true,
        updatedAt: getDate(-5),
    },
};

// Dummy Feed Post
export const dummyFeedPost: FeedPost = {
    id: 'f1',
    author: 'John Doe',
    createdAt: getDate(-1),
    text: 'Just completed a productive meeting with PT Indofood team. Exciting new partnership opportunities ahead!',
    location: 'Jakarta, Indonesia',
    tags: ['#BusinessTrip', '#Partnership', '#FMCG'],
    photos: [dummyPhotos[4]],
    kind: 'meet',
    visibility: 'public',
    tripId: 'trip1',
    tripTitle: 'Indonesia Market Research Q3 2026',
    contact: 'Budi Santoso',
    impression: 'Highly collaborative and forward-thinking',
    replies: [
        {
            id: 'r1',
            author: 'Jane Smith',
            text: 'Great news! Looking forward to the details.',
            createdAt: getDate(-1),
        },
    ],
};

// Dummy Account
export const dummyAccount: Account = {
    id: 'acc1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'hashed_password_here',
    role: 'user',
    createdAt: getDate(-30),
};

// Dummy Invitation
export const dummyInvitation: Invitation = {
    id: 'inv1',
    pin: '123456',
    email: 'new.user@company.com',
    createdAt: getDate(-7),
    used: false,
};

// Complete dummy data export
export const dummyData = {
    trip: dummyTrip,
    feedPost: dummyFeedPost,
    account: dummyAccount,
    invitation: dummyInvitation,
    photos: dummyPhotos,
    competitors: dummyCompetitors,
    appointments: dummyAppointments,
    retailAudits: dummyRetailAudits,
    partnerLogs: dummyPartnerLogs,
    sentimentLogs: dummySentimentLogs,
    moments: dummyMoments,
    expenses: dummyExpenses,
};