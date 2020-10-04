import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateCatDto } from "./create-cat.dto";

@Controller({ path: "cats" })
export class CatsController {
	@Post()
	async create(@Body() createCatDto: CreateCatDto) {
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
