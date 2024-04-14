import { Alert } from "react-native";

/**
 * utilitis javascripts
 * @author Alencar
 * @created 2022-09-11
 */
export default class Utils{
    static logActive = (typeof Utils.logActive !== "undefined"? Utils.logActive : true);
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
}