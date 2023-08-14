import { getMinutes } from 'date-fns';
import { pipe, take, toArray } from '@fxts/core';

export const beforeMinutes = (minute: number) =>
  Date.now() - minute * 60 * 1000;

export const getClosestDeciminute = (minutes: number) => {
  return Math.floor(minutes / 10) * 10;
};

export const generateTimespan = async () => {
  return await pipe(
    (function* () {
      const currentMinute = getMinutes(Date.now());

      let from = currentMinute - getClosestDeciminute(currentMinute);
      let to = 0;

      while (true) {
        yield {
          lt: beforeMinutes(to),
          gte: beforeMinutes(from),
        };

        to = from;
        from += 10;
      }
    })(),
    take(4),
    toArray,
  );
};
