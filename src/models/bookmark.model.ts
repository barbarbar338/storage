import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
	tableName: "bookmarks",
	timestamps: true,
	comment: "Bookmark Model",
})
export class BookmarkModel extends Model {
	@Column({
		allowNull: false,
		primaryKey: true,
		type: DataType.INTEGER,
		autoIncrement: true,
		comment: "Bookmark ID",
		unique: true,
	})
	id: number;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		comment: "Bookmark URL",
		validate: {
			isUrl: true,
		},
	})
	url: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		comment: "Bookmark Title",
	})
	title: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		comment: "Bookmark Description",
	})
	description: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
		comment: "Bookmark Image URL",
		validate: {
			isUrl: true,
		},
	})
	imageUrl: string;
}
