import type { Source } from '../types';

/**
 * Source registry. Every fact in the knowledge base points at one or more of these.
 * NOTE: the build sandbox could not reach these hosts (network policy), so each URL
 * must be re-checked with `pnpm check:links` before the pitch. See HERITAGE_SOURCES.md.
 */
export const SOURCES: Record<string, Source> = {
  'dubaiculture-alfahidi': {
    id: 'dubaiculture-alfahidi',
    title: 'Al Fahidi Historical Neighbourhood',
    publisher: 'Dubai Culture & Arts Authority',
    url: 'https://dubaiculture.gov.ae/en/attractions/heritage-sites/al-fahidi-historical-neighbourhood/',
    type: 'official',
    supports: 'Location, history, building materials (stone, gypsum, teak, sandalwood, palm fronds and palm wood) and present-day use of Al Fahidi.',
  },
  'dubaiculture': {
    id: 'dubaiculture',
    title: 'Dubai Culture & Arts Authority — heritage sites',
    publisher: 'Dubai Culture & Arts Authority',
    url: 'https://dubaiculture.gov.ae/en/',
    type: 'official',
    supports: 'Al Fahidi heritage district and its cultural institutions.',
  },
  'culturalmap': {
    id: 'culturalmap',
    title: 'UAE Cultural Map',
    publisher: 'UAE Ministry of Culture',
    url: 'https://culturalmap.gov.ae/',
    type: 'official',
    supports: 'National register of UAE heritage sites used as a design and fact reference.',
  },
  'smccu': {
    id: 'smccu',
    title: 'Sheikh Mohammed Centre for Cultural Understanding',
    publisher: 'SMCCU',
    url: 'https://cultures.ae/',
    type: 'official',
    supports: 'Cultural centre in Al Fahidi; Emirati hospitality and coffee customs.',
  },
  'windcatcher-ref': {
    id: 'windcatcher-ref',
    title: 'Windcatcher (overview of passive ventilation principle)',
    publisher: 'Wikipedia (secondary reference)',
    url: 'https://en.wikipedia.org/wiki/Windcatcher',
    type: 'secondary',
    supports: 'General building-physics explanation of how wind towers ventilate.',
  },
  'unesco-coffee': {
    id: 'unesco-coffee',
    title: 'Arabic coffee, a symbol of generosity (inscribed 2015, extended 2024)',
    publisher: 'UNESCO Intangible Cultural Heritage',
    url: 'https://ich.unesco.org/en/RL/01074',
    type: 'unesco',
    supports: 'Arabic coffee preparation and serving customs; 2015 inscription (UAE, Saudi Arabia, Oman, Qatar), extended to more States in 2024 (record No. 01074).',
  },
  'unesco-majlis': {
    id: 'unesco-majlis',
    title: 'Majlis, a cultural and social space (inscribed 2015)',
    publisher: 'UNESCO Intangible Cultural Heritage',
    url: 'https://ich.unesco.org/en/RL/01076',
    type: 'unesco',
    supports: 'Role of the majlis as a gathering space; 2015 inscription.',
  },
  'cbuae-coins': {
    id: 'cbuae-coins',
    title: 'UAE currency — coins',
    publisher: 'Central Bank of the UAE',
    url: 'https://www.centralbank.ae/en/our-operations/currency/',
    type: 'official',
    supports: 'Design of the UAE one-dirham coin.',
  },
  'szgmc': {
    id: 'szgmc',
    title: 'Sheikh Zayed Grand Mosque Centre',
    publisher: 'Sheikh Zayed Grand Mosque Centre (official)',
    url: 'https://www.szgmc.gov.ae/en/',
    type: 'official',
    supports: 'Architecture, dimensions, carpet, chandeliers, lighting, visiting and dress code.',
  },
  'szgmc-domes': {
    id: 'szgmc-domes',
    title: 'Islamic architecture — The Domes',
    publisher: 'Sheikh Zayed Grand Mosque Centre (official)',
    url: 'https://szgmc.gov.ae/en/islamic-architecture/the-domes',
    type: 'official',
    supports: 'The 82 domes of the mosque.',
  },
  'szgmc-chandeliers': {
    id: 'szgmc-chandeliers',
    title: 'Islamic architecture — The Chandeliers',
    publisher: 'Sheikh Zayed Grand Mosque Centre (official)',
    url: 'https://szgmc.gov.ae/en/islamic-architecture/the-chandeliers',
    type: 'official',
    supports: 'The seven chandeliers of the mosque.',
  },
  'unesco-alain': {
    id: 'unesco-alain',
    title: 'Cultural Sites of Al Ain (Hafit, Hili, Bidaa Bint Saud and Oases Areas)',
    publisher: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1343',
    type: 'unesco',
    supports: 'World Heritage inscription (2011), falaj irrigation and archaeological sites of Al Ain.',
  },
  'visitabudhabi': {
    id: 'visitabudhabi',
    title: 'Visit Abu Dhabi',
    publisher: 'Department of Culture and Tourism — Abu Dhabi',
    url: 'https://visitabudhabi.ae/en',
    type: 'official',
    supports: 'Visitor information for Abu Dhabi heritage sites, including Al Ain Oasis.',
  },
};
