import Users from "../database/models/Users";
import Utils from "./Utils";
import { fetch as fetchNetInfo } from "@react-native-community/netinfo";

/**
 * classe para controlar o login
 */
export default class AuthController{

    static #loggedUser = null;

    /**
     * @deprecated (used only unitary test)
     * @param {Object} user 
     * @returns {boolean}
     */
    static testLogin(user){
        try {
            if ((user||{}).senha.length > 0 && (user||{}).senha == (Dados.user||{}).senha && (user||{}).email == (Dados.user||{}).email) {
                return true;    
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async localLogin(pUser,realm) {
        try {
            let user = await realm.objects(Users.name).filtered(`${"mail"} == '${(pUser||{}).email}' and ${"password"} == '${(pUser||{}).senha}'`);
            if (user.length > 0) {
                await realm.write(() => {           
                    user[0].logged = true;
                });   
                AuthController.#loggedUser = user[0]; 
                return true;
            } else {
                return "usuário não encontrado ou senha inválida";
            }
        } catch (e) {
            console.log(e);
            return e.message || e;
        }
    }

    /**
     * metodo que efetua login ou rejeita a promise
     * @param {object} user - o objeto login que contem o email e senha
     * @returns {Promise}
     * @created 2022-09-12
     * @updates 
     *      - 2024-03-19 - implemented server login user request
     */
    static async login(pUser,realm){
        try {     
            
            let netState = await fetchNetInfo();
            if (netState.isConnected) {

                //server login request
                console.log('requesting to server');
                let serverResponse = await fetch("http://68.183.105.44:3000/api/auth/login",{
                    method: "POST",
                    headers: {
                        "Content-type":"application/json",
                        accept:"application/json"
                    },
                    body:JSON.stringify({
                        mail: pUser.email,
                        password: pUser.senha           
                    })
                });
                console.log('requested to server', serverResponse.status);
                if (serverResponse && serverResponse.status == 200){
                    serverResponse = await serverResponse.json();

                    //success login on server
                    if (serverResponse && Utils.toBool(serverResponse.success)) {

                        //find local user
                        if (AuthController.localLogin(pUser,realm) === true) {
                            return true;
                        } else {

                            //create local user if not exists on login (logged by server = ok)
                            await realm.write(() => {
                                let novoUsuario = realm.create(Users.name, {
                                    "mail": pUser.email,
                                    "password": pUser.senha,
                                    "logged": true
                                });  
                                console.log(novoUsuario)
                                AuthController.#loggedUser = novoUsuario;                                                                       
                            });
                            return true;

                        }
                    } else {
                        //@todo handle connection error, possible treat as local login
                        return serverResponse.message || 'Erro ao logar'
                    }
                } else {
                    //@todo handle connection error, possible treat as local login
                    return serverResponse.message || 'Erro ao logar'
                }
            } else {
                return AuthController.localLogin(pUser,realm);
            }
        } catch (e) {
            console.log(e);
            return e.message || e;
        }    
    }

    static getLoggedUser(){
        return AuthController.#loggedUser;
    }

    static setLoggedUser(loggedUser){
        AuthController.#loggedUser = loggedUser;
    }

    static getUser(email){
        return dbRealm.getDbInstance().objects(Users.name).filtered("mail == '"+email+"'");
    }

    static getPassword(senha){
        return dbRealm.getDbInstance().objects(Users.name).filtered("password == '"+senha+"'");
    }



    static sendRecoverPasswordEmail(email) {
        return new Promise((resolve,reject)=>{
            try {
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }


}
