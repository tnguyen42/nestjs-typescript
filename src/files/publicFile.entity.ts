import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../users/user.entity";

@Entity()
class PublicFile {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public url: string;

	@Column()
	public key: string;
}

export default PublicFile;
