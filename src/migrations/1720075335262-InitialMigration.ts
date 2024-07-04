import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1720075335262 implements MigrationInterface {
    name = 'InitialMigration1720075335262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum" AS ENUM('cash', 'card', 'stripe')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "shippingDetails" jsonb, "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending', "paymentMethod" "public"."order_paymentmethod_enum" NOT NULL DEFAULT 'cash', "totalAmount" numeric(10,2) NOT NULL, "variants" jsonb, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" SERIAL NOT NULL, "fname" character varying NOT NULL, "lname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "verifyToken" character varying NOT NULL DEFAULT '', "verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "pageTitle" character varying NOT NULL, "metaDescription" character varying NOT NULL, "picUrl" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "short_description" text NOT NULL, "price" numeric NOT NULL, "old_price" numeric, "page_title" character varying NOT NULL, "meta_description" character varying NOT NULL, "visible" boolean NOT NULL, "tags" text array NOT NULL, "images" text array NOT NULL, "variants" json, "categoryId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "clientId" integer, "productId" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "fname" character varying NOT NULL, "lname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "verifyToken" character varying NOT NULL DEFAULT '', CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1d66517fdfedb009ca7732a7e7f" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1d66517fdfedb009ca7732a7e7f"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    }

}
