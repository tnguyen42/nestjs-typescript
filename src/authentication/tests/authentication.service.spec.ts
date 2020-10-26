import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { AuthenticationService } from "../authentication.service";
import { UsersService } from "../../users/users.service";
import mockedConfigService from "../../utils/mocks/config.service";
import mockedJwtService from "../../utils/mocks/jwt.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import User from "../../users/user.entity";
import Address from "../../users/address.entity";
import mockedUser from "../../users/tests/user.mock";

describe("Then AuthenticationService", () => {
	let authenticationService: AuthenticationService;
	let usersService: UsersService;
	let bcryptCompare: jest.Mock;
	let findUser: jest.Mock;

	beforeEach(async () => {
		const userData = {
			...mockedUser,
		};

		bcryptCompare = jest.fn().mockReturnValue(true);
		(bcrypt.compare as jest.Mock) = bcryptCompare;

		findUser = jest.fn().mockResolvedValue(userData);
		const usersRepository = {
			findOne: findUser,
		};

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
					useValue: usersRepository,
				},
				{
					provide: getRepositoryToken(Address),
					useValue: {},
				},
			],
		}).compile();
		authenticationService = await module.get(AuthenticationService);
		usersService = await module.get(UsersService);
	});

	describe("when creating a cookie", () => {
		it("should return a string", () => {
			const userId = 1;
			expect(
				typeof authenticationService.getCookieWithJwtToken(userId),
			).toEqual("string");
		});
	});

	describe("when accessing the data of authenticating user", () => {
		it("should attempt to get a user by email", async () => {
			const getByEmailSpy = jest.spyOn(usersService, "getByEmail");
			await authenticationService.getAuthenticatedUser(
				"test9@test.com",
				"1234567",
			);
			expect(getByEmailSpy).toBeCalledTimes(1);
		});
	});
});
