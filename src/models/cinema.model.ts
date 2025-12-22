import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import Room from "./room.model";

@Table({
  tableName: "cinema",
  timestamps: true,
})
export default class Cinema extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare address: string;

  @HasMany(() => Room)
  rooms?: Room[];
}
