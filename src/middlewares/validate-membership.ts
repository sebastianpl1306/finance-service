import { NextFunction, Response } from "express";
import { body, validationResult } from 'express-validator';

export const validateSubscription = [
  body('userId')
    .notEmpty()
    .withMessage('userId es requerido'),
  
  body('email')
    .isEmail()
    .withMessage('Email debe ser válido'),
  
  body('planId')
    .notEmpty()
    .withMessage('planId es requerido'),
  
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('amount debe ser un número mayor a 0'),
  
  body('frequency')
    .isIn(['monthly', 'yearly'])
    .withMessage('frequency debe ser monthly o yearly'),

  (req: any, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errors.array()
      });
    }
    next();
  }
];