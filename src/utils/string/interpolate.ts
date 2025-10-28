export function interpolate(template: string, values: Record<string, string | number | undefined>): string {
  return template.replace(/\{(\w+)\}/g,
    (_, key) => values[key]?.toString() || "");
}

export function interpolateDouble(template: string, values: Record<string, string | number | undefined>): string {
  return template.replace(/\{\{(\w+)\}\}/g,
    (_, key) => {
      const value = values[key];
      return value !== undefined ? value.toString() : "";
    });
}
