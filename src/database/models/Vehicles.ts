import AuthController from '../../controllers/AuthController';

/**
 * Classe Vehicles, representa o model da tabela Vehicles
 * @created 2022-10-14
 */
class Vehicles {    

    static #dbCollection = null;
    static #dbData : Array<any> | null = null;
    static #singleData: Array<any> | null = null;

    static ENGINES_TYPES = [
        'Combustão',
        'Híbrido',
        'Elétrico'
    ];
    
    static getDBCollection(){
        if (!this.#dbCollection) {
            this.#dbCollection = AuthController.getLoggedUser().ref.collection('vehicles');
            this.#dbCollection.onSnapshot(function(querySnapshot){
                console.log('documentos atualizados na base, recarregando');
                Vehicles.loadDBData();
            });
        }
        return this.#dbCollection;
    }

     //"singleton" request to server, store on local cache with app is running
    static async loadDBData(){     
        console.log('INIT Vehicles.loadDBData');   
        console.log('loading data Vehicles from db');        
        this.#dbData = await this.getDBCollection().get();
        this.#singleData = [];
        console.log(`loading data Vehicles from db ok, size ${this.#dbData?.size}`);
        console.log('END Vehicles.loadDBData'); 
        
    }

    static setDBData(newDBData){
        this.#dbCollection = null;
        this.#dbData = newDBData;
        this.#singleData = null;
    }

    static async getDBData(){
        console.log('INIT Vehicles.getDBData');
        if (!this.#dbData || !this.#dbData?.size) {
            console.log('loading for db...');
            await this.loadDBData();
        }
        console.log('END Vehicles.getDBData');
        return this.#dbData;        
    }

    //"singleton" get single object (not db object) of brands and models (nested) to use in app
    static async getSingleData() {
        console.log('INIT Vehicles.getSingleData');
        if (!this.#singleData || !this.#singleData.length) {
            console.log('loading data Vehicles(single) from db');
            this.#singleData = [];
            await this.getDBData();
            this.#dbData?.forEach(docSnapshot=>{         
                let newVehicle = {
                    id:docSnapshot.id,
                    plate:docSnapshot.data().plate,
                    idEngineType:docSnapshot.data().idEngineType,
                    km:docSnapshot.data().km,                    
                    model:docSnapshot.data().model.id,
                    brand:docSnapshot.data().model.parent.parent.id,
                    preferedFuel:docSnapshot.data().preferedFuel,
                    color:docSnapshot.data().color,
                    photo:docSnapshot.data().photo,
                    vehicleName : `${docSnapshot.data().model.id}-${docSnapshot.data().plate}`
                }; 
                this.#singleData?.push(newVehicle);
            });
            console.log(`loading data Vehicles(single) from db ok, size ${this.#singleData?.length}`,this.#singleData);
        };
        console.log('END Vehicles.getSingleData',this.#singleData);
        return this.#singleData;
    }
}

export default Vehicles;  