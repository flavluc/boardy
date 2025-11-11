import type { MigrationInterface, QueryRunner } from 'typeorm'

export class Refresh1762891270290 implements MigrationInterface {
  name = 'Refresh1762891270290'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "revoked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`
    )
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`)
    await queryRunner.query(`DROP TABLE "refresh_tokens"`)
  }
}
