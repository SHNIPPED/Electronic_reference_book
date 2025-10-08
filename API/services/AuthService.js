class AuthService {

    async login(login,password){

    const users = [
        { id: 1, login: '1', password: '1' },
        { id: 2, login: 'admin', password:'Xzasdc123'},
    ];

    return users.find(user => user.login === login && user.password === password);

    }
}
export default new AuthService();