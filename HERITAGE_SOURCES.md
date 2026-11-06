# Heritage sources

Every NAZAR answer links to one or more of these sources (`packages/core/src/knowledge/sources.ts`).

**Verification status (6 Nov 2026).** The build sandbox's network policy blocks these hosts, so the pages could not be opened directly. The key facts and URLs were cross-checked through web search instead. Before the pitch, run this on an open network:

```bash
pnpm check:links
```

| ID | Source | Type | Used for | Status |
|---|---|---|---|---|
| `dubaiculture-alfahidi` | [Dubai Culture — Al Fahidi Historical Neighbourhood](https://dubaiculture.gov.ae/en/attractions/heritage-sites/al-fahidi-historical-neighbourhood/) | Official | Location, history, materials ("stone, gypsum, teak, sandalwood, fronds and palm wood") | URL and wording confirmed via search |
| `culturalmap` | [UAE Cultural Map](https://culturalmap.gov.ae/) | Official | Design reference | Root URL |
| `smccu` | [Sheikh Mohammed Centre for Cultural Understanding](https://cultures.ae/) | Official | Centre in Al Fahidi; hospitality customs | Not re-verified |
| `windcatcher-ref` | [Windcatcher — Wikipedia](https://en.wikipedia.org/wiki/Windcatcher) | Secondary | General ventilation physics | Labelled *Ref* in the UI |
| `unesco-coffee` | [UNESCO ICH — Arabic coffee, a symbol of generosity (No. 01074)](https://ich.unesco.org/en/RL/01074) | UNESCO | Customs; 2015 inscription (UAE, Saudi Arabia, Oman, Qatar), extended in 2024 | Confirmed via search |
| `unesco-majlis` | [UNESCO ICH — Majlis, a cultural and social space (No. 01076)](https://ich.unesco.org/en/RL/01076) | UNESCO | Role of the majlis; 2015 inscription | Confirmed via search |
| `cbuae-coins` | [Central Bank of the UAE — currency](https://www.centralbank.ae/en/our-operations/currency/) | Official | Dallah on the 1-dirham coin | Not re-verified (verify the exact page) |
| `szgmc` | [Sheikh Zayed Grand Mosque Centre](https://www.szgmc.gov.ae/en/) | Official | Overview, founder, visiting, lighting | Root URL |
| `szgmc-domes` | [SZGMC — The Domes](https://szgmc.gov.ae/en/islamic-architecture/the-domes) | Official | 82 domes | Confirmed via search |
| `szgmc-chandeliers` | [SZGMC — The Chandeliers](https://szgmc.gov.ae/en/islamic-architecture/the-chandeliers) | Official | 7 chandeliers | Confirmed via search |
| `unesco-alain` | [UNESCO WHC — Cultural Sites of Al Ain (1343)](https://whc.unesco.org/en/list/1343) | UNESCO | 2011 inscription, falaj, Hafit, Hili | Not re-verified |
| `visitabudhabi` | [Visit Abu Dhabi](https://visitabudhabi.ae/en) | Official | Al Ain Oasis visitor information (palm count) | Not re-verified |

## Corrections made during verification

- **Al Fahidi materials:** "coral stone" was replaced with "stone and gypsum… palm fronds and palm wood" to match Dubai Culture's wording.
- **Al Fahidi dates:** sources disagree (the 1890s vs. the mid-19th century), so NAZAR now says "nineteenth century" and states the disagreement as uncertainty.
- **Arabic coffee:** the UNESCO record is now No. 01074. The 2015 inscription was extended in 2024, and the answer says so.
- **Mosque carpet:** the exact area and weaver count could not be confirmed, so the numbers were removed. NAZAR explains why it doesn't quote them.
- **Chandeliers:** "millions of crystals" was removed. The count of 7 is confirmed by SZGMC.

## Facts deliberately qualified

- How much a barjeel cools a room: no figure is given ("depends on design and wind").
- Mosque capacity: published figures range from about 40,000 to 55,000, depending on how the courtyard is counted.
- Minaret height: "about 107 m", rounded.
- Al Ain palm count: "well over 100,000", with about 147,000 cited from visitor information.

## Rules for adding content

1. Every Q&A pair needs at least one `sourceIds` entry (enforced by unit tests).
2. Never invent quotations, dates, partnerships or endorsements.
3. Add `uncertainty` whenever sources disagree or a figure is approximate.
4. Arabic text is written in Modern Standard Arabic and reviewed by a native speaker before public use. *(Team action: Huda / Awaiz to review before the pitch.)*
