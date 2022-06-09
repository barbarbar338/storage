import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
	tableName: "urls",
	timestamps: true,
	comment: "URL Model",
})
export class URLModel extends Model {
	@Column({
		allowNull: false,
		primaryKey: true,
		type: DataType.INTEGER,
		autoIncrement: true,
		comment: "URL ID",
		unique: true,
	})
	id: number;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		comment: "Main URL",
		validate: {
			isUrl: true,
		},
	})
	url: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		comment: "Shortened URL",
	})
	code: string;
}
