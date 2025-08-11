import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { AuthDto } from "./dto/auth.dto";
import { verify } from "argon2";
import { Response } from "express";
import { getRefreshCookieConfig } from "src/config/refreshCookie.config";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 7;
	REFRESH_TOKEN_NAME = "refreshToken";

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) {}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto);
		const tokens = this.issueTokens(user.id);

		return { user, ...tokens };
	}

	async register(dto: AuthDto) {
		const existUser = await this.userService.getByEmail(dto.email);

		if (existUser) throw new BadRequestException("User already exists");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto);

		const tokens = this.issueTokens(user.id);

		return { user, ...tokens };
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync<{ id: string }>(refreshToken);
		if (!result) throw new UnauthorizedException("Invalid refresh token");

		const user = await this.userService.getById(result.id);
		if (!user) throw new UnauthorizedException("User not found");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...safeUser } = user;
		const tokens = this.issueTokens(safeUser.id);

		return { user: safeUser, ...tokens };
	}

	private issueTokens(userId: string) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: "1h",
		});

		const refreshToken = this.jwt.sign(data, {
			expiresIn: "7d",
		});

		return { accessToken, refreshToken };
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email);
		if (!user) throw new NotFoundException("User not found");

		const isValid = await verify(user.password, dto.password);
		if (!isValid) throw new UnauthorizedException("Invalid password");

		return user;
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

		res.cookie(
			this.REFRESH_TOKEN_NAME,
			refreshToken,
			getRefreshCookieConfig(this.configService, expiresIn)
		);
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(
			this.REFRESH_TOKEN_NAME,
			"",
			getRefreshCookieConfig(this.configService)
		);
	}
}
