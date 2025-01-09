export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape | {
        data: {
            message: string;
        };
        message: string;
        code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: typeof import("superjson").default;
}>, {
    event: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>, {
        getEvent: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "eventRepository" | "userRepository">;
            };
            _input_in: {
                id: number;
            };
            _input_out: {
                id: number;
            };
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
        }>;
        createEvent: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "eventRepository">;
            };
            _input_in: {
                status: string;
                name: string;
                description: string;
                eventDate: string;
                budgetLimit: number;
            };
            _input_out: {
                status: string;
                name: string;
                description: string;
                eventDate: Date;
                budgetLimit: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/event").EventForMember>;
        updateEvent: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "eventRepository">;
            };
            _input_in: {
                id: number;
                updates: {
                    status?: string | undefined;
                    name?: string | undefined;
                    description?: string | undefined;
                    eventDate?: string | undefined;
                    budgetLimit?: number | undefined;
                };
            };
            _input_out: {
                id: number;
                updates: {
                    status?: string | undefined;
                    name?: string | undefined;
                    description?: string | undefined;
                    eventDate?: Date | undefined;
                    budgetLimit?: number | undefined;
                };
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/event").EventForMember>;
        removeEvent: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "eventRepository">;
            };
            _input_in: {
                id: number;
            };
            _input_out: {
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/event").EventForMember>;
        getUserEvents: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "eventRepository">;
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
    }>;
    wishlist: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>, {
        getWishlist: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "wishlistRepository" | "userEventRepository">;
            };
            _input_in: {
                eventId: number;
                userId: number;
            };
            _input_out: {
                eventId: number;
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/wishlist").WishlistForMember | null>;
        createWishlist: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "wishlistRepository">;
            };
            _input_in: {
                eventId: number;
                userId: number;
                itemName: string;
                description?: string | null | undefined;
                url?: string | null | undefined;
                price?: number | null | undefined;
                priority?: number | null | undefined;
                isPurchased?: boolean | undefined;
            };
            _input_out: {
                eventId: number;
                userId: number;
                itemName: string;
                isPurchased: boolean;
                description?: string | null | undefined;
                url?: string | null | undefined;
                price?: number | null | undefined;
                priority?: number | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/wishlist").WishlistForMember>;
        updateWishlist: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "wishlistRepository">;
            };
            _input_in: {
                id: number;
                description?: string | null | undefined;
                itemName?: string | undefined;
                url?: string | null | undefined;
                price?: number | null | undefined;
                priority?: number | null | undefined;
                isPurchased?: boolean | undefined;
            };
            _input_out: {
                id: number;
                description?: string | null | undefined;
                itemName?: string | undefined;
                url?: string | null | undefined;
                price?: number | null | undefined;
                priority?: number | null | undefined;
                isPurchased?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/wishlist").WishlistForMember>;
        deleteWishlist: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "wishlistRepository">;
            };
            _input_in: {
                id: number;
            };
            _input_out: {
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/wishlist").WishlistForMember>;
    }>;
    rule: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>, {
        createRule: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "ruleRepository" | "userEventRepository">;
            };
            _input_in: {
                eventId: number;
                ruleType: string;
                ruleData: Record<string, unknown>;
            };
            _input_out: {
                eventId: number;
                ruleType: string;
                ruleData: string | number | boolean | import("../database").JsonArray | import("../database").JsonObject | null;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventRule").RuleForMember>;
        deleteRule: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "ruleRepository" | "userEventRepository">;
            };
            _input_in: {
                id: number;
                eventId: number;
            };
            _input_out: {
                id: number;
                eventId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventRule").RuleForMember>;
        getEventRules: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "ruleRepository" | "userEventRepository">;
            };
            _input_in: {
                eventId: number;
            };
            _input_out: {
                eventId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventRule").RuleForMember[]>;
        updateRule: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "ruleRepository" | "userEventRepository">;
            };
            _input_in: {
                id: number;
                eventId: number;
                ruleType?: string | undefined;
                ruleData?: Record<string, unknown> | undefined;
            };
            _input_out: {
                id: number;
                eventId: number;
                ruleType?: string | undefined;
                ruleData?: string | number | boolean | import("../database").JsonArray | import("../database").JsonObject | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventRule").RuleForMember>;
    }>;
    user: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>, {
        signup: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                } | undefined;
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "userRepository">;
            };
            _input_in: {
                password: string;
                email: string;
                firstName?: string | null | undefined;
                lastName?: string | null | undefined;
            };
            _input_out: {
                password: string;
                email: string;
                firstName?: string | null | undefined;
                lastName?: string | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            id: number;
        }>;
        login: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                } | undefined;
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "userRepository">;
            };
            _input_in: {
                password: string;
                email: string;
            };
            _input_out: {
                password: string;
                email: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            accessToken: string;
        }>;
        updateProfile: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "userRepository">;
            };
            _input_in: {
                firstName?: string | null | undefined;
                lastName?: string | null | undefined;
                avatarUrl?: string | null | undefined;
            };
            _input_out: {
                firstName?: string | null | undefined;
                lastName?: string | null | undefined;
                avatarUrl?: string | null | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/user").UserForMember>;
    }>;
    userEvent: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>, {
        createMember: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "userEventRepository">;
            };
            _input_in: {
                eventId: number;
                role: string;
                santaForUserId: number;
                userId: number;
                wishlistId: number;
            };
            _input_out: {
                eventId: number;
                role: string;
                santaForUserId: number;
                userId: number;
                wishlistId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/userEvent").UserEventForMember>;
        removeMember: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "userEventRepository">;
            };
            _input_in: {
                id: number;
            };
            _input_out: {
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/userEvent").UserEventForMember>;
        updateMemberRole: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "userEventRepository">;
            };
            _input_in: {
                id: number;
                role: string;
            };
            _input_out: {
                id: number;
                role: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/userEvent").UserEventForMember>;
    }>;
    invitation: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("../trpc").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape | {
            data: {
                message: string;
            };
            message: string;
            code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: typeof import("superjson").default;
    }>, {
        createInvitation: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "invitationRepository">;
            };
            _input_in: {
                email: string;
                status: string;
                eventId: number;
                userId: number;
                token: string;
                expiresAt: Date;
            };
            _input_out: {
                email: string;
                status: string;
                eventId: number;
                userId: number;
                token: string;
                expiresAt: Date;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventInvitation").InvitationForMember>;
        deleteInvitation: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "invitationRepository">;
            };
            _input_in: {
                id: number;
            };
            _input_out: {
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventInvitation").InvitationForMember>;
        updateInvitation: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "invitationRepository">;
            };
            _input_in: {
                id: number;
                email?: string | undefined;
                status?: string | undefined;
                token?: string | undefined;
                expiresAt?: Date | undefined;
            };
            _input_out: {
                id: number;
                email?: string | undefined;
                status?: string | undefined;
                token?: string | undefined;
                expiresAt?: Date | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventInvitation").InvitationForMember>;
        getUserInvitations: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "invitationRepository">;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventInvitation").InvitationForMember[]>;
        getInvitation: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "invitationRepository">;
            };
            _input_in: {
                id: number;
            };
            _input_out: {
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventInvitation").InvitationForMember>;
        checkInvitation: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("../trpc").Context;
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
                db: import("../database").Database;
                req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> | undefined;
                res: import("express").Response<any, Record<string, any>> | undefined;
                authUser: {
                    id: number;
                };
                repos: {
                    eventRepository?: {
                        findAll(): Promise<import("../types/event").EventRowSelect[]>;
                        find(id: number): Promise<import("../types/event").EventRowSelect | null>;
                        create(event: import("kysely").Insertable<import("../database").Event>): Promise<import("../entities/event").EventForMember>;
                        update(id: number, updates: import("../types/event").EventRowUpdate): Promise<import("../entities/event").EventForMember>;
                        remove(id: number): Promise<import("../entities/event").EventForMember>;
                        findAllForUser(userId: number): Promise<import("../types/event").EventRowSelect[]>;
                    } | undefined;
                    wishlistRepository?: {
                        findById(id: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/wishlist").WishlistRowSelect | null>;
                        create(wishlist: import("kysely").Insertable<import("../database").Wishlist>): Promise<import("../entities/wishlist").WishlistForMember>;
                        update(id: number, updates: import("../types/wishlist").WishlistRowUpdate): Promise<import("../entities/wishlist").WishlistForMember>;
                        remove(id: number): Promise<import("../entities/wishlist").WishlistForMember>;
                    } | undefined;
                    invitationRepository?: {
                        findById(id: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/invitation").InvitationRowSelect | null>;
                        findAllForUser(userId: number): Promise<import("../types/invitation").InvitationRowSelect[]>;
                        create(invitation: import("kysely").Insertable<import("../database").EventInvitations>): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        update(id: number, updates: import("../types/invitation").InvitationRowUpdate): Promise<import("../entities/eventInvitation").InvitationForMember>;
                        remove(id: number): Promise<import("../entities/eventInvitation").InvitationForMember>;
                    } | undefined;
                    ruleRepository?: {
                        findByEventId(eventId: number): Promise<import("../types/rule").RuleRowSelect[]>;
                        create(rule: import("kysely").Insertable<import("../database").EventRule>): Promise<import("../entities/eventRule").RuleForMember>;
                        update(id: number, updates: import("../types/rule").RuleRowUpdate): Promise<import("../entities/eventRule").RuleForMember>;
                        remove(id: number): Promise<import("../entities/eventRule").RuleForMember>;
                    } | undefined;
                    userEventRepository?: {
                        findByEventAndUserId(eventId: number, userId: number): Promise<import("../types/userEvent").UserEventRowSelect | null>;
                        create(record: import("kysely").Insertable<import("../database").UserEvent>): Promise<import("../entities/userEvent").UserEventForMember>;
                        updateRole(id: number, updates: import("../types/userEvent").UserEventRowUpdate): Promise<import("../entities/userEvent").UserEventForMember>;
                        isEventAdmin(userId: number, eventId: number): Promise<boolean>;
                        isMember(eventId: number, userId: number): Promise<boolean>;
                        remove(id: number): Promise<import("../entities/userEvent").UserEventForMember>;
                    } | undefined;
                    userRepository?: {
                        create(user: import("kysely").Insertable<import("../database").User>): Promise<import("../entities/user").UserForMember>;
                        findByEmail(email: string): Promise<import("../entities/user").UserForMember | null>;
                        findById(id: number): Promise<import("../entities/user").UserForMember | null>;
                        updateProfile(id: number, updates: {
                            firstName?: string | null;
                            lastName?: string | null;
                            avatarUrl?: string | null;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateEmail(id: number, updates: {
                            email: string;
                        }): Promise<import("../entities/user").UserForMember>;
                        updateLastLogin(id: number): Promise<import("../entities/user").UserForMember>;
                    } | undefined;
                } & Pick<import("../repositories").Repositories, "invitationRepository" | "userEventRepository">;
            };
            _input_in: {
                eventId: number;
                userId: number;
            };
            _input_out: {
                eventId: number;
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../entities/eventInvitation").InvitationForMember | null>;
    }>;
}>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map