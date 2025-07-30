import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductRequestsTable1753161362428 implements MigrationInterface {
    name = 'CreateProductRequestsTable1753161362428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const productsTable = await queryRunner.getTable("products");
        const existingShopkeeperFk = productsTable?.foreignKeys.find(fk => fk.columnNames.includes("shopkeeperId"));
        if (existingShopkeeperFk) {
            await queryRunner.dropForeignKey("products", existingShopkeeperFk);
        }

        await queryRunner.query(`CREATE TYPE "public"."product_requests_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "product_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid NOT NULL, "requesterId" uuid NOT NULL, "initiatorId" uuid NOT NULL, "quantity" integer NOT NULL, "status" "public"."product_requests_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_95548600cf27dcc824033dea8cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_requests" ADD CONSTRAINT "FK_d2df07b95e4fc34be8adc3a9596" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_requests" ADD CONSTRAINT "FK_7497046b487f68b80d723e03c69" FOREIGN KEY ("requesterId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_requests" ADD CONSTRAINT "FK_36aa0a2064dfc215c12d1d8ecc1" FOREIGN KEY ("initiatorId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_36aa0a2064dfc215c12d1d8ecc1"`);
        await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_7497046b487f68b80d723e03c69"`);
        await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_d2df07b95e4fc34be8adc3a9596"`);
        await queryRunner.query(`DROP TABLE "product_requests"`);
        await queryRunner.query(`DROP TYPE "public"."product_requests_status_enum"`);
    }

}
