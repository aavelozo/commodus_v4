import Utils from "../../controllers/Utils";
import Models from "./Models";
import firestore from '@react-native-firebase/firestore';

/**
 * Classe Brands, representa o model da tabela Brands
 * @created 2022-10-14
 */
class Brands /*extends Realm.Object */{
    
    brand! : string;
    models! : Array<Models>//Realm.List<Models>;

    static #dbData : Array<any> | null = null;
    static #singleData: Array<any> | null = null;


    static schema = {
        name: "Brands",
        properties: {
            "brand"   : "string",
            "models" : "Models[]" // Brands contem modelos
        }
    };

    //"singleton" request to server, store on local cache with app is running
    static async loadDBData(){     
        console.log('INIT Brands.loadDBData');   
        console.log('loading data Brands from db');
        this.#dbData = await firestore().collection('Brands').get();
        this.#dbData?.forEach(async docSnap=>{
            docSnap.models = await docSnap.ref.collection('models').get();
            console.log('loaded models from db',docSnap.models);
        })
        console.log(`loading data Brands from db ok, size ${this.#dbData?.size}`);
        console.log('END Brands.loadDBData');   
    }

    static async getDBData(){
        console.log('INIT Brands.getDBData');
        if (!this.#dbData || !this.#dbData?.size) {
            console.log('loading for db...');
            await this.loadDBData();
        }
        console.log('END Brands.getDBData');
        return this.#dbData;        
    }

    //"singleton" get single object (not db object) of brands and models (nested) to use in app
    static async getSingleData() {
        if (!this.#singleData || !this.#singleData.length) {
            console.log('loading data Brands(single) from db');
            this.#singleData = [];
            await this.getDBData();
            this.#dbData?.forEach(docSnapshot=>{
                let models = [];
                docSnapshot.models.forEach(docSnap=>{
                    models.push({
                        id:docSnap.id
                    })
                });
                console.log('models',models);
                this.#singleData?.push({
                    id:docSnapshot.id,
                    models:models
                })
            });
            console.log(`loading data Brands(single) from db ok, size ${this.#singleData?.length}`,this.#singleData);
        };
        return this.#singleData;
    }
}

export default Brands;  