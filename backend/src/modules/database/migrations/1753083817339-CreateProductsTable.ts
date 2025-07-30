import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1753083817339 implements MigrationInterface {
    name = 'CreateProductsTable1753083817339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "description" character varying, "imageUrl" character varying, "shopkeeperId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shopkeepers" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shopkeepers" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf"`);
        await queryRunner.query(`ALTER TABLE "shopkeepers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "shopkeepers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
