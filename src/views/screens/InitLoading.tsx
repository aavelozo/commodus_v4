import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { InitController } from "../../controllers/InitController";

/**
 * Init screen to redirect to correct initial screen 
 * @author Alencar
 */
function InitLoading() : JSX.Element {
    const navigation = useNavigation();

    useEffect(()=>{
        console.log('INIT InitLoading.useEffect');
        (async()=>await InitController.init(navigation))();
        console.log('END InitLoading.useEffect');
    });

    return <View 
        style={{ 
            width:'100%', 
            height:'100%',                
            alignItems: 'center', 
            justifyContent: 'center',
            flex: 1
        }} >
        <ActivityIndicator size={'large'}/>
    </View>    
}

export {InitLoading}