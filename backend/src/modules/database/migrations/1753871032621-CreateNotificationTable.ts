import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTable1753871032621 implements MigrationInterface {
    name = 'CreateNotificationTable1753871032621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('INFO', 'WARNING', 'ERROR', 'PRODUCT_REQUEST_SENT', 'PRODUCT_REQUEST_ACCEPTED', 'PRODUCT_REQUEST_REJECTED', 'PRODUCT_REQUEST_CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'INFO', "message" text NOT NULL, "link" character varying, "isRead" boolean NOT NULL DEFAULT false, "relatedEntityId" character varying, "expiresAt" TIMESTAMP WITH TIME ZONE, "senderId" uuid, "receiverId" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b97e9ee24acf092bcdbc10bc15" ON "notifications" ("receiverId", "isRead", "created_at") `);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_ddb7981cf939fe620179bfea33a" FOREIGN KEY ("senderId") REFERENCES "shopkeepers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_d1e9b2452666de3b9b4d271cca0" FOREIGN KEY ("receiverId") REFERENCES "shopkeepers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_d1e9b2452666de3b9b4d271cca0"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_ddb7981cf939fe620179bfea33a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b97e9ee24acf092bcdbc10bc15"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
