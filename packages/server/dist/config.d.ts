import 'dotenv/config';
declare const config: Readonly<{
    env: "development" | "test" | "production" | "staging";
    isCi: boolean;
    port: number;
    auth: {
        tokenKey: string;
        expiresIn: string;
        passwordCost: number;
    };
    database: {
        connectionString: string;
    };
}>;
export default config;
//# sourceMappingURL=config.d.ts.map