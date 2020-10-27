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

	const userData: User = {
		...mockedUser,
	};

	beforeEach(async () => {
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

		describe("and the provided password is not valid", () => {
			beforeEach(() => {
				bcryptCompare.mockReturnValue(false);
			});

			it("should throw an error", async () => {
				await expect(
					authenticationService.getAuthenticatedUser(
						"user@email.com",
						"strongPassword",
					),
				).rejects.toThrow();
			});
		});

		describe("and the provided password is valid", () => {
			beforeEach(() => {
				bcryptCompare.mockReturnValue(true);
			});

			describe("and the user is found in the database", () => {
				beforeEach(() => {
					findUser.mockResolvedValue(userData);
				});

				it("should return the user data", async () => {
					const user = await authenticationService.getAuthenticatedUser(
						"user@email.com",
						"strongPassword",
					);
					expect(user).toBe(userData);
				});
			});

			describe("and the user is not found in the database", () => {
				beforeEach(() => {
					findUser.mockResolvedValue(undefined);
				});

				it("should throw an error", async () => {
					await expect(
						authenticationService.getAuthenticatedUser(
							"user@email.com",
							"strongPassword",
						),
					).rejects.toThrow();
				});
			});
		});
	});
});
