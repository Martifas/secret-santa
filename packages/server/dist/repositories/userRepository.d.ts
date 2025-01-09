import type { Database } from '../database';
import type { User } from '../database/types';
import { type UserForMember } from '../entities/user';
import type { Insertable } from 'kysely';
export declare function userRepository(db: Database): {
    create(user: Insertable<User>): Promise<UserForMember>;
    findByEmail(email: string): Promise<UserForMember | null>;
    findById(id: number): Promise<UserForMember | null>;
    updateProfile(id: number, updates: {
        firstName?: string | null;
        lastName?: string | null;
        avatarUrl?: string | null;
    }): Promise<UserForMember>;
    updateEmail(id: number, updates: {
        email: string;
    }): Promise<UserForMember>;
    updateLastLogin(id: number): Promise<UserForMember>;
};
export type UserRepository = ReturnType<typeof userRepository>;
//# sourceMappingURL=userRepository.d.ts.map