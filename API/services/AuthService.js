import AuthModel from '../models/AuthModules.js';

class AuthService {

    static async login(login, pwd) {
        try {       
            const user = await AuthModel.findByLogin(login);
            
            if (!user) {
                console.log('Пользователь не найден');
                throw new Error('User not found');
            }

            const users  = user[0]
            
            if (pwd !== users.pwd) {
                console.log('Пароли не совпадают');
                throw new Error('Invalid password');
            }
            else{
                console.log(`Успешная аутентификация`);
                return {
                  user
                };
            }              

        } catch (error) {
            console.error('AuthService login error:', error);
            throw error;
        }
    }
}

export default AuthService;