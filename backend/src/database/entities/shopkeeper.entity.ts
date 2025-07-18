import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { IsEmail, MinLength, IsString, IsPhoneNumber } from 'class-validator';
import { BaseEntity } from './base.entity';
import * as bcrypt from 'bcrypt';
import { Product } from './product.entity';

@Entity('shopkeepers')
export class Shopkeeper extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column()
  @IsString()
  @MinLength(2)
  shopName: string;

  @Column()
  @IsString()
  address: string;

  @Column({ nullable: true })
  @IsPhoneNumber()
  phone: string;

  @OneToMany(() => Product, product => product.shopkeeper)
  products: Product[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}