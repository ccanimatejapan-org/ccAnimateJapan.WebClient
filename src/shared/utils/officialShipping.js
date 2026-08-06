import { formatDateInTaipei } from './date.js';

const RANGE_SEPARATOR = ' - ';

export function getOfficialShippingDisplay(shipping = {}, locale = 'zh-TW') {
  if (!shipping || shipping.isPreOrder !== true) {
    return { status: 'hidden' };
  }

  const start = formatDateInTaipei(shipping.startTime, locale);
  const end = formatDateInTaipei(shipping.endTime, locale);

  if (!start || !end) {
    return { status: 'pending' };
  }

  return {
    status: 'ready',
    range: `${start}${RANGE_SEPARATOR}${end}`
  };
}
