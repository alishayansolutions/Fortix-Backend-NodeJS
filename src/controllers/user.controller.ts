import { Response } from 'express';
import * as userModel from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from '../utils/response-utils';

export const createUser = async (req: AuthRequest, res: Response) => {
  const userData: CreateUserDTO = req.body;

  // Check if username already exists
  const existingUsername = await userModel.findByUsername(userData.username);
  if (existingUsername) {
    const [errorResponse, status] = ResponseUtils.error('Username already exists', 400);
    return res.status(status).json(errorResponse);
  }

  // Check if email already exists
  const existingEmail = await userModel.findByEmail(userData.email);
  if (existingEmail) {
    const [errorResponse, status] = ResponseUtils.error('Email already registered', 400);
    return res.status(status).json(errorResponse);
  }

  const newUser = await userModel.createUser(userData);
  const [successResponse, status] = ResponseUtils.success(
    { user: newUser },
    'User created successfully',
    201
  );
  res.status(status).json(successResponse);
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const users = await userModel.getAllUsers();
  const [successResponse, status] = ResponseUtils.success({ users });
  res.status(status).json(successResponse);
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await userModel.getUserById(userId);
  
  if (!user) {
    const [errorResponse, status] = ResponseUtils.error('User not found', 404);
    return res.status(status).json(errorResponse);
  }

  const { password, ...userWithoutPassword } = user;
  const [successResponse, status] = ResponseUtils.success({ user: userWithoutPassword });
  res.status(status).json(successResponse);
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  const updateData: UpdateUserDTO = req.body;

  // Check if user exists
  const existingUser = await userModel.getUserById(userId);
  if (!existingUser) {
    const [errorResponse, status] = ResponseUtils.error('User not found', 404);
    return res.status(status).json(errorResponse);
  }

  // Check username uniqueness
  if (updateData.username && updateData.username !== existingUser.username) {
    const usernameExists = await userModel.findByUsername(updateData.username);
    if (usernameExists) {
      const [errorResponse, status] = ResponseUtils.error('Username already in use', 400);
      return res.status(status).json(errorResponse);
    }
  }

  // Check email uniqueness
  if (updateData.email && updateData.email !== existingUser.email) {
    const emailExists = await userModel.findByEmail(updateData.email);
    if (emailExists) {
      const [errorResponse, status] = ResponseUtils.error('Email already in use', 400);
      return res.status(status).json(errorResponse);
    }
  }

  const updatedUser = await userModel.updateUser(userId, updateData);
  if (!updatedUser) {
    const [errorResponse, status] = ResponseUtils.error('No updates provided', 400);
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    { user: updatedUser },
    'User updated successfully'
  );
  res.status(status).json(successResponse);
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  const deleted = await userModel.deleteUser(userId);
  if (!deleted) {
    const [errorResponse, status] = ResponseUtils.error('User not found', 404);
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    null,
    'User deleted successfully'
  );
  res.status(status).json(successResponse);
}; 