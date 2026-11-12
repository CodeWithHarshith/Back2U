import {
  ItemReport,
  CategoryType,
  MatchRecord,
  AppNotification,
  Conversation,
  MessageItem,
  UserProfile,
  DashboardStats,
} from '../types';
import { generatePotentialMatches } from './matching';

export interface CategoryInfo {
  id: CategoryType;
  name: CategoryType;
  icon: string;
  image: string;
  color: string;
  description: string;
}

export const CATEGORIES_LIST: CategoryInfo[] = [
  {
    id: 'Mobile Phones',
    name: 'Mobile Phones',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    color: '#315FEA',
    description: 'Smartphones, iPhones, feature phones & mobile accessories',
  },
  {
    id: 'Wallets',
    name: 'Wallets',
    icon: 'Wallet',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    color: '#D97706',
    description: 'Bifold wallets, cardholders, clutches & purses',
  },
  {
    id: 'Documents',
    name: 'Documents',
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    color: '#2563EB',
    description: 'Aadhaar, PAN cards, Driving licenses, Passports & Certificates',
  },
  {
    id: 'Keys',
    name: 'Keys',
    icon: 'Key',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    color: '#EAB308',
    description: 'Car keys, house keys, key fobs & bike keys',
  },
  {
    id: 'Bags',
    name: 'Bags',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    color: '#9333EA',
    description: 'Handbags, sling bags, shoulder bags & luggage',
  },
  {
    id: 'Backpacks',
    name: 'Backpacks',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    color: '#0D9488',
    description: 'School bags, travel rucksacks & commuter bags',
  },
  {
    id: 'Laptops',
    name: 'Laptops',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    color: '#4F46E5',
    description: 'MacBooks, Windows laptops, tablets & chargers',
  },
  {
    id: 'Jewellery',
    name: 'Jewellery',
    icon: 'Gem',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    color: '#F59E0B',
    description: 'Gold chains, diamond rings, bracelets & earrings',
  },
  {
    id: 'Watches',
    name: 'Watches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    color: '#0284C7',
    description: 'Wristwatches, smartwatches & fitness trackers',
  },
  {
    id: 'Glasses',
    name: 'Glasses',
    icon: 'Glasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    color: '#059669',
    description: 'Prescription spectacles, designer sunglasses & cases',
  },
  {
    id: 'Electronics',
    name: 'Electronics',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    color: '#20C9A7',
    description: 'AirPods, Bluetooth headphones, cameras & power banks',
  },
  {
    id: 'Vehicles',
    name: 'Vehicles',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    color: '#DC2626',
    description: 'Bicycles, motorbikes, scooters & registered vehicles',
  },
  {
    id: 'Pets',
    name: 'Pets',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    color: '#EA580C',
    description: 'Lost dogs, cats, birds with collar details',
  },
  {
    id: 'Missing Persons',
    name: 'Missing Persons',
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    color: '#E11D48',
    description: 'Critical missing person tracings with police report tracking',
  },
  {
    id: 'Other Items',
    name: 'Other Items',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    color: '#64748B',
    description: 'Umbrellas, books, sports equipment & personal gear',
  },
];

