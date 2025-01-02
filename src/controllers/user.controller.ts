import { Request, Response } from 'express';
import * as userModel from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const userData: CreateUserDTO = req.body;

    // Check if username already exists
    const existingUsername = await userModel.findByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await userModel.findByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = await userModel.createUser(userData);
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const updateData: UpdateUserDTO = req.body;

    // Check if user exists
    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check username uniqueness if username is being updated
    if (updateData.username && updateData.username !== existingUser.username) {
      const usernameExists = await userModel.findByUsername(updateData.username);
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await userModel.findByEmail(updateData.email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await userModel.updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    const deleted = await userModel.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
}; 