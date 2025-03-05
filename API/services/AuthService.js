class AuthService {

    async login(login,password){

    const users = [
        { id: 1, login: '1', password: '1' },
    ];

    return users.find(user => user.login === login && user.password === password);

    }
}
export default new AuthService();