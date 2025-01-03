import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from '../utils/response-utils';
import { MESSAGES } from '../constants/messages';
import * as businessCaseModel from '../models/business-case.model';
import { CreateBusinessCaseDTO, UpdateBusinessCaseDTO } from '../types/business-case.types';

export const createBusinessCase = async (req: AuthRequest, res: Response) => {
  const businessCaseData: CreateBusinessCaseDTO = req.body;

  const newBusinessCase = await businessCaseModel.createBusinessCase(businessCaseData);
  const [successResponse, status] = ResponseUtils.created(
    { businessCase: newBusinessCase },
    MESSAGES.SUCCESS.BUSINESS_CASE_CREATED
  );
  res.status(status).json(successResponse);
};

export const getAllBusinessCases = async (req: AuthRequest, res: Response) => {
  const businessCases = await businessCaseModel.getAllBusinessCases();
  const [successResponse, status] = ResponseUtils.success(
    { businessCases },
    MESSAGES.SUCCESS.BUSINESS_CASES_FETCHED
  );
  res.status(status).json(successResponse);
};

export const getBusinessCaseById = async (req: AuthRequest, res: Response) => {
  const businessCaseId = parseInt(req.params.id);
  const businessCase = await businessCaseModel.getBusinessCaseById(businessCaseId);
  
  if (!businessCase) {
    const [errorResponse, status] = ResponseUtils.notFound(
      MESSAGES.ERROR.BUSINESS_CASE_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    { businessCase },
    MESSAGES.SUCCESS.BUSINESS_CASE_FETCHED
  );
  res.status(status).json(successResponse);
};

export const updateBusinessCase = async (req: AuthRequest, res: Response) => {
  const businessCaseId = parseInt(req.params.id);
  const updateData: UpdateBusinessCaseDTO = req.body;

  const existingBusinessCase = await businessCaseModel.getBusinessCaseById(businessCaseId);
  if (!existingBusinessCase) {
    const [errorResponse, status] = ResponseUtils.notFound(
      MESSAGES.ERROR.BUSINESS_CASE_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  const updatedBusinessCase = await businessCaseModel.updateBusinessCase(businessCaseId, updateData);
  if (!updatedBusinessCase) {
    const [errorResponse, status] = ResponseUtils.badRequest(
      MESSAGES.ERROR.NO_UPDATES
    );
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    { businessCase: updatedBusinessCase },
    MESSAGES.SUCCESS.BUSINESS_CASE_UPDATED
  );
  res.status(status).json(successResponse);
};

export const deleteBusinessCase = async (req: AuthRequest, res: Response) => {
  const businessCaseId = parseInt(req.params.id);
  
  const deleted = await businessCaseModel.deleteBusinessCase(businessCaseId);
  if (!deleted) {
    const [errorResponse, status] = ResponseUtils.notFound(
      MESSAGES.ERROR.BUSINESS_CASE_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    null,
    MESSAGES.SUCCESS.BUSINESS_CASE_DELETED
  );
  res.status(status).json(successResponse);
}; 