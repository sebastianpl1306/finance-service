import { NextFunction, Response } from "express";
import { UserMembershipModel } from "../database";

export const validateMembership = async(request: any, response: Response, next: NextFunction) => {
  const { tokenInfo } = request.body;

  try {
    const membership = await UserMembershipModel.findOne({ user: tokenInfo.uid, isActive: true });

    if(!membership) {
      return response.status(401).json({
        ok: 'false',
        msg: 'No tienes una membresía activa'
      })
    }

    if (!membership.isActive || new Date(membership.endDate) < new Date()) {
      return response.status(401).json({
        ok: 'false',
        msg: 'Membresía no activa o expirada'
      })
    }
  } catch (error) {
    return response.status(401).json({
      ok: 'false',
      msg: 'Token invalido!'
    })
  }

  next();
}