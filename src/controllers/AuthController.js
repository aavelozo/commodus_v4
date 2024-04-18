
/**
 * classe para controlar o login
 */
export default class AuthController{

    static #loggedUser = null;

    static getLoggedUser(){
        return AuthController.#loggedUser;
    }

    static setLoggedUser(loggedUser){
        AuthController.#loggedUser = loggedUser;
    }

}
