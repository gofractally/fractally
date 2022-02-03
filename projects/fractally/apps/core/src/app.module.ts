import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SignalWireService } from "./signalwire.service";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [".env.local", ".env"],
        }),
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
    providers: [AppService, SignalWireService],
})
export class AppModule {}
