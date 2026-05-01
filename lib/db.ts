import { neon } from '@neondatabase/serverless';

export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not defined. Skipping query.');
    return [] as T[];
  }

  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const result = await sql(queryString, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
