import {
	Body,
	Req,
	Controller,
	HttpCode,
	Post,
	UseGuards,
	Get,
	UseInterceptors,
	ClassSerializerInterceptor,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import RegisterDto from "../users/dto/register.dto";
import RequestWithUser from "./requestWithUser.interface";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import { JwtAuthenticationGuard } from "./jwt-authentication.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("authentication")
@UseInterceptors(ClassSerializerInterceptor)
@Controller("authentication")
export class AuthenticationController {
	constructor(private readonly authenticationService: AuthenticationService) {}

	@UseGuards(JwtAuthenticationGuard)
	@Get()
	authenticate(@Req() request: RequestWithUser) {
		const user = request.user;
		return user;
	}

	@Post("register")
	async register(@Body() registrationData: RegisterDto) {
		return this.authenticationService.register(registrationData);
	}

	@HttpCode(200)
	@UseGuards(LocalAuthenticationGuard)
	@Post("log-in")
	async logIn(@Req() request: RequestWithUser) {
		const { user } = request;
		const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
		request.res.setHeader("Set-Cookie", cookie);
		return user;
	}

	@UseGuards(JwtAuthenticationGuard)
	@Post("log-out")
	async logOut(@Req() request: RequestWithUser) {
		request.res.setHeader(
			"Set-Cookie",
			this.authenticationService.getCookieForLogOut(),
		);
	}
}
