import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Movie from "./movie.model";
import Room from "./room.model";

@Table({
  tableName: "show_time",
  timestamps: true,
})
export default class ShowTime extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare showTime: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare movieId: number;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare roomId: number;

  @BelongsTo(() => Movie)
  movie?: Movie;

  @BelongsTo(() => Room)
  room?: Room;
}
