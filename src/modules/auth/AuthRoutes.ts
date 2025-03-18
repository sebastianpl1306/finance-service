import { Router} from 'express';
import { check } from 'express-validator';

import { validateJWT, validateJWTCustomer, fileValidators } from '../../middlewares';
import { AuthController } from './AuthController';

const authController = new AuthController();

export const AuthRouter: Router = Router();
AuthRouter.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 5 }),
        fileValidators
    ],
    authController.createUser.bind(authController)
);

AuthRouter.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 caracteres').not().isEmpty(),
    fileValidators
], authController.login.bind(authController));

AuthRouter.get(
    '/renew',
    validateJWT,
    authController.reloadToken.bind(authController)
);

AuthRouter.get('/userInfo', validateJWTCustomer, authController.getUserInfo.bind(authController));

AuthRouter.put('/', validateJWTCustomer, authController.changeUserInfo.bind(authController));