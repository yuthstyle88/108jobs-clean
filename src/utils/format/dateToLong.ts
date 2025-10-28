export function formatDateToLong(input?: string, locale: string = "en-US"): string {
    if (!input) return "N/A";
    const date = new Date(input);
    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}