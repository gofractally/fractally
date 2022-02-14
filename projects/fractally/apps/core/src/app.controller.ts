import { Controller, Get, Post, Body } from "@nestjs/common";

import { AppService } from "./app.service";
import { SignalWireService, RoomRequestInput } from "./signalwire";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly signalWireService: SignalWireService
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("get-token")
    getToken() {
        return { token: Math.floor(Math.random() * 100) };
    }

    @Post("get-token")
    signalWireGetToken(@Body() req: RoomRequestInput) {
        return this.signalWireService.setupRoomToken(req);
    }
}
