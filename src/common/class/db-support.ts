import { QueryRunner } from "typeorm";

/**
 * data base support function
 */
export class DatabaseSupport {
  /**
   * roll back transaction
   * only rollback transaction if transaction is active
   * @param queryRunner
   */
  public static async rollBackTransaction(queryRunner: QueryRunner): Promise<void> {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
  }

  /**
   * release query runner
   * only release if not release
   * @param queryRunner
   */
  public static async releaseQueryRunner(queryRunner: QueryRunner): Promise<void> {
    if (!queryRunner.isReleased) {
      await queryRunner.release();
    }
  }
}
