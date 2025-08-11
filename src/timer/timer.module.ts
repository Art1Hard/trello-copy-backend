import { Module } from "@nestjs/common";
import { TimerService } from "./timer.service";
import { TimerController } from "./timer.controller";
import { PrismaService } from "src/services/prisma.service";
import { UserModule } from "src/user/user.module";

@Module({
	controllers: [TimerController],
	providers: [PrismaService, TimerService],
	imports: [UserModule],
})
export class TimerModule {}
