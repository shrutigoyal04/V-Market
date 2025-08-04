import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveShopNameUniqueConstraint1753939478800 implements MigrationInterface {
    name = 'RemoveShopNameUniqueConstraint1753939478800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_requests" ADD "notes" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."product_requests_status_enum" RENAME TO "product_requests_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."product_requests_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "product_requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_requests" ALTER COLUMN "status" TYPE "public"."product_requests_status_enum" USING "status"::"text"::"public"."product_requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "product_requests" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."product_requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "link" text`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "relatedEntityId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "relatedEntityId" text`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "shopkeeperId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "shopkeeperId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "relatedEntityId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "relatedEntityId" character varying`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "link"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "link" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."product_requests_status_enum_old" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "product_requests" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_requests" ALTER COLUMN "status" TYPE "public"."product_requests_status_enum_old" USING "status"::"text"::"public"."product_requests_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "product_requests" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."product_requests_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."product_requests_status_enum_old" RENAME TO "product_requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "product_requests" DROP COLUMN "notes"`);
    }

}
