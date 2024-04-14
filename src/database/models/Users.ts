//import Realm from 'realm';
import Vehicles from './Vehicles';

/**
 * Classe Users, representa o model da tabela Ususarios
 * @created 2022-10-14
 */
class Users /*extends Realm.Object<Users>*/ {
    name?: string;
    mail!: string;
    password!: string;
    logged!: boolean;
    vehicles!: Array<Vehicles>;//Realm.List<Vehicles>;
    photo!: string;

    static schema : /*Realm.ObjectSchema*/ any = {
        name: 'Users',
        properties: {
            name    : 'string?',
            mail   : 'string',
            password: 'string',
            logged  : {type: 'bool', default: false},
            vehicles:'Vehicles[]',
            photo : 'string?'
        }
    };    
}

export default Users;  