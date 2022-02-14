import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "../app.config";
import { SubchainService } from "../subchain/subchain.service";
import { MembersResolver } from "./members.resolver";

@Module({
    providers: [ConfigService, AppConfig, SubchainService, MembersResolver],
})
export class MembersModule {}
