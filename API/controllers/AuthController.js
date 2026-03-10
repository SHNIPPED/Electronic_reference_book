import AuthService from "../services/AuthService.js";
import jwt from 'jsonwebtoken'

class AuthController{
    
    static async login(req,res){
        const{login,pwd} = req.body;
        try{
            if (!login || !pwd) {
                return res.status(400).json({ error: 'Заполни логин и пароль' });
            }

            const user = await AuthService.login(login,pwd)

            const token = jwt.sign(
            user,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '12h' });

            res.json(token)
        }
        catch(e){
            console.error('Login error:', e);
            res.status(401).json({ error: "Invalid credentials" }); 
        }
    }
}
export default AuthController;