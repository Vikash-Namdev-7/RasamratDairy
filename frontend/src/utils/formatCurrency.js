import { CURRENCY_SYMBOL } from '../config/constants';

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0`;
  }
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-IN')}`;
};

export default formatCurrency;
