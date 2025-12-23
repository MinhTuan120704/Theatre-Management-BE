import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import Room from "./room.model";
import Ticket from "./ticket.model";

@Table({
  tableName: "seat",
  timestamps: true,
})
export default class Seat extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Room)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare roomId: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare seatNumber: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isReserved: boolean;

  // Associations
  @BelongsTo(() => Room)
  room?: Room;

  @HasMany(() => Ticket)
  tickets?: Ticket[];
}
