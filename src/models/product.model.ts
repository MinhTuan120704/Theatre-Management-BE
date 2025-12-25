import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import OrderProductDetails from "./orderProductDetails.model";

@Table({
  tableName: "product",
  timestamps: false,
})
export default class Product extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.ENUM("food", "drink"),
    allowNull: false,
  })
  declare category: "food" | "drink";

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare image: string;

  // Associations
  @HasMany(() => OrderProductDetails)
  orderProductDetails?: OrderProductDetails[];
}
