export default function buildQueryParams(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key,
        value.toString());
    }
  });
  return searchParams.toString();
}
