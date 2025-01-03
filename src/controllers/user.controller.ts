import { Response } from 'express';
import * as userModel from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { APIError } from '../utils/route-utils';
import { ResponseUtils } from '../utils/response-utils';

export const createUser = async (req: AuthRequest, res: Response) => {
  const userData: CreateUserDTO = req.body;

  // Check if username already exists
  const existingUsername = await userModel.findByUsername(userData.username);
  if (existingUsername) {
    throw new APIError('Username already exists', 400);
  }

  // Check if email already exists
  const existingEmail = await userModel.findByEmail(userData.email);
  if (existingEmail) {
    throw new APIError('Email already registered', 400);
  }

  const newUser = await userModel.createUser(userData);
  res.status(201).json(ResponseUtils.success(
    { user: newUser },
    'User created successfully'
  ));
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const users = await userModel.getAllUsers();
  res.json(ResponseUtils.success({ users }));
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await userModel.getUserById(userId);
  
  if (!user) {
    throw new APIError('User not found', 404);
  }

  const { password, ...userWithoutPassword } = user;
  res.json(ResponseUtils.success({ user: userWithoutPassword }));
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  const updateData: UpdateUserDTO = req.body;

  // Check if user exists
  const existingUser = await userModel.getUserById(userId);
  if (!existingUser) {
    throw new APIError('User not found', 404);
  }

  // Check username uniqueness
  if (updateData.username && updateData.username !== existingUser.username) {
    const usernameExists = await userModel.findByUsername(updateData.username);
    if (usernameExists) {
      throw new APIError('Username already in use', 400);
    }
  }

  // Check email uniqueness
  if (updateData.email && updateData.email !== existingUser.email) {
    const emailExists = await userModel.findByEmail(updateData.email);
    if (emailExists) {
      throw new APIError('Email already in use', 400);
    }
  }

  const updatedUser = await userModel.updateUser(userId, updateData);
  if (!updatedUser) {
    throw new APIError('No updates provided', 400);
  }

  res.json(ResponseUtils.success(
    { user: updatedUser },
    'User updated successfully'
  ));
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  const deleted = await userModel.deleteUser(userId);
  if (!deleted) {
    throw new APIError('User not found', 404);
  }

  res.json(ResponseUtils.success(null, 'User deleted successfully'));
}; 