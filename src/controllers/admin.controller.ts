import { Request, Response } from 'express';
import * as adminModel from '../models/admin.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { AdminLoginDTO, Admin2FAVerifyDTO } from '../types/admin.types';
import { send2FACode } from '../services/email.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password }: AdminLoginDTO = req.body;

    // Find admin by username
    const admin = await adminModel.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.is_2fa_enabled) {
      // Generate temporary token for 2FA verification
      const tempToken = jwt.sign(
        { id: admin.id, require2FA: true },
        process.env.JWT_SECRET!,
        { expiresIn: '30s' }
      );

      // Generate and send 2FA code
      const code = speakeasy.totp({
        secret: admin.secret_2fa!,
        encoding: 'base32'
      });
      console.log("2FA code: ", code);

    //   await send2FACode(admin.email, code);

      return res.json({
        message: '2FA code sent to your email',
        tempToken,
        require2FA: true
      });
    }

    // If 2FA is not enabled, generate final token
    const token = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password: _, secret_2fa: __, ...adminData } = admin;
    res.json({ user: adminData, token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { token, code }: Admin2FAVerifyDTO = req.body;

    // Verify temp token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, require2FA: boolean };
    if (!decoded.require2FA) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Use findById instead of findByUsername
    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Verify 2FA code
    const isValid = speakeasy.totp.verify({
      secret: admin.secret_2fa!,
      encoding: 'base32',
      token: code,
      window: 1 // Allows for 30 seconds of time drift
    });

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid 2FA code' });
    }

    // Generate final token
    const finalToken = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const { password: _, secret_2fa: __, ...adminData } = admin;
    res.json({ user: adminData, token: finalToken });
  } catch (error) {
    res.status(500).json({ message: 'Error during 2FA verification', error });
  }
};

export const enable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.id;
    if (!id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify admin exists
    const admin = await adminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const secret = speakeasy.generateSecret();
    await adminModel.updateAdmin2FASecret(id, secret.base32);

    res.json({ message: '2FA has been enabled' });
  } catch (error) {
    res.status(500).json({ message: 'Error enabling 2FA', error });
  }
};

export const disable2FA = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.id;
    if (!id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify admin exists
    const admin = await adminModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    await adminModel.disable2FA(id);

    res.json({ message: '2FA has been disabled' });
  } catch (error) {
    res.status(500).json({ message: 'Error disabling 2FA', error });
  }
}; 