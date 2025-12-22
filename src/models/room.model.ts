import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";
import Cinema from "./cinema.model";
import ShowTime from "./showTime.model";

@Table({
  tableName: "room",
  timestamps: true,
})
export default class Room extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Cinema)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare cinemaId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare capacity: number;

  @BelongsTo(() => Cinema)
  cinema?: Cinema;

  @HasMany(() => ShowTime)
  showTimes?: ShowTime[];
}
