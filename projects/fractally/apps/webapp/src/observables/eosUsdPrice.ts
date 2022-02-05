import { switchMap, timer, map, shareReplay } from 'rxjs'
import { fromFetch } from 'rxjs/fetch';

export const usdPrice$ = timer(0, 30000).pipe(
    switchMap(() => fromFetch('https://api.binance.com/api/v3/ticker/price?symbol=EOSUSDT').pipe(switchMap(res => res.json()))),
    map(res => Number(res.price)),
    shareReplay(1)
)