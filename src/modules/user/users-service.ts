import bcrypt from 'bcryptjs';

import { UserModel } from '../../database';
import { AuthenticationRoles, User } from '../../interfaces';

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  city?: string;
  country?: string;
}

export class UserService {
  constructor () {}

  /**
  * Permite crear un usuario
  */
  async createUser ({ name, email, password, city, country }: CreateUserParams) {
    try {
      if (!name || !email || !password ) {
        throw new Error('missing info');
      }

      const user = await UserModel.findOne({ email });

      //Comprobar que el usuario no este registrado en la compañía
      if (user) {
        throw new Error('the user is already registered');
      }

      //Encriptar la contraseña
      const salt = bcrypt.genSaltSync();
      const encryptPassword = bcrypt.hashSync( password, salt );

      //Crear el usuario
      const newUser = new UserModel({
        name,
        email,
        password: encryptPassword,
        role: AuthenticationRoles.CUSTOMER,
        city,
        country
      });

      //Guardar el usuario en base de datos
      await newUser.save();

      return newUser;
    } catch (error) {
      throw new Error(`[createUser] ${error}`);
    }
  }

  /**
  * Validar las credenciales de los usuarios
  * @param email
  * @param password
  * @param company
  */
  async validateUserCredentials (email: string, password: string) {
    try {
      if (!email || !password ) {
        throw new Error('missing info');
      }

      const user: User | null = await UserModel.findOne({ email });

      if ( !user ) {
        return;
      }

      //Confirmar password
      const validPassword = bcrypt.compareSync( password, user.password );

      if (!validPassword) {
        throw new Error('User or password incorrect');
      }

      return {
        uid: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        country: user.country
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  /**
  * Obtiene la información del usuario por id
  * @param userId id del usuario a obtener
  * @returns Usuario
  */
  async getInfoUserById( userId: string ) {
    try {
      const user: User | null = await UserModel.findById(userId)
        .select('-password');

      return user;
    } catch (error) {
      console.error('[ERROR][getInfoUserById]', error);
      throw new Error("Error invoke");
    }
  }
}