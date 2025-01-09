import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;
export type Json = JsonValue;
export type JsonArray = JsonValue[];
export type JsonObject = {
    [x: string]: JsonValue | undefined;
};
export type JsonPrimitive = boolean | number | string | null;
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export interface Event {
    budgetLimit: number;
    createdAt: Generated<Timestamp>;
    createdBy: number;
    description: string;
    eventDate: Timestamp;
    id: Generated<number>;
    name: string;
    status: string;
    updatedAt: Generated<Timestamp>;
}
export interface EventInvitations {
    createdAt: Generated<Timestamp>;
    email: string;
    eventId: number;
    expiresAt: Timestamp;
    id: Generated<number>;
    status: string;
    token: string;
    updatedAt: Generated<Timestamp>;
    userId: number;
}
export interface EventRule {
    eventId: number;
    id: Generated<number>;
    ruleData: Json;
    ruleType: string;
}
export interface User {
    avatarUrl: string | null;
    createdAt: Generated<Timestamp>;
    email: string;
    firstName: string | null;
    id: Generated<number>;
    lastLogin: Generated<Timestamp>;
    lastName: string | null;
    password: string;
}
export interface UserEvent {
    createdAt: Generated<Timestamp>;
    eventId: number;
    id: Generated<number>;
    role: string;
    santaForUserId: number | null;
    updatedAt: Generated<Timestamp>;
    userId: number;
    wishlistId: number | null;
}
export interface Wishlist {
    createdAt: Generated<Timestamp>;
    description: string | null;
    eventId: number;
    id: Generated<number>;
    isPurchased: Generated<boolean>;
    itemName: string;
    price: number | null;
    priority: number | null;
    updatedAt: Generated<Timestamp>;
    url: string | null;
    userId: number;
}
export interface DB {
    event: Event;
    eventInvitations: EventInvitations;
    eventRule: EventRule;
    user: User;
    userEvent: UserEvent;
    wishlist: Wishlist;
}
//# sourceMappingURL=types.d.ts.map