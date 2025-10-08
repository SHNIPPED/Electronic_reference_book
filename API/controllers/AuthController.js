import AuthService from "../services/AuthService.js";
import jwt from 'jsonwebtoken';

class AuthController{

    
    async login(req,res){

        const SECRET_KEY = 'your_secret_key';
        try{
            const{login,password} = req.body;
            const date = await AuthService.login(login,password)
            const token = await jwt.sign({ userId: date.id, username: date.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({token});
        }
        catch(e){
            res.status(500).json("erro");
        }
    }
}

export default new AuthController();