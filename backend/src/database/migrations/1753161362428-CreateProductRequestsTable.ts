import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductRequestsTable1753161362428 implements MigrationInterface {
    name = 'CreateProductRequestsTable1753161362428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Only drop and re-add if needed, and ensure correct ON DELETE CASCADE for products
        // If the FK already has CASCADE, these lines might not be needed or cause issues.
        // It's safer to just comment them out if the previous migration already set CASCADE.
        // If your database currently has NO ACTION for products FK, then you should keep these lines
        // but change the re-add line to ON DELETE CASCADE.

        // Assuming you want ON DELETE CASCADE for products table:
        // Check if the constraint exists and drop it if needed. This is defensive.
        const productsTable = await queryRunner.getTable("products");
        const existingShopkeeperFk = productsTable?.foreignKeys.find(fk => fk.columnNames.includes("shopkeeperId"));
        if (existingShopkeeperFk) {
            await queryRunner.dropForeignKey("products", existingShopkeeperFk);
        }

        await queryRunner.query(`CREATE TYPE "public"."product_requests_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "product_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid NOT NULL, "requesterId" uuid NOT NULL, "initiatorId" uuid NOT NULL, "quantity" integer NOT NULL, "status" "public"."product_requests_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_95548600cf27dcc824033dea8cd" PRIMARY KEY ("id"))`);

        // Re-add/Add the foreign key for products with ON DELETE CASCADE
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        // Foreign keys for product_requests table - assuming NO ACTION is desired for these
        await queryRunner.query(`ALTER TABLE "product_requests" ADD CONSTRAINT "FK_d2df07b95e4fc34be8adc3a9596" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_requests" ADD CONSTRAINT "FK_7497046b487f68b80d723e03c69" FOREIGN KEY ("requesterId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_requests" ADD CONSTRAINT "FK_36aa0a2064dfc215c12d1d8ecc1" FOREIGN KEY ("initiatorId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Ensure down method correctly drops the new FKs and table
        await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_36aa0a2064dfc215c12d1d8ecc1"`);
        await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_7497046b487f68b80d723e03c69"`);
        await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_d2df07b95e4fc34be8adc3a9596"`);
        await queryRunner.query(`DROP TABLE "product_requests"`);
        await queryRunner.query(`DROP TYPE "public"."product_requests_status_enum"`);

        // Re-add the original FK for products table with CASCADE (if it was there before)
        // If your previous migration already handles this, remove these lines from down.
        // It's crucial down reverses up correctly.
        const productsTable = await queryRunner.getTable("products");
        const currentShopkeeperFk = productsTable?.foreignKeys.find(fk => fk.columnNames.includes("shopkeeperId"));
        if (!currentShopkeeperFk) { // Only re-add if it doesn't exist (i.e. if it was dropped in up)
            await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        }
    }

}
