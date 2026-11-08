/* Google AI for sentences Leash can't sort by itself. Only the typed or spoken sentence is sent,
   plus the category names. The key stays in this phone's storage and is never added to backups. */
window.LeashAI = (() => {
  const KEY_NAME = 'leash-google-key';
  const MODEL = 'gemini-3.1-flash-lite';
  const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
  const TIMEOUT_MS = 12000;

  const getKey = () => { try { return localStorage.getItem(KEY_NAME) || ''; } catch (e) { return ''; } };
  const setKey = (key) => { try { if (key) localStorage.setItem(KEY_NAME, key); else localStorage.removeItem(KEY_NAME); return true; } catch (e) { return false; } };

  const SCHEMA = {
    type: 'object',
    properties: {
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['spend', 'pay', 'income', 'no_spend', 'paid_bill', 'question', 'unclear'] },
            amount: { type: 'number' },
            category: { type: 'string' },
            when: { type: 'string', enum: ['today', 'yesterday'] },
            note: { type: 'string' },
            topic: { type: 'string', enum: ['left', 'spent', 'jar', 'payday'] },
            confidence: { type: 'number' },
          },
          required: ['type', 'confidence'],
        },
      },
    },
    required: ['actions'],
  };

  const instruction = (cats) => 'You read one short message from a person tracking their own money in India. Amounts are rupees. ' +
    'Return one action per money event. Types: spend = money went out. pay = their monthly salary came in (words like salary, payday). ' +
    'income = other money came in, like a refund, gift or bonus. no_spend = they spent nothing today. paid_bill = they paid a regular bill and gave no amount. ' +
    'question = they ask about their money; topic left = what is left, spent = where money went, jar = savings jar, payday = next payday. ' +
    'unclear = you cannot tell. Never invent an amount. A "-" or "+" next to a number is not proof of spending; use the words. ' +
    'For spend, choose category from this list by id: ' + cats.map((c) => c.id + ' (' + c.name + ')').join(', ') + '. ' +
    'If none fits, leave category empty. note is a few words naming what it was. confidence is 0 to 1. Use below 0.7 if you are guessing.';

  const read = async (text, cats, key) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(URL_BASE, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key || getKey() },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instruction(cats) }] },
          contents: [{ role: 'user', parts: [{ text: String(text).slice(0, 300) }] }],
          generationConfig: { temperature: 0, responseMimeType: 'application/json', responseJsonSchema: SCHEMA },
        }),
      });
      if (!res.ok) return { error: res.status === 429 ? 'limit' : res.status === 400 || res.status === 401 || res.status === 403 ? 'key' : 'server' };
      const data = await res.json();
      const out = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!out) return { error: 'empty' };
      return { result: JSON.parse(out) };
    } catch (e) {
      return { error: e && e.name === 'AbortError' ? 'slow' : 'offline' };
    } finally {
      clearTimeout(timer);
    }
  };

  return { getKey, setKey, read };
})();
