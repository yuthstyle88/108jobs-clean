export type DateFormatOption = 'date' | 'datetime' | 'datetimeWithSeconds'

export const formatDateTime = (dateString: string, option: DateFormatOption = 'date') => {
  if (!dateString || dateString === "-") return "-";
  const date = new Date(dateString);

  const baseOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (option === 'datetime' || option === 'datetimeWithSeconds') {
    baseOptions.hour = '2-digit';
    baseOptions.minute = '2-digit';
    baseOptions.hour12 = false;
  }

  if (option === 'datetimeWithSeconds') {
    baseOptions.second = '2-digit';
  }

  return date.toLocaleString('th-TH-u-ca-gregory',
    baseOptions);
};

