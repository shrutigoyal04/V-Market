import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTransferHistoryTable1753247864887 implements MigrationInterface {
    name = 'CreateProductTransferHistoryTable1753247864887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf"`);
        await queryRunner.query(`CREATE TABLE "product_transfer_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid NOT NULL, "initiatorShopkeeperId" uuid NOT NULL, "receiverShopkeeperId" uuid NOT NULL, "quantityTransferred" integer NOT NULL, "requestId" uuid, "notes" text, CONSTRAINT "PK_6b907a8ea23d71e23f93e808f3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" ADD CONSTRAINT "FK_f80455ee3c012475b5c125cb998" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" ADD CONSTRAINT "FK_7f5f5a4b9ea2ac552a584cdb880" FOREIGN KEY ("initiatorShopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" ADD CONSTRAINT "FK_768e334ddd378d4a638a531d398" FOREIGN KEY ("receiverShopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" ADD CONSTRAINT "FK_ab140d6d965dccd682b91efbc3c" FOREIGN KEY ("requestId") REFERENCES "product_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_transfer_history" DROP CONSTRAINT "FK_ab140d6d965dccd682b91efbc3c"`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" DROP CONSTRAINT "FK_768e334ddd378d4a638a531d398"`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" DROP CONSTRAINT "FK_7f5f5a4b9ea2ac552a584cdb880"`);
        await queryRunner.query(`ALTER TABLE "product_transfer_history" DROP CONSTRAINT "FK_f80455ee3c012475b5c125cb998"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf"`);
        await queryRunner.query(`DROP TABLE "product_transfer_history"`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_cbc9077fb054f6abcec7e32eebf" FOREIGN KEY ("shopkeeperId") REFERENCES "shopkeepers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
