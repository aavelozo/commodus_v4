//import Realm from 'realm';
import Expenses from './Expenses';

/**
 * Classe Vehicles, representa o model da tabela Vehicles
 * @created 2022-10-14
 */
class Vehicles /*extends Realm.Object<Vehicles> */{    
    idEngineType? : number;
    year? : number;
    km? : number;
    color?: string;
    plate? : string;
    combustivelPreferido? : string;
    photo? : string;  
    expenses! : Array<Expenses>;//Realm.List<Expenses>;

    static ENGINES_TYPES = [
        'Combustão',
        'Híbrido',
        'Elétrico'
    ];

    static schema : /*Realm.ObjectSchema*/ any = {
        name: Vehicles.name,        
        properties: {
            idEngineType         : 'int?',
            year                 : 'int?',
            km                   : 'double?',
            color                : 'string?',
            plate                : 'string?',
            preferedFuel         : 'string?',
            photo                : 'string?',   
            expenses             : 'Expenses[]',              
        }
    };
}

export default Vehicles;  