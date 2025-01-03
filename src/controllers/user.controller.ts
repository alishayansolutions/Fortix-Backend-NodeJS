import { Request, Response } from 'express';
import * as userModel from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO, UserLoginDTO } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from '../utils/response-utils';
import { MESSAGES } from '../constants/messages';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: AuthRequest, res: Response) => {
  const userData: CreateUserDTO = req.body;

  const existingUsername = await userModel.findByUsername(userData.username);
  if (existingUsername) {
    const [errorResponse, status] = ResponseUtils.conflict(
      MESSAGES.ERROR.USERNAME_EXISTS
    );
    return res.status(status).json(errorResponse);
  }

  const existingEmail = await userModel.findByEmail(userData.email);
  if (existingEmail) {
    const [errorResponse, status] = ResponseUtils.conflict(
      MESSAGES.ERROR.EMAIL_EXISTS
    );
    return res.status(status).json(errorResponse);
  }

  const newUser = await userModel.createUser(userData);
  const [successResponse, status] = ResponseUtils.created(
    { user: newUser },
    MESSAGES.SUCCESS.USER_CREATED
  );
  res.status(status).json(successResponse);
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const users = await userModel.getAllUsers();
  const [successResponse, status] = ResponseUtils.success(
    { users },
    MESSAGES.SUCCESS.USERS_FETCHED
  );
  res.status(status).json(successResponse);
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = await userModel.getUserById(userId);
  
  if (!user) {
    const [errorResponse, status] = ResponseUtils.notFound(
      MESSAGES.ERROR.USER_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  const { password, ...userWithoutPassword } = user;
  const [successResponse, status] = ResponseUtils.success(
    { user: userWithoutPassword },
    MESSAGES.SUCCESS.USER_FETCHED
  );
  res.status(status).json(successResponse);
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  const updateData: UpdateUserDTO = req.body;

  // Check if user exists
  const existingUser = await userModel.getUserById(userId);
  if (!existingUser) {
    const [errorResponse, status] = ResponseUtils.notFound(
      MESSAGES.ERROR.USER_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  // Check username uniqueness
  if (updateData.username && updateData.username !== existingUser.username) {
    const usernameExists = await userModel.findByUsername(updateData.username);
    if (usernameExists) {
      const [errorResponse, status] = ResponseUtils.conflict(
        MESSAGES.ERROR.USERNAME_IN_USE
      );
      return res.status(status).json(errorResponse);
    }
  }

  // Check email uniqueness
  if (updateData.email && updateData.email !== existingUser.email) {
    const emailExists = await userModel.findByEmail(updateData.email);
    if (emailExists) {
      const [errorResponse, status] = ResponseUtils.conflict(
        MESSAGES.ERROR.EMAIL_IN_USE
      );
      return res.status(status).json(errorResponse);
    }
  }

  const updatedUser = await userModel.updateUser(userId, updateData);
  if (!updatedUser) {
    const [errorResponse, status] = ResponseUtils.badRequest(
      MESSAGES.ERROR.NO_UPDATES
    );
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    { user: updatedUser },
    MESSAGES.SUCCESS.USER_UPDATED
  );
  res.status(status).json(successResponse);
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = parseInt(req.params.id);
  
  const deleted = await userModel.deleteUser(userId);
  if (!deleted) {
    const [errorResponse, status] = ResponseUtils.notFound(
      MESSAGES.ERROR.USER_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  const [successResponse, status] = ResponseUtils.success(
    null,
    MESSAGES.SUCCESS.USER_DELETED
  );
  res.status(status).json(successResponse);
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: UserLoginDTO = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) {
    const [errorResponse, status] = ResponseUtils.unauthorized(
      MESSAGES.ERROR.EMAIL_NOT_FOUND
    );
    return res.status(status).json(errorResponse);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const [errorResponse, status] = ResponseUtils.unauthorized(
      MESSAGES.ERROR.INVALID_PASSWORD
    );
    return res.status(status).json(errorResponse);
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  const { password: _, ...userData } = user;
  const [successResponse, status] = ResponseUtils.success(
    { user: userData, token },
    MESSAGES.SUCCESS.USER_LOGIN
  );
  res.status(status).json(successResponse);
}; 