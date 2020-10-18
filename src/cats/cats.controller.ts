import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("cats")
@Controller({ path: "cats" })
export class CatsController {
	@Post()
	async create() {
		return "This action adds a new cat";
	}

	@Get()
	findAll(): string {
		return "This action returns all cats";
	}

	@Get(":id")
	findOne(@Param() params: { id: number }): string {
		return `This action returns a #${params.id} cat`;
	}
}
