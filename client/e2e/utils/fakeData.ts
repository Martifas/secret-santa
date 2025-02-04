import type { Insertable } from 'kysely';
import { Chance } from 'chance';
import type { Event } from '../../../server/src/shared/types';

export const random = process.env.CI ? new Chance(1) : new Chance();
const now = new Date();

export const fakeEvent = <T extends Insertable<Event>>(overrides: Partial<T> = {} as T) => {
  const randomDate = new Date(
    random.date({
      min: now,
      max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
    })
  );

  const dateWithoutTime = new Date(
    Date.UTC(
      randomDate.getFullYear(),
      randomDate.getMonth(),
      randomDate.getDate()
    )
  );

  return {
    budgetLimit: random.integer({ min: 10, max: 1000 }),
    description: random.paragraph(),
    eventDate: dateWithoutTime,
    title: random.word(),
    ...overrides,
  };
};