import { Alert } from "react-native";
import { ToasterHelper } from "react-native-customizable-toast";
import Trans from "./internatiolization/Trans";

/**
 * utilitis javascripts
 * @author Alencar
 * @created 2022-09-11
 */
export default class Utils{
    static logActive = (typeof Utils.logActive !== "undefined"? Utils.logActive : true);
    static decimalDigits = [',','.']; 

    static abbreviatedMonths = [
        "jan", "feb", "mar", "apr", "mai", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    static setLogActive(active) {
        Utils.logActive = active;
    }
    static showError(error){
        Utils.logi(Utils.name,Utils.showError.name);
        try {
            if (Utils.logActive === true) {               
                console.error(error);
            }
            let typeOfError = typeof error;
            let title = "Erro";
            typeOfError = typeOfError.toLowerCase().trim();
            if (typeOfError === "string") {
                Alert.alert(title,error);
            } else if (typeOfError === "object") {
                Alert.alert(title,(error.message || error.toString()));
            } else {
                Alert.alert(title,`erro nao pode ser mostrado: ${typeOfError}, vide log`);
            }
        } catch (e) {
            Utils.log(e);
        }
        Utils.logf(Utils.name,Utils.showError.name);
    }
    static log(...objs) {
        if (Utils.logActive === true) {
            if (objs != null) {
                console.log(objs);
            }
        }
    }
    static logi(objName, methodName) {
        Utils.log(`INIT ${objName}.${methodName}`);
    }
    static logf(objName, methodName) {
        Utils.log(`END  ${objName}.${methodName}`);
    }

    static typeOf(value) {
        let r = typeof value;
        if (typeof NodeList != 'undefined') {
            if (Array.isArray(value) || value instanceof NodeList || value instanceof Array) {
                r = "array";
            }
        } else {
            if (Array.isArray(value) || value instanceof Array) {
                r = "array";
            }
        }
        return r;
    }

    static toNumber(v) {
        let r = null;
        try {
            let t = typeof v;
            if (t == 'number') {
                r = v;
            } else {
                if (t == 'boolean') {
                    r = Number(v);  
                } else if (t == 'string') {
                    r = Number(v);
                    if (isNaN(r)) {
                        v = v.replace(/[^\d|\,|\.|\-|\+]+/ig,'');
                        if (v.length > 0) { 
                            let pc = v.indexOf(",");
                            let pp = v.indexOf(".");
                            if (pc > -1 && pp > -1) {
                                if (pp > pc) {
                                    r = Number(v.replaceAll(",",""));
                                } else {
                                    r = Number(v.replaceAll(".","").replace(",","."));
                                }
                            } else {
                                if (pc > -1) {
                                    r = Number(v.replace(",","."));
                                } else {
                                    r = Number(v);
                                }
                            }
                        }
                    }
                }
            }
        } catch(e) {
            Utils.showError(e);
        }
        return r;
    }

    static toBool(pValue) {
        let result = false;
        if (typeof pValue !== "undefined" && pValue != null) {
            if (typeof pValue == "boolean") {
                result = pValue;
            } else if (typeof pValue == "string") {
                if (pValue.trim() == "true") {
                    result = true;
                }
            } else if (typeof pValue == "number") {
                if (pValue != 0) {
                    return true;
                }
            } else {
                result = pValue?true:false;
            }
        }
        return result;
    }    

    static hasValue(pValue){
        let result = false;
        let tpof = Utils.typeOf(pValue);
        if (tpof !== "undefined" && pValue != null) {
            if (tpof == "object") {
                if (Object.keys(pValue).length > 0 
                    || ['DATE'].indexOf(pValue?.constructor?.name?.toUpperCase()) > - 1
                ) {
                    result = true;
                } 
            } else if (tpof == "array") {
                if (pValue.length > 0) {
                    result = true;
                }
            } else if (tpof == "string") {
                if (pValue.trim().length > 0) {
                    result = true;
                }
            } else {
                result = true;
            }
        }
        return result;
    }

    static firstValid(arr_valores,check_null) {
        try {
            if (typeof arr_valores !== "undefined") {
                check_null = check_null === false ? false : true;
                if (arr_valores !== null) {            
                    if (Utils.typeOf(arr_valores) === "array") {
                        let q = arr_valores.length;                
                        if (check_null) {
                            for (let i = 0; i < q; i++) {
                                if (typeof arr_valores[i] !== "undefined" && arr_valores[i] !== null) {
                                    return arr_valores[i];
                                };
                            }
                        } else {
                            for (let i = 0; i < q; i++) {
                                if (typeof arr_valores[i] !== "undefined") {
                                    return arr_valores[i];
                                }
                            }
                        }
                    } else {
                        throw new Error("tipo nao esperado: " + Utils.typeOf(arr_valores));
                    }
                } 
            }            
            return null;
        }catch(e){
            console.log(e);          
            return null;
        } 
    };

    static toast(type,message,timer) {
        ToasterHelper.show({            
            type: type,
            text: message,            
            timeout: timer            
          });
    }

    static toNumericText(value,allowNegative) {
        if (Utils.hasValue(value)) { 
            value = typeof value == 'string' ? value : value.toString();           
            let isNegative = allowNegative === true && value.indexOf('-') === 0;
            value = `${isNegative ? '-' : ''}${value.replace(/[^0-9.,]/g,'').replaceAll(".",'_').replaceAll(",","_").replace('_',Trans.getDecimalSeparator()).replaceAll("_","")}`;
        } 
        return value || '';
    }
}