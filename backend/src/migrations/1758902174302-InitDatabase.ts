import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1758902174302 implements MigrationInterface {
  name = 'InitDatabase1758902174302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying NOT NULL, "full_name" character varying NOT NULL, "job_position" character varying NOT NULL, "image_file_url" character varying NOT NULL, "is_admin" boolean NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "employee"`);
  }
}
