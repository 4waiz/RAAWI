import type { Answer, ConversationContext, Lang, Turn } from './types';
import { answerQuestion } from './retrieval';

export const MAX_HISTORY = 12;

export function createContext(focusEntryId: string | null = null): ConversationContext {
  return { focusEntryId, activeEntryId: focusEntryId, lastQaId: null, usedQaIds: [], history: [] };
}

/** Pure reducer: apply a visitor question + NAZAR answer to the conversation context. */
export function applyTurn(ctx: ConversationContext, question: string, answer: Answer, now = Date.now()): ConversationContext {
  const turns: Turn[] = [
    ...ctx.history,
    { role: 'visitor' as const, text: question, lang: answer.lang, entryId: answer.entryId, at: now },
    { role: 'nazar' as const, text: answer.spoken, lang: answer.lang, entryId: answer.entryId, qaId: answer.qaId, at: now },
  ].slice(-MAX_HISTORY);
  const switchedEntry = answer.entryId !== null && answer.entryId !== ctx.activeEntryId;
  return {
    ...ctx,
    activeEntryId: answer.entryId ?? ctx.activeEntryId,
    lastQaId: answer.qaId ?? (switchedEntry ? null : ctx.lastQaId),
    usedQaIds: answer.qaId
      ? [...(switchedEntry ? [] : ctx.usedQaIds), answer.qaId].filter((v, i, arr) => arr.indexOf(v) === i)
      : switchedEntry ? [] : ctx.usedQaIds,
    history: turns,
  };
}

/** Looking at something new (LOOK) makes it both the focus and the active topic. */
export function setFocus(ctx: ConversationContext, entryId: string | null): ConversationContext {
  if (ctx.focusEntryId === entryId) return ctx;
  return { ...ctx, focusEntryId: entryId, activeEntryId: entryId ?? ctx.activeEntryId, lastQaId: null, usedQaIds: [] };
}

export class Conversation {
  ctx: ConversationContext;
  constructor(focusEntryId: string | null = null) {
    this.ctx = createContext(focusEntryId);
  }
  ask(question: string, preferredLang: Lang = 'en'): Answer {
    const answer = answerQuestion(question, this.ctx, { preferredLang });
    this.ctx = applyTurn(this.ctx, question, answer);
    return answer;
  }
  look(entryId: string | null) {
    this.ctx = setFocus(this.ctx, entryId);
  }
  reset(focusEntryId: string | null = this.ctx.focusEntryId) {
    this.ctx = createContext(focusEntryId);
  }
}
