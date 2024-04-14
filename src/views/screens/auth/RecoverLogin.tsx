import React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import { DefaultStyles } from '../../DefaultStyles'
import FormRecoverLogin from './FormRecoverLogin'


function RecoverLogin(props) : JSX.Element {
    const user = (props.route||{}).params
    
    return (
        
        <View style={style.container}>
            {/* <Header/> */}
            <FormRecoverLogin user={user} navigation={props.navigation}/>
        </View>
        
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
    }
});

export default RecoverLogin;