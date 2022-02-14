import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "../app.config";
import { SubchainService } from "./subchain.service";

@Module({
    providers: [ConfigService, AppConfig, SubchainService],
})
export class SubchainModule {}
