// Helper to parse latest 'proposed-quote' payload from messages (expects newest-first ordering)
// Returns the parsed JSON payload or null if none found.
export function getLatestProposedQuotePayload(messages: Array<{ content?: string | null }> | null | undefined): any | null {
    if (!messages || !Array.isArray(messages)) return null; // Guard against undefined/null or non-array
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (!msg?.content) continue;
        const content = msg.content.trim();
        if (!content.startsWith('{')) continue;
        try {
            const parsed = JSON.parse(content);
            if (parsed && parsed.type === 'proposed-quote') {
                return parsed;
            }
        } catch {

        }
    }
    return null;
}

// Convenience helper to retrieve the seq number from the latest proposed-quote payload
export function getLatestProposedQuoteSeq(messages: Array<{ content?: string | null }> | null | undefined, defaultSeq: number = 1): number {
    if (!messages || !Array.isArray(messages)) return defaultSeq; // Guard against undefined/null or non-array
    for (let i = 0; i < messages.length; i++) {
        const latest = getLatestProposedQuotePayload([messages[i]]); // Process one message at a time
        const seq = Number(latest?.quote?.workSteps?.[0]?.seq);
        if (Number.isFinite(seq) && seq > 0) {
            return seq;
        }
    }
    return defaultSeq;
}