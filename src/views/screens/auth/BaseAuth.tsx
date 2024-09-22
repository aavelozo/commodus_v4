import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { DefaultStyles } from '../../DefaultStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';

/**
 * Base auth componente to reuse in login and password recover
 * @param props 
 * @returns 
 * @author Alencar
 */
function BaseAuth(props: Object): JSX.Element {

    return <ScrollView>
        <View style={style.container}>
            <View style={[style.imagem]}>
                <Image
                    style={{ height: RFValue(130), width: RFValue(130) }}
                    resizeMode='contain'
                    source={require('../../assets/logoCommodusEscuro.png')}
                />
            </View>

            <View style={[style.content]}>
                {props.children}
            </View>

            <View style={style.bottomView}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={props.loading}
                    onPress={props.onConfirm}
                    style={style.button}
                >
                    <Text style={style.textButton}>
                        {props.loading 
                            ? <ActivityIndicator />
                            : _.capitalize(Trans.t(props.textConfirm || 'sig in'))
                        }
                    </Text>
                </TouchableOpacity>
                {props.afterConfirmButton||false}
            </View>
        </View>
    </ScrollView>
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        //flex: 1,
        height:Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: '65%',
        height: Dimensions.get('window').height / 14,
        borderRadius: RFValue(16),
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        //fontWeight: 'bold',
        fontSize: RFValue(18),

    },
    imagem: {
        justifyContent: 'center',       
        width: '100%',
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.37
    },

    content: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
    },
    bottomView:{
        height: Dimensions.get('window').height * 0.38,
        width:'100%',
        alignItems:'center',
        justifyContent: 'center',      
    }
})

export { BaseAuth }