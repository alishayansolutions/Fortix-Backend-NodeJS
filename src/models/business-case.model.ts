import pool from '../config/database';
import { BusinessCase, CreateBusinessCaseDTO, UpdateBusinessCaseDTO } from '../types/business-case.types';

export const createBusinessCase = async (data: CreateBusinessCaseDTO): Promise<BusinessCase> => {
  const query = `
    INSERT INTO business_cases 
    (name, detection_type, confidence_threshold, objects_to_detect) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;

  const result = await pool.query(query, [
    data.name,
    data.detection_type,
    data.confidence_threshold,
    data.objects_to_detect
  ]);
  return result.rows[0];
};

export const getAllBusinessCases = async (): Promise<BusinessCase[]> => {
  const query = `
    SELECT *
    FROM business_cases 
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

export const getBusinessCaseById = async (id: number): Promise<BusinessCase | null> => {
  const query = `
    SELECT *
    FROM business_cases 
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const updateBusinessCase = async (id: number, data: UpdateBusinessCaseDTO): Promise<BusinessCase | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let valueCount = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updates.push(`${key} = $${valueCount}`);
      values.push(value);
      valueCount++;
    }
  });

  if (updates.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE business_cases 
    SET ${updates.join(', ')}, updated_at = NOW() 
    WHERE id = $${valueCount} 
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteBusinessCase = async (id: number): Promise<boolean> => {
  const query = `
    DELETE FROM business_cases 
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return (result.rowCount as number) > 0;
}; 