import { IsNumberString } from "class-validator";

export class FindOneParams {
	@IsNumberString()
	id: string;
}

export default FindOneParams;
