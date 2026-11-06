import { describe, expect, it } from 'vitest';
import { Conversation, ENTRIES, SOURCES, answerQuestion, createContext } from '../src';

describe('knowledge base integrity', () => {
  it('has the three core experiences plus optional ones', () => {
    const ids = ENTRIES.map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(['barjeel-al-fahidi', 'dallah-hospitality', 'sheikh-zayed-grand-mosque']));
  });
  it.each(ENTRIES.map((e) => [e.id, e] as const))('%s is complete and fully sourced', (_id, e) => {
    expect(e.name.en && e.name.ar).toBeTruthy();
    expect(e.summary.en && e.summary.ar && e.detail.en && e.detail.ar).toBeTruthy();
    expect(e.qa.length).toBeGreaterThanOrEqual(e.id === 'al-ain-oasis' ? 4 : 5);
    expect(e.hotspot.position).toHaveLength(3);
    for (const qa of e.qa) {
      expect(qa.spoken.en && qa.spoken.ar && qa.detail.en && qa.detail.ar).toBeTruthy();
      expect(qa.sourceIds.length).toBeGreaterThan(0);
      for (const s of qa.sourceIds) expect(SOURCES[s], `${qa.id} → ${s}`).toBeDefined();
    }
  });
  it('every source uses HTTPS', () => {
    for (const s of Object.values(SOURCES)) expect(s.url).toMatch(/^https:\/\//);
  });
  it('QA ids are unique', () => {
    const ids = ENTRIES.flatMap((e) => e.qa.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('fact retrieval', () => {
  it('identifies the barjeel the visitor is looking at', () => {
    const a = answerQuestion('Nazar, what is that tower?', createContext('barjeel-al-fahidi'));
    expect(a.entryId).toBe('barjeel-al-fahidi');
    expect(a.qaId).toBe('barjeel-overview');
    expect(a.mode).toBe('curated');
    expect(a.sources.length).toBeGreaterThan(0);
    expect(a.trace.entityReason).toBe('visual-focus');
  });
  it('resolves "that tower" to the minarets when looking at the mosque', () => {
    const a = answerQuestion('What is that tower?', createContext('sheikh-zayed-grand-mosque'));
    expect(a.qaId).toBe('mosque-architecture');
  });
  it('explicit mentions override visual focus', () => {
    const a = answerQuestion('How is Arabic coffee served?', createContext('barjeel-al-fahidi'));
    expect(a.entryId).toBe('dallah-hospitality');
    expect(a.qaId).toBe('dallah-serving');
  });
  it('answers in Arabic with Arabic content', () => {
    const a = answerQuestion('ما هذا البرج؟', createContext('barjeel-al-fahidi'));
    expect(a.lang).toBe('ar');
    expect(a.qaId).toBe('barjeel-overview');
    expect(a.spoken).toMatch(/برجيل/);
  });
  it('declines off-topic questions instead of guessing', () => {
    const a = answerQuestion("What's the weather tomorrow?", createContext('barjeel-al-fahidi'));
    expect(a.confidence).toBe('declined');
    expect(a.qaId).toBeNull();
  });
  it('declines topics the entry has no verified answer for', () => {
    const a = answerQuestion('Tell me about the chandeliers in the barjeel', createContext('barjeel-al-fahidi'));
    expect(a.confidence).toBe('declined');
  });
  it('declines when nothing is in view and nothing is named', () => {
    const a = answerQuestion('What is that?', createContext(null));
    expect(a.confidence).toBe('declined');
    expect(a.entryId).toBeNull();
  });
  it('marks answers with known uncertainty as qualified', () => {
    const a = answerQuestion('How many people can pray in the Sheikh Zayed Grand Mosque?', createContext(null));
    expect(a.qaId).toBe('mosque-capacity');
    expect(a.confidence).toBe('qualified');
    expect(a.uncertainty).toBeTruthy();
  });
});

describe('conversation context', () => {
  it('keeps "it" bound to the barjeel across follow-ups', () => {
    const c = new Conversation('barjeel-al-fahidi');
    expect(c.ask('What is that tower?').qaId).toBe('barjeel-overview');
    expect(c.ask('How did it actually cool the house?').qaId).toBe('barjeel-cooling');
    const why = c.ask('Why?');
    expect(why.entryId).toBe('barjeel-al-fahidi');
    expect(why.qaId).toBe('barjeel-why-design');
  });
  it('"tell me more" walks through unused verified answers then stops', () => {
    const c = new Conversation('dallah-hospitality');
    const seen = new Set<string>();
    c.ask('What is this?');
    for (let i = 0; i < 12; i++) {
      const a = c.ask('Tell me more');
      if (a.qaId) {
        expect(seen.has(a.qaId)).toBe(false);
        seen.add(a.qaId);
      } else {
        expect(a.spoken).toMatch(/everything/);
        break;
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(5);
  });
  it('bare "how?" follows the link from the previous answer', () => {
    const c = new Conversation('dallah-hospitality');
    c.ask('What is this pot?');
    expect(c.ask('How?').qaId).toBe('dallah-serving');
  });
  it('Arabic follow-ups use conversation context', () => {
    const c = new Conversation('barjeel-al-fahidi');
    c.ask('ما هذا البرج؟');
    const a = c.ask('كيف كان يبرّد البيوت؟');
    expect(a.qaId).toBe('barjeel-cooling');
    expect(a.lang).toBe('ar');
  });
  it('looking at a new landmark switches the topic', () => {
    const c = new Conversation('barjeel-al-fahidi');
    c.ask('What is that tower?');
    c.look('dallah-hospitality');
    expect(c.ask('What is that?').entryId).toBe('dallah-hospitality');
  });
  it('reset clears memory', () => {
    const c = new Conversation('barjeel-al-fahidi');
    c.ask('What is that tower?');
    c.reset();
    expect(c.ctx.history).toHaveLength(0);
    expect(c.ctx.usedQaIds).toHaveLength(0);
  });
  it('caps history length', () => {
    const c = new Conversation('barjeel-al-fahidi');
    for (let i = 0; i < 20; i++) c.ask('What is that tower?');
    expect(c.ctx.history.length).toBeLessThanOrEqual(12);
  });
});
