import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserMembershipModel, UserModel } from '../../database/models';
import { InfoTokenSave, User } from '../../interfaces';
import { generateJWT } from '../../helpers';
import { UserService } from '../user';

export class AuthController {
    private userService: UserService;

    constructor(){
        this.userService = new UserService();
    }

    /**
     * Permite registrar un nuevo usuario
     * @param request 
     * @param response 
     * @returns 
     */
    async createUser(request: Request, response: Response) {
        const { name, email, password, city, country }: User = request.body;

        try {
            if(!name || !email || !password){
                return response.status(400).json({
                    ok: false,
                    msg: 'information is missing'
                })
            }

            const newUser = await this.userService.createUser({ name, email, password, city, country });

            if( !newUser ){
                return response.status(500).json({
                    ok: false
                })
            }

            //Generar JWT
            const token = await generateJWT( newUser.id, newUser.role );

            return response.status(201).json({
                ok: true,
                uid: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isSubscribed: false,
                token
            });
        } catch (error) {
            console.error('[ERROR][createUser]'+error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    /**
     * Permite Iniciar Sesión con el email y la contraseña
     */
    async login (request: Request, response: Response){
        const { email, password }: User = request.body;
        try {
            if( !email || !password ){
                return response.status(400).json({
                    ok: false,
                    msg: 'information is missing'
                })
            }

            //Realizar la revisión para el inició de sesión
            const user = await this.userService.validateUserCredentials(email, password);

            //Genera error en caso de encontrar al usuario y que sus credenciales sean incorrectas
            if(!user){
                return response.status(500).json({
                    ok: false,
                    msg: 'Error invoke'
                })
            }

            const token = await generateJWT( user.uid as string, user.role );

            return response.status(201).json({
                ok: true,
                msg: 'Inicio de sesión exitoso',
                uid: user.uid,
                name: user.name,
                email: user.email,
                role: user.role,
                isSubscribed: user.isSubscribed,
                token,
            })
        } catch (error) {
            console.log('[ERROR][login]', error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! No se pudo iniciar sesión'
            });
        }
    }

    /**
     * Genera un nuevo token y lo envía, previamente recibió el token y lo valido
     * @returns Nuevo token
     */
    async reloadToken(request: Request, response: Response) {
        try {
            const { uid, role }: any = request.body.tokenInfo;
            const token = await generateJWT( uid, role );

            return response.status(200).json({
                ok: true,
                uid, role, token
            });
        } catch (error) {
            console.log('[ERROR][reloadToken]',error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! No se pudo iniciar sesión'
            });
        }
    }

    /**
     * Permite obtener la información del usuario
     */
    async getUserInfo (request: Request, response: Response) {
        try {
            const { uid }: InfoTokenSave = request.body.tokenInfo;

            const user = await this.userService.getInfoUserById( uid );

            
            if(!user){
                return response.status(401).json({
                    ok: false,
                    msg: 'No se pudo encontrar el usuario'
                })
            }
            
            const membership = await UserMembershipModel.findOne({
                user: user.uid
            });

            return response.status(201). json({
                ok: true,
                user,
                membership
            })
        } catch (error) {
            console.log('[ERROR][getUserInfo]',error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! No se pudo obtener la información del usuario'
            });
        }
    }

    /**
     * Permite cambiar la información del usuario
     * @returns Usuario con las modificaciones
     */
    async changeUserInfo(request: Request, response: Response){
        try {
            const { updateUser } = request.body;
            const { uid }: InfoTokenSave = request.body.tokenInfo;
    
            if(
                !updateUser
            ){
                return response.status(400).json({
                    ok: false,
                    msg: 'Falta información para poder actualizar el usuario'
                })
            }else if( updateUser.role || updateUser.password ){
                return response.status(401).json({
                    ok: 'false',
                    msg: 'Unauthorized'
                })
            }
    
            const eventUpdate = await UserModel.findByIdAndUpdate( uid, updateUser, { new: true } );
            if(!eventUpdate){
                return response.status(500).json({
                    ok: false,
                    msg: 'Ocurrió un error inesperado'
                })
            }

            const user: User | null = await UserModel.findById(uid)
                .select('-password');

            return response.status(200).json({
                ok: true,
                user
            })
        } catch (error) {
            console.log(error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! No se pudo actualizar el usuario'
            });
        }
    }
}