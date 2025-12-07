import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user.model";
import Movie from "./movie.model";

@Table({
  tableName: "reviews",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: false,
})
export default class Review extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare userId: number;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare movieId: number;

  @Column({
    type: DataType.DECIMAL(2, 1),
    allowNull: false,
  })
  declare rating: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comment: string;
}
