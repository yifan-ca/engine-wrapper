import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MoveRequestDto } from "./dto/move-request.dto";
import { MoveResponseDto } from "./dto/move-response.dto";
import { EngineService } from "./service/engine.service";

@Controller()
export class EngineController {

    constructor(private readonly service: EngineService) {}

    @MessagePattern(process.env.NATS_SUB)
    async move(@Payload() data: MoveRequestDto): Promise<MoveResponseDto> {
        return this.service.move({ ...data });
    }
}