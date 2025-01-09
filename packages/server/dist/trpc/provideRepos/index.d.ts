import type { Repositories, RepositoriesFactories, RepositoriesKeys } from '../../repositories';
export default function provideRepos<TKeys extends RepositoriesKeys>(reposFactoriesWanted: Pick<RepositoriesFactories, TKeys>): import("@trpc/server").MiddlewareBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: import("..").Context;
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
    _ctx_out: {};
    _input_out: typeof import("@trpc/server").unsetMarker;
    _input_in: unknown;
    _output_in: unknown;
    _output_out: unknown;
    _meta: object;
}, {
    _config: import("@trpc/server").RootConfig<{
        ctx: import("..").Context;
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
    _ctx_out: {
        repos: {
            eventRepository?: {
                findAll(): Promise<import("../../types/event").EventRowSelect[]>;
                find(id: number): Promise<import("../../types/event").EventRowSelect | null>;
                create(event: import("kysely").Insertable<import("../../database").Event>): Promise<import("../../entities/event").EventForMember>;
                update(id: number, updates: import("../../types/event").EventRowUpdate): Promise<import("../../entities/event").EventForMember>;
                remove(id: number): Promise<import("../../entities/event").EventForMember>;
                findAllForUser(userId: number): Promise<import("../../types/event").EventRowSelect[]>;
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
        } & Pick<Repositories, TKeys>;
    };
    _input_in: unknown;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: unknown;
    _output_out: unknown;
    _meta: object;
}>;
//# sourceMappingURL=index.d.ts.map