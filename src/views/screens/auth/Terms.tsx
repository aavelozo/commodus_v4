import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, ToastAndroid } from "react-native"
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper'
import { DefaultStyles } from "../../DefaultStyles"
import Header from "../../components/Header"
import TitleView from "../../components/TitleView"
import { RFValue } from "react-native-responsive-fontsize"

function Terms({ navigation }): JSX.Element {
    const [accept, setAccept] = useState(false);

    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };

    return (
        <>
            <Header />
            <View style={style.title}>
                <TitleView title="Termos de uso e LGPD" />
                <View style={style.menu}>
                    <View style={style.viewTop}>
                        <ScrollView >
                            <Text style={style.text}>
                                Este Termo de uso é um acordo legal entre você e a empresa COMMODUS, que define os termos e condições que regem o uso do aplicativo disponibilizado pela Empresa. Ao utilizar o aplicativo, você concorda com os termos deste Termo. Se você não concordar com os termos deste Aplicativo, não utilize o aplicativo.
                            </Text>
                            <Text style={style.text}>1 - Objetivo do Aplicativo</Text>
                            <Text style={style.text}>
                                O aplicativo tem como objetivo facilitar a vida do usuário com o gerenciamento de despesas automotivas. Permitindo que os usuários registrem e acompanhem suas despesas relacionadas a veículos, como combustível, manutenção e seguro.
                            </Text>
                            <Text style={style.text}>2 - Elegibilidade</Text>
                            <Text style={style.text}>
                                O Aplicativo é destinado a usuários com 16 anos ou mais. Ao utilizar o Aplicativo, você declara que tem pelo menos 16 anos.
                            </Text>
                            <Text style={style.text}>3 - Disposições Gerais</Text>
                            <Text style={style.text}>
                                Este Termo é regido pelas leis brasileiras e quaisquer disputas decorrentes do uso do aplicativo serão resolvidas pelos tribunais brasileiros competentes. Se qualquer disposição deste Termo for considerada inválida ou inexequível.
                            </Text>
                        </ScrollView>
                    </View>
                    <View style={style.viewBottom}>
                        <View style={style.viewCheckBox}>
                            <Checkbox
                                status={accept ? 'checked' : 'unchecked'}
                                onPress={() => setAccept(!accept)}
                            />
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Eu aceito os termos de uso e LGPD</Text>
                            </TouchableWithoutFeedback>
                        </View>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (accept) {
                                    navigation.navigate('Login')
                                } else {
                                    showToast('Para avançar, deve ser feito o aceite dos termos')
                                }
                            }}
                        >
                            <View style={style.button}>
                                <Text style={style.textButton}>Confirmar</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View >
            </View >
        </>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
    },
    menu: {
        flex: 1,
        backgroundColor: DefaultStyles.colors.fundo,
        borderTopLeftRadius: RFValue(25),
        paddingHorizontal: RFValue(20),
        paddingTop: RFValue(20),
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    viewBottom: {
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 20

    },
    viewTop: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: RFValue(18),
        color: '#000'
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: RFValue(200),
        height: RFValue(50),
        borderRadius: RFValue(16),
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
        marginVertical: RFValue(15)
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        fontWeight: 'bold',
        fontSize: 20,
    },
    viewCheckBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // marginLeft: Dimensions.get('window').width * 0.03,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    textCheckBox: {
        fontSize: RFValue(25),
        color: DefaultStyles.colors.tabBar

    },
});

export default Terms;