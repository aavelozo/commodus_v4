import { StyleSheet, Text, View } from "react-native"
import { DefaultStyles } from "../../DefaultStyles"
import Header from "../../components/Header"
import FormUser from "./FormUser"
import { RFValue } from "react-native-responsive-fontsize"
import Trans from "../../../controllers/internatiolization/Trans"
import _ from 'lodash';

function UserRegistration(props: React.PropsWithChildren) : JSX.Element {
    return (
        <View style={style.container}>
            <Header noBars/>
            <View style={style.espacoCentral}>
            <Text style={{fontSize: RFValue(25), color: DefaultStyles.colors.botao}}>{_.capitalize(Trans.t('user registration'))}</Text>
                <FormUser navigation={props.navigation}/>
            </View>           
        </View>        
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.tabBar,
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu: {
        flex:1,
        backgroundColor: DefaultStyles.colors.fundo
    }
});

export default UserRegistration;