// Utility to format chat room last message previews
// Especially handles JSON-based special messages like proposed quotes

export type ProposedQuotePreview = {
  type: string;
  quote?: {
    projectName?: string;
    amount?: number;
    workingDays?: number;
    workSteps?: Array<unknown>;
    deliveryDay?: string;
  };
};

/**
 * Format last message content for display in the chat room list.
 * - If content is a JSON string with type "proposed-quote", returns a concise human-friendly summary.
 * - Otherwise, returns the original content.
 */
export function formatLastMessagePreview(content?: string): string {
  if (!content) return "";

  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as ProposedQuotePreview;
      if (parsed && parsed.type === "proposed-quote" && parsed.quote) {
        const q = parsed.quote;
        const name = q.projectName || "Quotation";
        const amount = typeof q.amount === "number" ? q.amount : undefined;
        const steps = Array.isArray(q.workSteps) ? q.workSteps.length : undefined;
        const due = q.deliveryDay || undefined;
        const parts: string[] = [
          "Proposed quotation",
          name,
        ];
        if (typeof amount === "number") {
          parts.push((amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
        if (typeof steps === "number") {
          parts.push(`${steps} steps`);
        }
        if (due) {
          parts.push(`Due ${due}`);
        }
        return parts.join(" • ");
      }
      if (parsed && (parsed as any).type === "employer-assigned") {
        return "Assignment confirmed";
      }
      if (parsed && (parsed as any).type === "start-work") {
        return "Started work";
      }
    } catch {
      // fallthrough
    }
  }

  return content;
}
