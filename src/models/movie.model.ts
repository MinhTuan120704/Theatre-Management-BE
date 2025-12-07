import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "movie",
  timestamps: true,
})
export default class Movie extends Model {
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
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare genres: string[];

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare director: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare releaseDate: Date;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  declare durationMinutes: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare country: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare actors: string[];

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare posterUrl: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare trailerUrl: string;
}
