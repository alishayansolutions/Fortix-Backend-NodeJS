export interface BusinessCase {
  id: number;
  name: string;
  detection_type: 'HARNESS' | 'CATTLE' | 'SECURITY';
  confidence_threshold: number;
  objects_to_detect: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateBusinessCaseDTO {
  name: string;
  detection_type: 'HARNESS' | 'CATTLE' | 'SECURITY';
  confidence_threshold: number;
  objects_to_detect: string[];
}

export interface UpdateBusinessCaseDTO {
  name?: string;
  detection_type?: 'HARNESS' | 'CATTLE' | 'SECURITY';
  confidence_threshold?: number;
  objects_to_detect?: string[];
} 