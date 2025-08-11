import { ConfigService } from "@nestjs/config";
import { CookieOptions } from "express";

export const getRefreshCookieConfig = (
	configService: ConfigService,
	expiresIn?: Date
): CookieOptions => ({
	httpOnly: true,
	domain: configService.get<string>("DOMAIN"),
	expires: expiresIn ? expiresIn : new Date(0),
	secure: true,
	//! if production 'lux'
	sameSite: "none",
});
