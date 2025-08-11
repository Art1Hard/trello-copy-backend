import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import { ensureSecret } from "src/config/ensureSecret.config";

export const getJwtConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => {
	const secret = ensureSecret(configService);
	return { secret };
};
