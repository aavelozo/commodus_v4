//import Realm from 'realm';

/**
 * Classe Expenses, representa o model da tabela Expenses
 * @created 2022-10-14
 */
class Expenses /*extends Realm.Object<Expenses>*/ {

    date? : Date;
    actualkm? : number;
    totalValue? : number;
    establishment? : string;
    observations? : string; 
    type? : string;
    othersdatas? : any;//Realm.Mixed;
    photo? : string;  


    static schema : /*Realm.ObjectSchema*/any = {
        name: Expenses.name,
        properties: {
            date            : 'date?',
            actualkm         : 'double?',
            totalValue      : 'double?',
            establishment   : 'string?',
            observations     : 'string?',            
            type            : 'string?',
            othersdatas     : 'mixed{}',
            photo            : 'string?'            
        }
    };
}

export default Expenses;  