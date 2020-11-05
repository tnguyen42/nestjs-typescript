import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { config } from "aws-sdk";

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const options = new DocumentBuilder()
		.setTitle("Cats example")
		.setDescription("The cats API description")
		.setVersion("1.0")
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api", app, document);

	app.useGlobalPipes(new ValidationPipe()); // enables class-transform decorators (for validation) @IsString, @MaxLength etc. to work everywhere
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // enables class-transform decorators (for serialization) @Exclude, @Expose, @Transform, @SerializeOptions to work everywhere
	app.use(cookieParser());

	// AWS configuration
	const configService = app.get(ConfigService);
	config.update({
		accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
		secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
		region: configService.get("AWS_REGION"),
	});

	await app.listen(3000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
