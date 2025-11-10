export async function cleanDatabase(dataSource) {
  const entities = dataSource.entityMetadatas
  const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ')

  await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`)
}
