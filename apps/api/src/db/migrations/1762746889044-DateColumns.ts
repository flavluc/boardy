import type { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1762746889044 implements MigrationInterface {
  name = 'Init1762746889044'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33"`
    )
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "ownerId"`)
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`ALTER TABLE "projects" ADD "owner_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "columns" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "columns" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_b1bd2fbf5d0ef67319c91acb5cf" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_b1bd2fbf5d0ef67319c91acb5cf"`
    )
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "columns" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "projects" ADD "ownerId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }
}
