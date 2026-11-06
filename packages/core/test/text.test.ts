import { describe, expect, it } from 'vitest';
import { arabicVariants, detectLanguage, normalize, stripWakeWord } from '../src';

describe('language selection', () => {
  it('detects Arabic questions', () => {
    expect(detectLanguage('ما هذا البرج؟')).toBe('ar');
    expect(detectLanguage('كيف كان يبرّد البيوت؟', 'en')).toBe('ar');
  });
  it('detects English questions', () => {
    expect(detectLanguage('What is that tower?', 'ar')).toBe('en');
  });
  it('falls back to the preferred language when ambiguous', () => {
    expect(detectLanguage('2015?', 'ar')).toBe('ar');
    expect(detectLanguage('', 'en')).toBe('en');
  });
  it('handles mixed text by majority script', () => {
    expect(detectLanguage('What is البرجيل', 'en')).toBe('ar');
  });
});

describe('normalisation', () => {
  it('strips Arabic diacritics and unifies letter forms', () => {
    expect(normalize('الدلّة')).toBe('الدله');
    expect(normalize('أبوظبي')).toBe('ابوظبي');
    expect(normalize('مئذنة')).toBe('ميذنه');
  });
  it('lowercases English and removes punctuation', () => {
    expect(normalize("What's THAT tower?")).toBe('what is that tower');
  });
  it('produces Arabic clitic variants', () => {
    expect(arabicVariants('والدله')).toContain('دله');
    expect(arabicVariants('بالبرجيل')).toContain('برجيل');
  });
  it('strips the wake word in both languages', () => {
    expect(stripWakeWord('Nazar, what is that tower?')).toBe('what is that tower?');
    expect(stripWakeWord('Hey Nazar what is this')).toBe('what is this');
    expect(stripWakeWord('يا نظر، ما هذه الدلة؟')).toBe('ما هذه الدلة؟');
  });
});
