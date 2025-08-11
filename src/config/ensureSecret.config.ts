import { ConfigService } from "@nestjs/config";

export const ensureSecret = (configService: ConfigService): string => {
	const secret = configService.get<string>("JWT_SECRET");

	if (!secret) {
		throw new Error("JWT_SECRET is not defined in environment variables");
	}

	return secret;
};
