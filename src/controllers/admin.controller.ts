import { Request, Response } from 'express';
import * as adminModel from '../models/admin.model';
import { AdminLoginDTO, Admin2FAVerifyDTO } from '../types/admin.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from '../utils/response-utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

export const login = async (req: Request, res: Response) => {
  const { username, password }: AdminLoginDTO = req.body;

  const admin = await adminModel.findByUsername(username);
  if (!admin) {
    const [errorResponse, status] = ResponseUtils.error('Invalid credentials', 401);
    return res.status(status).json(errorResponse);
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    const [errorResponse, status] = ResponseUtils.error('Invalid credentials', 401);
    return res.status(status).json(errorResponse);
  }

  if (admin.is_2fa_enabled) {
    const tempToken = jwt.sign(
      { id: admin.id, require2FA: true },
      process.env.JWT_SECRET!,
      { expiresIn: '30s' }
    );

    const code = speakeasy.totp({
      secret: admin.secret_2fa!,
      encoding: 'base32'
    });
    console.log("2FA code: ", code);

    const [successResponse, status] = ResponseUtils.success({
      tempToken,
      require2FA: true
    }, '2FA code sent to your email');
    return res.status(status).json(successResponse);
  }

  const token = jwt.sign(
    { id: admin.id },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  const { password: _, secret_2fa: __, ...adminData } = admin;
  const [successResponse, status] = ResponseUtils.success({ user: adminData, token });
  res.status(status).json(successResponse);
};

export const verify2FA = async (req: Request, res: Response) => {
  const { token, code }: Admin2FAVerifyDTO = req.body;

  // Verify temp token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, require2FA: boolean };
  if (!decoded.require2FA) {
    const [errorResponse, status] = ResponseUtils.error('Invalid token', 400);
    return res.status(status).json(errorResponse);
  }

  // Use findById instead of findByUsername
  const admin = await adminModel.findById(decoded.id);
  if (!admin) {
    const [errorResponse, status] = ResponseUtils.error('Admin not found', 401);
    return res.status(status).json(errorResponse);
  }

  // Verify 2FA code
  const isValid = speakeasy.totp.verify({
    secret: admin.secret_2fa!,
    encoding: 'base32',
    token: code,
    window: 1 // Allows for 30 seconds of time drift
  });

  if (!isValid) {
    const [errorResponse, status] = ResponseUtils.error('Invalid 2FA code', 401);
    return res.status(status).json(errorResponse);
  }

  // Generate final token
  const finalToken = jwt.sign(
    { id: admin.id },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  const { password: _, secret_2fa: __, ...adminData } = admin;
  const [successResponse, status] = ResponseUtils.success({ user: adminData, token: finalToken });
  res.status(status).json(successResponse);
};

export const enable2FA = async (req: AuthRequest, res: Response) => {
  const id = req.id;
  if (!id) {
    const [errorResponse, status] = ResponseUtils.error('Unauthorized', 401);
    return res.status(status).json(errorResponse);
  }

  // Verify admin exists
  const admin = await adminModel.findById(id);
  if (!admin) {
    const [errorResponse, status] = ResponseUtils.error('Admin not found', 404);
    return res.status(status).json(errorResponse);
  }

  const secret = speakeasy.generateSecret();
  await adminModel.updateAdmin2FASecret(id, secret.base32);

  const [successResponse, status] = ResponseUtils.success(null, '2FA has been enabled');
  res.status(status).json(successResponse);
};

export const disable2FA = async (req: AuthRequest, res: Response) => {
  const id = req.id;
  if (!id) {
    const [errorResponse, status] = ResponseUtils.error('Unauthorized', 401);
    return res.status(status).json(errorResponse);
  }

  // Verify admin exists
  const admin = await adminModel.findById(id);
  if (!admin) {
    const [errorResponse, status] = ResponseUtils.error('Admin not found', 404);
    return res.status(status).json(errorResponse);
  }
  
  await adminModel.disable2FA(id);

  const [successResponse, status] = ResponseUtils.success(null, '2FA has been disabled');
  res.status(status).json(successResponse);
}; 