import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShopkeepers1689662574000 implements MigrationInterface {
    name = 'CreateShopkeepers1689662574000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE "shopkeepers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "shopName" varchar NOT NULL,
                "address" varchar NOT NULL,
                "phone" varchar, -- isNullable is implied by not having NOT NULL
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_c626e2e5c8e3b3e32b8e3a2c204" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shopkeepers"`);
    }
}