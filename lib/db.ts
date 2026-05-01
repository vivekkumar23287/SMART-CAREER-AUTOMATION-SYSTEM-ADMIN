import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);

export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(queryString, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
