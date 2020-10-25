import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { AuthenticationService } from "../authentication.service";
import { UsersService } from "../../users/users.service";
import mockedConfigService from "../../utils/mocks/config.service";
import mockedJwtService from "../../utils/mocks/jwt.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../../users/user.entity";
import Address from "../../users/address.entity";

describe("Then AuthenticationService", () => {
	let authenticationService: AuthenticationService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UsersService,
				AuthenticationService,
				{
					provide: ConfigService,
					useValue: mockedConfigService,
				},
				{
					provide: JwtService,
					useValue: mockedJwtService,
				},
				{
					provide: getRepositoryToken(User),
					useValue: {},
				},
				{
					provide: getRepositoryToken(Address),
					useValue: {},
				},
			],
		}).compile();
		authenticationService = await module.get(AuthenticationService);
	});

	describe("when creating a cookie", () => {
		it("should return a string", () => {
			const userId = 1;
			expect(
				typeof authenticationService.getCookieWithJwtToken(userId),
			).toEqual("string");
		});
	});
});
