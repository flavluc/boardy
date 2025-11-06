import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1762440779101 implements MigrationInterface {
    name = 'Init1762440779101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "columns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "position" integer NOT NULL DEFAULT '1000', "projectId" uuid, CONSTRAINT "PK_4ac339ccbbfed1dcd96812abbd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6c35c67989390650b638e59a97" ON "columns" ("projectId", "position") `);
        await queryRunner.query(`CREATE TABLE "project_members" ("userId" uuid NOT NULL, "projectId" uuid NOT NULL, CONSTRAINT "PK_326b2a901eb18ac24eabc9b0581" PRIMARY KEY ("userId", "projectId"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "position" integer NOT NULL DEFAULT '1000', "columnId" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_540cd4d20b84bbd86325873aaa" ON "tasks" ("columnId", "position") `);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "columns" ADD CONSTRAINT "FK_3f28d61a92b732bfb574c3b71a2" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_08d1346ff91abba68e5a637cfdb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_d19892d8f03928e5bfc7313780c" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_d19892d8f03928e5bfc7313780c"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_08d1346ff91abba68e5a637cfdb"`);
        await queryRunner.query(`ALTER TABLE "columns" DROP CONSTRAINT "FK_3f28d61a92b732bfb574c3b71a2"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_540cd4d20b84bbd86325873aaa"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "project_members"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c35c67989390650b638e59a97"`);
        await queryRunner.query(`DROP TABLE "columns"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
