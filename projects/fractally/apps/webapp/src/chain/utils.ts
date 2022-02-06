
export const numToAsset = (num: number, precision: number = 4, symbol: string = 'EOS') => `${num.toFixed(precision)} ${symbol}`;