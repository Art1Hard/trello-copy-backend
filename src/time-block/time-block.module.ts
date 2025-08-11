import { Module } from "@nestjs/common";
import { TimeBlockService } from "./time-block.service";
import { TimeBlockController } from "./time-block.controller";
import { PrismaService } from "src/services/prisma.service";

@Module({
	controllers: [TimeBlockController],
	providers: [PrismaService, TimeBlockService],
})
export class TimeBlockModule {}
