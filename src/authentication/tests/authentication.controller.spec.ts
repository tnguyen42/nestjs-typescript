import {
	INestApplication,
	ClassSerializerInterceptor,
	ValidationPipe,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { getRepositoryToken } from "@nestjs/typeorm";

import User from "src/users/user.entity";
import Address from "src/users/address.entity";
import mockedUser from "src/users/tests/user.mock";
import { AuthenticationController } from "../authentication.controller";
import { ConfigService } from "@nestjs/config";
import { AuthenticationService } from "../authentication.service";
import { UsersService } from "src/users/users.service";
import mockedConfigService from "src/utils/mocks/config.service";
import mockedJwtService from "src/utils/mocks/jwt.service";
import { JwtService } from "@nestjs/jwt";

describe("The AuthenticationController", () => {
	let app: INestApplication;
	let userData: User;

	beforeEach(async () => {
		userData = {
			...mockedUser,
		};

		const userRepository = {
			// The mock should return a new instance of the class here, because jest will just return an object that looks like a class but is not - and therefore will skip the @Exclude decorators
			create: jest.fn().mockResolvedValue(new User(userData)),
			save: jest.fn().mockReturnValue(Promise.resolve()),
		};

		const module = await Test.createTestingModule({
			controllers: [AuthenticationController],
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
					useValue: userRepository,
				},
				{
					provide: getRepositoryToken(Address),
					useValue: {},
				},
			],
		}).compile();

		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe()); // enables class-transform decorators (for validation) @IsString, @MaxLength etc. to work everywhere
		app.useGlobalInterceptors(
			new ClassSerializerInterceptor(app.get(Reflector)),
		); // not working - @Exclude not working in the entities during the tests
		await app.init();
	});

	describe("when registering", () => {
		describe("and using valid data", () => {
			it("should respond with the data of the user without the password and ids", () => {
				const expectedData = {
					...userData,
				};
				delete expectedData.password;
				delete expectedData.id;
				delete expectedData.address.id;

				return request(app.getHttpServer())
					.post("/authentication/register")
					.send({
						email: mockedUser.email,
						name: mockedUser.name,
						password: "strongPassword",
					})
					.expect(201)
					.expect(expectedData);
			});
		});

		describe("and using invalid data", () => {
			it("should throw an error", () => {
				return request(app.getHttpServer())
					.post("/authentication/register")
					.send({
						name: mockedUser.name,
					})
					.expect(400);
			});
		});
	});
});
