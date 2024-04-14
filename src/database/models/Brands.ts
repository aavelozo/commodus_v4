import Models from "./Models";

/**
 * Classe Brands, representa o model da tabela Brands
 * @created 2022-10-14
 */
class Brands /*extends Realm.Object */{
    
    brand! : string;
    models! : Array<Models>//Realm.List<Models>;

    static data : Array<any> | null = null;

    static schema = {
        name: "Brands",
        properties: {
            "brand"   : "string",
            "models" : "Models[]" // Brands contem modelos
        }
    };
}

export default Brands;  