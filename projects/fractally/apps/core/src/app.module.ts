import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { AppController } from "./app.controller";
import { AppConfig } from "./app.config";
import { AppService } from "./app.service";
import { SignalWireService } from "./signalwire";
import { RecipesModule } from "./recipes/recipes.module";
import { SubchainModule } from "./subchain";
import { MembersModule } from "./members/members.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env.local", ".env"],
        }),
        SubchainModule,
        MembersModule,
        RecipesModule,
        GraphQLModule.forRoot({
            autoSchemaFile: "schema.gql",
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            installSubscriptionHandlers: true,
            subscriptions: {
                "graphql-ws": true,
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppConfig, AppService, SignalWireService],
})
export class AppModule {}
