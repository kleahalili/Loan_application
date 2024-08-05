const USERS_REST_API_URL = 'https://localhost:8080/api/users';
class UserService{
    getUsers(){
        return fetch(USERS_REST_API_URL).then((res=>res.json()));

    }
}
export default new UserService();