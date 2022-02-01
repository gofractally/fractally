import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    // eslint-disable-next-line class-methods-use-this
    getHello = (): string => `The meaning of life is: 42`;
}
