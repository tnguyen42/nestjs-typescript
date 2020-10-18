import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

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

	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());
	await app.listen(3000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
