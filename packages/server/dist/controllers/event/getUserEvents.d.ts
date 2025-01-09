import type { EventRowSelect } from "../../types/event";
declare const _default: import("@trpc/server").BuildProcedure<"query", {
    _config: import("@trpc/server").RootConfig<{
        ctx: import("../../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>;
    _meta: object;
    _ctx_out: {
        db: import("../../database").Database;
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
        res: import("express").Response<any, Record<string, any>> | undefined;
        authUser: {
            id: number;
        };
        repos: {
            eventRepository?: {
                findAll(): Promise<EventRowSelect[]>;
                find(id: number): Promise<EventRowSelect | null>;
                create(event: import("kysely").Insertable<import("../../database").Event>): Promise<import("../../entities/event").EventForMember>;
                update(id: number, updates: import("../../types/event").EventRowUpdate): Promise<import("../../entities/event").EventForMember>;
                remove(id: number): Promise<import("../../entities/event").EventForMember>;
                findAllForUser(userId: number): Promise<EventRowSelect[]>;
            } | undefined;
            wishlistRepository?: {
                findById(id: number): Promise<import("../../types/wishlist").WishlistRowSelect | null>;
                findByEventAndUserId(eventId: number, userId: number): Promise<import("../../types/wishlist").WishlistRowSelect | null>;
                create(wishlist: import("kysely").Insertable<import("../../database").Wishlist>): Promise<import("../../entities/wishlist").WishlistForMember>;
                update(id: number, updates: import("../../types/wishlist").WishlistRowUpdate): Promise<import("../../entities/wishlist").WishlistForMember>;
                remove(id: number): Promise<import("../../entities/wishlist").WishlistForMember>;
            } | undefined;
            invitationRepository?: {
                findById(id: number): Promise<import("../../types/invitation").InvitationRowSelect | null>;
                findByEventAndUserId(eventId: number, userId: number): Promise<import("../../types/invitation").InvitationRowSelect | null>;
                findAllForUser(userId: number): Promise<import("../../types/invitation").InvitationRowSelect[]>;
                create(invitation: import("kysely").Insertable<import("../../database").EventInvitations>): Promise<import("../../entities/eventInvitation").InvitationForMember>;
                update(id: number, updates: import("../../types/invitation").InvitationRowUpdate): Promise<import("../../entities/eventInvitation").InvitationForMember>;
                remove(id: number): Promise<import("../../entities/eventInvitation").InvitationForMember>;
            } | undefined;
            ruleRepository?: {
                findByEventId(eventId: number): Promise<import("../../types/rule").RuleRowSelect[]>;
                create(rule: import("kysely").Insertable<import("../../database").EventRule>): Promise<import("../../entities/eventRule").RuleForMember>;
                update(id: number, updates: import("../../types/rule").RuleRowUpdate): Promise<import("../../entities/eventRule").RuleForMember>;
                remove(id: number): Promise<import("../../entities/eventRule").RuleForMember>;
            } | undefined;
            userEventRepository?: {
                findByEventAndUserId(eventId: number, userId: number): Promise<import("../../types/userEvent").UserEventRowSelect | null>;
                create(record: import("kysely").Insertable<import("../../database").UserEvent>): Promise<import("../../entities/userEvent").UserEventForMember>;
                updateRole(id: number, updates: import("../../types/userEvent").UserEventRowUpdate): Promise<import("../../entities/userEvent").UserEventForMember>;
                isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                isMember(eventId: number, userId: number): Promise<boolean>;
                remove(id: number): Promise<import("../../entities/userEvent").UserEventForMember>;
            } | undefined;
            userRepository?: {
                create(user: import("kysely").Insertable<import("../../database").User>): Promise<import("../../entities/user").UserForMember>;
                findByEmail(email: string): Promise<import("../../entities/user").UserForMember | null>;
                findById(id: number): Promise<import("../../entities/user").UserForMember | null>;
                updateProfile(id: number, updates: {
                    firstName?: string | null;
                    lastName?: string | null;
                    avatarUrl?: string | null;
                }): Promise<import("../../entities/user").UserForMember>;
                updateEmail(id: number, updates: {
                    email: string;
                }): Promise<import("../../entities/user").UserForMember>;
                updateLastLogin(id: number): Promise<import("../../entities/user").UserForMember>;
            } | undefined;
        } & Pick<import("../../repositories").Repositories, "eventRepository">;
    };
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
}, {
    id: number;
    createdAt: Date;
    status: string;
    name: string;
    description: string;
    createdBy: number;
    eventDate: Date;
    budgetLimit: number;
    updatedAt: Date;
}[]>;
export default _default;
//# sourceMappingURL=getUserEvents.d.ts.map