const INITIAL_REPORTS: ItemReport[] = [
  {
    id: 'B2U-LST-89210',
    type: 'lost',
    name: 'Samsung Galaxy Phone S23 Ultra',
    category: 'Mobile Phones',
    description: 'Lost my black Samsung Galaxy phone in an auto-rickshaw while commuting from Indiranagar to Koramangala. Contains critical office work SIM and banking apps.',
    photographs: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-10',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'Indiranagar 100ft Road Metro Pillar 140',
    brand: 'Samsung',
    colour: 'Phantom Black',
    identificationFeatures: 'Spigen rugged matte armor cover with a tiny scratch near the S-Pen eject slot',
    reward: '₹3,000',
    contactPreferences: {
      name: 'Sahil Sanveer',
      phone: '+91 98765 43210',
      email: 'sahilsanveer1234@gmail.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Potential Match',
    userId: 'current-user-1',
    reporterName: 'Sahil Sanveer',
    createdAt: '2026-11-10T09:30:00Z',
    updatedAt: '2026-11-11T14:20:00Z',
  },
  {
    id: 'B2U-FND-43810',
    type: 'found',
    name: 'Samsung Galaxy Smartphone in Black Rugged Case',
    category: 'Mobile Phones',
    description: 'Auto driver handed over this black Samsung smartphone found under rear passenger seat after a drop at Indiranagar near the metro station.',
    photographs: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-10',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'CMH Road / Indiranagar Metro Auto Stand',
    brand: 'Samsung',
    colour: 'Black',
    identificationFeatures: 'Locked device with Spigen case and S-Pen slot. Kept safely with station controller.',
    contactPreferences: {
      name: 'Ramesh Gowda',
      phone: '+91 98450 11223',
      email: 'ramesh.gowda@bangaloremetro.in',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Potential Match',
    userId: 'user-ramesh-1',
    reporterName: 'Ramesh Gowda (Metro Security)',
    createdAt: '2026-11-10T11:45:00Z',
    updatedAt: '2026-11-10T11:45:00Z',
  },
  {
    id: 'B2U-LST-89211',
    type: 'lost',
    name: 'Black Leather Tommy Hilfiger Wallet',
    category: 'Wallets',
    description: 'Lost my black wallet containing SBI debit card, original Driving License, Metro Smart Card and some cash. Fell from pocket near coffee counter.',
    photographs: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-09',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'Church Street Blue Tokai Coffee',
    brand: 'Tommy Hilfiger',
    colour: 'Black',
    identificationFeatures: 'Tri-color Hilfiger metal flag on front corner; driving license initials S.S.',
    reward: '₹1,500',
    contactPreferences: {
      name: 'Sahil Sanveer',
      phone: '+91 98765 43210',
      email: 'sahilsanveer1234@gmail.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'current-user-1',
    reporterName: 'Sahil Sanveer',
    createdAt: '2026-11-09T17:15:00Z',
    updatedAt: '2026-11-09T17:15:00Z',
  },
  {
    id: 'B2U-FND-43812',
    type: 'found',
    name: 'Black Men Bifold Wallet',
    category: 'Wallets',
    description: 'Found leather bifold wallet on outdoor patio table after evening rush. Contains multiple bank cards.',
    photographs: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-09',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'Church Street Brigade Junction',
    brand: 'Tommy Hilfiger',
    colour: 'Black',
    identificationFeatures: 'Small metallic emblem on exterior; contains SBI card.',
    contactPreferences: {
      name: 'Karan Mehra',
      phone: '+91 99887 76655',
      email: 'karan@bluetokai.in',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'user-karan-2',
    reporterName: 'Karan Mehra (Store Mgr)',
    createdAt: '2026-11-09T20:00:00Z',
    updatedAt: '2026-11-09T20:00:00Z',
  },
  {
    id: 'B2U-LST-89212',
    type: 'lost',
    name: 'MacBook Air M2 Space Grey with Tech Stickers',
    category: 'Laptops',
    description: 'Left in a black Incase sleeve in cab trunk while going to Mumbai Airport Terminal 2.',
    photographs: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-08',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    landmark: 'Chhatrapati Shivaji Maharaj International Airport T2 Departures',
    brand: 'Apple',
    colour: 'Space Grey',
    identificationFeatures: 'GitHub Octocat sticker and Back2U sticker on the top shell',
    reward: '₹5,000',
    contactPreferences: {
      name: 'Aditi Varma',
      phone: '+91 98200 44556',
      email: 'aditi.v@techventures.co',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'user-aditi-3',
    reporterName: 'Aditi Varma',
    createdAt: '2026-11-08T14:30:00Z',
    updatedAt: '2026-11-08T14:30:00Z',
  },
  {
    id: 'B2U-LST-89213',
    type: 'lost',
    name: 'Aadhaar Card and Indian Passport in Navy Leather Cover',
    category: 'Documents',
    description: 'Lost official documents envelope outside Connaught Place Metro Gate 4.',
    photographs: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-07',
    state: 'Delhi',
    district: 'New Delhi',
    city: 'Delhi',
    landmark: 'Rajiv Chowk / CP Inner Circle Block B',
    brand: 'Government of India',
    colour: 'Navy Blue & White',
    identificationFeatures: 'Holder name initials A.K., passport validity till 2032',
    reward: '₹2,000',
    contactPreferences: {
      name: 'Amit Kumar',
      phone: '+91 98111 22334',
      email: 'amit.delhi@gmail.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Under Verification',
    userId: 'user-amit-4',
    reporterName: 'Amit Kumar',
    createdAt: '2026-11-07T11:00:00Z',
    updatedAt: '2026-11-08T16:00:00Z',
  },
  {
    id: 'B2U-FND-43813',
    type: 'found',
    name: 'Government ID Envelope with Passport',
    category: 'Documents',
    description: 'Found safe navy folder with Aadhaar and Indian passport on passenger bench.',
    photographs: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-07',
    state: 'Delhi',
    district: 'New Delhi',
    city: 'Delhi',
    landmark: 'Rajiv Chowk Metro Gate 4 Helpdesk',
    brand: 'Government of India',
    colour: 'Navy Blue',
    identificationFeatures: 'Deposited with DMRC station staff for claimant identity verification',
    contactPreferences: {
      name: 'Inspector Sunil Rao',
      phone: '+91 99110 55667',
      email: 'sunil.dmrc@gov.in',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Under Verification',
    userId: 'user-sunil-5',
    reporterName: 'Inspector Sunil Rao',
    createdAt: '2026-11-07T13:20:00Z',
    updatedAt: '2026-11-08T16:00:00Z',
  },
  {
    id: 'B2U-LST-89214',
    type: 'lost',
    name: 'Golden Retriever Dog (Bruno)',
    category: 'Pets',
    description: 'Our 2-year-old friendly Golden Retriever Bruno went missing during evening walk near HSR Layout Sector 2 park. Wearing a red collar with brass bell.',
    photographs: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-06',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'HSR Layout Sector 2 BBMP Park',
    brand: 'Golden Retriever',
    colour: 'Golden / Cream',
    identificationFeatures: 'Red nylon collar with small bell and microchip number tag',
    reward: '₹10,000',
    contactPreferences: {
      name: 'Sneha Hegde',
      phone: '+91 97400 88990',
      email: 'sneha.hegde@gmail.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'phone',
    },
    status: 'Resolved',
    userId: 'user-sneha-6',
    reporterName: 'Sneha Hegde',
    createdAt: '2026-11-06T19:00:00Z',
    updatedAt: '2026-11-08T10:00:00Z',
  },
  {
    id: 'B2U-FND-43814',
    type: 'found',
    name: 'Golden Retriever with Red Collar (Safely Handed Over)',
    category: 'Pets',
    description: 'Found friendly retriever roaming near supermarket. Scanned collar tag and successfully reunited with family via Back2U network!',
    photographs: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-07',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'HSR 27th Main Supermarket',
    brand: 'Golden Retriever',
    colour: 'Golden',
    identificationFeatures: 'Red collar safely verified',
    contactPreferences: {
      name: 'Vikram Joshi',
      phone: '+91 98860 33445',
      email: 'vikram.j@gmail.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Resolved',
    userId: 'user-vikram-7',
    reporterName: 'Vikram Joshi',
    createdAt: '2026-11-07T08:30:00Z',
    updatedAt: '2026-11-08T10:00:00Z',
  },
  {
    id: 'B2U-LST-89215',
    type: 'lost',
    name: 'Grandfather Late Shri Ramakant Sharma (Age 74)',
    category: 'Missing Persons',
    isMissingPerson: true,
    personDetails: {
      fullName: 'Ramakant Sharma',
      age: 74,
      gender: 'Male',
      height: "5'7\"",
      clothingDescription: 'White Kurta Pyjama, brown Kolhapuri chappals, reading glasses',
      lastSeenLocation: 'Near Dadar Railway Station West ticket counter',
      medicalConditions: 'Mild dementia / Alzheimer; speaks Hindi & Marathi',
    },
    description: 'Missing since morning temple visit in Dadar. Police FIR filed at Dadar PS. High urgency - family deeply anxious.',
    photographs: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-10',
    state: 'Maharashtra',
    district: 'Mumbai City',
    city: 'Mumbai',
    landmark: 'Dadar Western Railway Station West',
    colour: 'White Kurta',
    identificationFeatures: 'Small silver wrist kada on right arm, black framed glasses',
    reward: '₹25,000',
    contactPreferences: {
      name: 'Nitin Sharma',
      phone: '+91 98210 99887',
      email: 'nitin.sharma@family.org',
      allowDirectCall: true,
      showPhonePublicly: true,
      preferredContactMethod: 'phone',
    },
    status: 'Active',
    userId: 'user-nitin-8',
    reporterName: 'Nitin Sharma (Grandson)',
    createdAt: '2026-11-10T16:00:00Z',
    updatedAt: '2026-11-11T08:00:00Z',
  },
  {
    id: 'B2U-LST-89216',
    type: 'lost',
    name: 'Titan Edge Ceramic Slim Watch',
    category: 'Watches',
    description: 'Black ceramic watch slipped off clasp during metro security check at Chennai Central.',
    photographs: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-09',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    landmark: 'Puratchi Thalaivar Dr. M.G.R Central Metro Station',
    brand: 'Titan',
    colour: 'Matte Black',
    identificationFeatures: 'Titan Edge ultra-slim model with Roman numeral 12',
    reward: '₹2,000',
    contactPreferences: {
      name: 'Karthik Subramanian',
      phone: '+91 94440 67890',
      email: 'karthik.sub@gmail.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'user-karthik-9',
    reporterName: 'Karthik Subramanian',
    createdAt: '2026-11-09T12:00:00Z',
    updatedAt: '2026-11-09T12:00:00Z',
  },
  {
    id: 'B2U-FND-43817',
    type: 'found',
    name: 'Sony WH-1000XM4 Noise Cancelling Headphones',
    category: 'Electronics',
    description: 'Found black over-ear Sony headphones in black carrying case at Cyber Hub food court table.',
    photographs: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    date: '2026-11-11',
    state: 'Haryana',
    district: 'Gurugram',
    city: 'Gurugram',
    landmark: 'DLF Cyber Hub Amphitheatre Area',
    brand: 'Sony',
    colour: 'Black',
    identificationFeatures: 'In original zip case with airplane adapter cable inside mesh pocket',
    contactPreferences: {
      name: 'Ananya Sen',
      phone: '+91 98188 54321',
      email: 'ananya.s@cyberhub.org',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'user-ananya-10',
    reporterName: 'Ananya Sen',
    createdAt: '2026-11-11T13:40:00Z',
    updatedAt: '2026-11-11T13:40:00Z',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    type: 'match',
    title: 'High Potential Match Found!',
    message: 'We found an 89% match for your lost Samsung Galaxy Phone in Bangalore. Check the details and verify ownership.',
    read: false,
    timestamp: '15 mins ago',
    reportId: 'B2U-LST-89210',
    matchId: 'MATCH-89210-43810',
  },
  {
    id: 'NOTIF-2',
    type: 'message',
    title: 'New message from Ramesh Gowda',
    message: '"Hello Sahil, I have the Samsung device found near Indiranagar Metro safe at our control booth."',
    read: false,
    timestamp: '1 hour ago',
    reportId: 'B2U-LST-89210',
  },
  {
    id: 'NOTIF-3',
    type: 'reunion',
    title: 'Reunion Success!',
    message: 'Sneha Hegde successfully reunited with Bruno the Golden Retriever thanks to Back2U community!',
    read: true,
    timestamp: 'Yesterday',
    reportId: 'B2U-LST-89214',
  },
  {
    id: 'NOTIF-4',
    type: 'status',
    title: 'Report Verified',
    message: 'Your report for Tommy Hilfiger Wallet is now active on the national network and shared with local hubs.',
    read: true,
    timestamp: '2 days ago',
    reportId: 'B2U-LST-89211',
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'CONV-1',
    reportId: 'B2U-LST-89210',
    reportName: 'Samsung Galaxy Phone S23 Ultra',
    participantId: 'user-ramesh-1',
    participantName: 'Ramesh Gowda (Metro Security)',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'I have the device in our Indiranagar booth. You can visit with ID proof to unlock and collect it.',
    lastMessageTimestamp: '10:45 AM',
    unreadCount: 1,
  },
  {
    id: 'CONV-2',
    reportId: 'B2U-LST-89211',
    reportName: 'Black Leather Tommy Hilfiger Wallet',
    participantId: 'user-karan-2',
    participantName: 'Karan Mehra (Store Mgr)',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Could you confirm the last 4 digits of the SBI debit card inside?',
    lastMessageTimestamp: 'Yesterday',
    unreadCount: 0,
  },
];

const INITIAL_MESSAGES: Record<string, MessageItem[]> = {
  'CONV-1': [
    {
      id: 'MSG-1',
      conversationId: 'CONV-1',
      senderId: 'user-ramesh-1',
      senderName: 'Ramesh Gowda (Metro Security)',
      text: 'Namaskara! An auto driver brought in a black Samsung Galaxy phone dropped near Indiranagar Metro entrance.',
      timestamp: '10:15 AM',
      read: true,
    },
    {
      id: 'MSG-2',
      conversationId: 'CONV-1',
      senderId: 'current-user-1',
      senderName: 'Sahil Sanveer',
      text: 'Hello Ramesh ji! Yes, that is my phone! It has a black Spigen rugged case with an S-Pen slot.',
      timestamp: '10:20 AM',
      read: true,
    },
    {
      id: 'MSG-3',
      conversationId: 'CONV-1',
      senderId: 'user-ramesh-1',
      senderName: 'Ramesh Gowda (Metro Security)',
      text: 'I have the device in our Indiranagar booth. You can visit with ID proof to unlock and collect it.',
      timestamp: '10:45 AM',
      read: false,
    },
  ],
  'CONV-2': [
    {
      id: 'MSG-4',
      conversationId: 'CONV-2',
      senderId: 'current-user-1',
      senderName: 'Sahil Sanveer',
      text: 'Hi Karan, I saw your found wallet report from Church Street.',
      timestamp: 'Yesterday 6:00 PM',
      read: true,
    },
    {
      id: 'MSG-5',
      conversationId: 'CONV-2',
      senderId: 'user-karan-2',
      senderName: 'Karan Mehra (Store Mgr)',
      text: 'Could you confirm the last 4 digits of the SBI debit card inside?',
      timestamp: 'Yesterday 7:15 PM',
      read: true,
    },
  ],
};

const INITIAL_USER: UserProfile = {
  id: 'current-user-1',
  name: 'Sahil Sanveer',
  email: 'sahilsanveer1234@gmail.com',
  phone: '+91 98765 43210',
  city: 'Bangalore',
  state: 'Karnataka',
  role: 'user', // Can be toggled to 'admin' in UI
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  createdAt: 'January 2026',
  totalReports: 2,
  reunionsCount: 1,
  privacy: {
    maskPhone: true,
    receiveMatchAlerts: true,
    receiveEmailDigests: true,
  },
};

const STORAGE_KEYS = {
  REPORTS: 'back2u_reports_v1',
  MATCHES: 'back2u_matches_v1',
  NOTIFICATIONS: 'back2u_notifications_v1',
  CONVERSATIONS: 'back2u_conversations_v1',
  MESSAGES: 'back2u_messages_v1',
  USER: 'back2u_user_v1',
  SAVED_ITEMS: 'back2u_saved_items_v1',
};

// Safe browser LocalStorage helpers
export function loadStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Storage API
export const StorageService = {
  getReports(): ItemReport[] {
    return loadStoredData<ItemReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  },

  saveReports(reports: ItemReport[]): void {
    saveStoredData(STORAGE_KEYS.REPORTS, reports);
    // Automatically recompute potential matches
    const newMatches = generatePotentialMatches(reports);
    this.saveMatches(newMatches);
  },

  addReport(report: ItemReport): ItemReport {
    const reports = this.getReports();
    const updated = [report, ...reports];
    this.saveReports(updated);

    // If report is found or lost, check for matches and generate notification
    const matches = generatePotentialMatches(updated);
    const relatedMatches = matches.filter(
      (m) => m.lostReportId === report.id || m.foundReportId === report.id
    );

    if (relatedMatches.length > 0) {
      const topMatch = relatedMatches[0];
      const notif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        type: 'match',
        title: `New ${topMatch.matchPercentage}% Match Detected!`,
        message: `An intelligent match was found for "${report.name}". Click to inspect and verify.`,
        read: false,
        timestamp: 'Just now',
        reportId: report.id,
        matchId: topMatch.id,
      };
      this.addNotification(notif);
    }

    return report;
  },

  updateReport(updatedReport: ItemReport): void {
    const reports = this.getReports();
    const next = reports.map((r) => (r.id === updatedReport.id ? updatedReport : r));
    this.saveReports(next);
  },

  deleteReport(reportId: string): void {
    const reports = this.getReports();
    const next = reports.filter((r) => r.id !== reportId);
    this.saveReports(next);
  },

  getMatches(): MatchRecord[] {
    const cached = loadStoredData<MatchRecord[] | null>(STORAGE_KEYS.MATCHES, null);
    if (cached) return cached;
    const reports = this.getReports();
    const generated = generatePotentialMatches(reports);
    saveStoredData(STORAGE_KEYS.MATCHES, generated);
    return generated;
  },

  saveMatches(matches: MatchRecord[]): void {
    saveStoredData(STORAGE_KEYS.MATCHES, matches);
  },

  updateMatchStatus(matchId: string, status: MatchRecord['status']): void {
    const matches = this.getMatches();
    const next = matches.map((m) => (m.id === matchId ? { ...m, status } : m));
    this.saveMatches(next);

    if (status === 'Reunited') {
      const targetMatch = matches.find((m) => m.id === matchId);
      if (targetMatch) {
        // Mark both items as Resolved
        const reports = this.getReports();
        const updated = reports.map((r) =>
          r.id === targetMatch.lostReportId || r.id === targetMatch.foundReportId
            ? { ...r, status: 'Resolved' as const, updatedAt: new Date().toISOString() }
            : r
        );
        this.saveReports(updated);

        // Notify user
        this.addNotification({
          id: `NOTIF-${Date.now()}`,
          type: 'reunion',
          title: 'Item Successfully Reunited!',
          message: 'Congratulations! The item has been marked as safely returned.',
          read: false,
          timestamp: 'Just now',
        });
      }
    }
  },

  getNotifications(): AppNotification[] {
    return loadStoredData<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  saveNotifications(notifs: AppNotification[]): void {
    saveStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  addNotification(notif: AppNotification): void {
    const notifs = this.getNotifications();
    this.saveNotifications([notif, ...notifs]);
  },

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    this.saveNotifications(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  },

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications();
    this.saveNotifications(notifs.map((n) => ({ ...n, read: true })));
  },

  deleteNotification(id: string): void {
    const notifs = this.getNotifications();
    this.saveNotifications(notifs.filter((n) => n.id !== id));
  },

  getConversations(): Conversation[] {
    return loadStoredData<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },

  saveConversations(convs: Conversation[]): void {
    saveStoredData(STORAGE_KEYS.CONVERSATIONS, convs);
  },

  getMessages(conversationId: string): MessageItem[] {
    const all = loadStoredData<Record<string, MessageItem[]>>(
      STORAGE_KEYS.MESSAGES,
      INITIAL_MESSAGES
    );
    return all[conversationId] || [];
  },

  sendMessage(conversationId: string, text: string, senderName: string): MessageItem {
    const all = loadStoredData<Record<string, MessageItem[]>>(
      STORAGE_KEYS.MESSAGES,
      INITIAL_MESSAGES
    );
    const newMsg: MessageItem = {
      id: `MSG-${Date.now()}`,
      conversationId,
      senderId: 'current-user-1',
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    all[conversationId] = [...(all[conversationId] || []), newMsg];
    saveStoredData(STORAGE_KEYS.MESSAGES, all);

    // Update conversation last message
    const convs = this.getConversations();
    const nextConvs = convs.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            lastMessage: text,
            lastMessageTimestamp: 'Just now',
          }
        : c
    );
    this.saveConversations(nextConvs);

    return newMsg;
  },

  getUser(): UserProfile {
    return loadStoredData<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
  },

  saveUser(user: UserProfile): void {
    saveStoredData(STORAGE_KEYS.USER, user);
  },

  getSavedItemIds(): string[] {
    return loadStoredData<string[]>(STORAGE_KEYS.SAVED_ITEMS, ['B2U-LST-89212', 'B2U-FND-43817']);
  },

  toggleSaveItem(itemId: string): boolean {
    const saved = this.getSavedItemIds();
    const isSaved = saved.includes(itemId);
    const updated = isSaved ? saved.filter((id) => id !== itemId) : [...saved, itemId];
    saveStoredData(STORAGE_KEYS.SAVED_ITEMS, updated);
    return !isSaved;
  },

  /**
   * Calculates dynamic statistics strictly from actual database/storage records.
   * "All statistics must be calculated from real database records. Never use fake production statistics."
   */
  calculateStats(): DashboardStats {
    const reports = this.getReports();
    const matches = this.getMatches();
    const notifs = this.getNotifications();

    const totalLost = reports.filter((r) => r.type === 'lost').length;
    const totalFound = reports.filter((r) => r.type === 'found').length;
    const successfullyReunited = reports.filter((r) => r.status === 'Resolved').length;
    const activeReports = reports.filter(
      (r) => r.status === 'Active' || r.status === 'Potential Match' || r.status === 'Under Verification'
    ).length;
    const potentialMatches = matches.filter((m) => m.status === 'Potential').length;
    const unreadNotifications = notifs.filter((n) => !n.read).length;
    const missingPersonsCount = reports.filter((r) => r.isMissingPerson && r.status !== 'Closed').length;

    return {
      totalLost,
      totalFound,
      successfullyReunited,
      activeReports,
      potentialMatches,
      unreadNotifications,
      missingPersonsCount,
    };
  },
};
