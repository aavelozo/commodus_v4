import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, ToastAndroid } from "react-native"
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper'
import { DefaultStyles } from "../../DefaultStyles"
import Header from "../../components/Header"
import TitleView from "../../components/TitleView"
import { RFValue } from "react-native-responsive-fontsize"

function Privacy({ navigation }): JSX.Element {
    const [accept, setAccept] = useState(false);

    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };

    return (
        <>
            <Header noBars />
            <View style={style.title}>
                <TitleView title="Política de Privacidade" />
                <View style={style.menu}>
                    <View style={style.viewTop}>
                        <ScrollView >
                            <Text style={style.text}>   Esta política de privacidade descreve como o aplicativo COMMODUS de Gerenciamento de Despesas Automotivas coleta, usa e compartilha informações pessoais dos usuários. O aplicativo tem como objetivo ajudar os usuários a gerenciar suas despesas automotivas de forma fácil e eficiente. Sua privacidade é importante para nós e estamos empenhados em protegê-la.</Text>
                            <Text />

                            <Text style={style.text}>1. Coleta de Informações</Text>
                            <Text style={style.text}>   O aplicativo COMMODUS coleta as seguintes informações pessoais dos usuários:</Text>
                            <Text style={style.text}>    - Informações de registro: o aplicativo pode solicitar que o usuário forneça seu nome, endereço de e-mail, senha e outras informações de registro relevantes.</Text>
                            <Text style={style.text}>    - Informações do veículo: o aplicativo pode coletar informações sobre o veículo do usuário, incluindo o modelo, ano, marca e outras informações relacionadas.</Text>
                            <Text style={style.text}>    - Informações de valores: o aplicativo pode coletar informações sobre as despesas do usuário relacionadas ao veículo, como combustível, manutenção e outras despesas.</Text>
                            <Text style={style.text}>   Além disso, o aplicativo COMMODUS pode coletar informações não pessoais, como informações do dispositivo, informações do navegador e outras informações técnicas para melhorar a experiência do usuário.</Text>
                            <Text/>

                            <Text style={style.text}>2. Uso de Informações</Text>
                            <Text style={style.text}>   O aplicativo COMMODUS usa as informações coletadas para os seguintes fins:</Text>
                            <Text style={style.text}>    - Fornecer serviços personalizados ao usuário.</Text>
                            <Text style={style.text}>    - Enviar notificações e alertas ao usuário sobre as despesas do veículo.</Text>
                            <Text style={style.text}>    - Fornecer análises e relatórios sobre as despesas do veículo do usuário.</Text>
                            <Text style={style.text}>    - Melhorar a qualidade do aplicativo e os serviços oferecidos.</Text>
                            <Text style={style.text}>    - Cumprir obrigações legais e regulatórias.</Text>
                            <Text />

                            <Text style={style.text}>3. Compartilhamento de Informações</Text>
                            <Text style={style.text}>   O aplicativo COMMODUS pode compartilhar informações pessoais do usuário com terceiros apenas nas seguintes circunstâncias:</Text>
                            <Text style={style.text}> - Com consentimento do usuário.</Text>
                            <Text style={style.text}> - Para cumprir obrigações legais e regulatórias.</Text>
                            <Text style={style.text}> - Para proteger os direitos, propriedade e segurança do aplicativo, dos usuários e de outras partes interessadas.</Text>
                            <Text style={style.text}>   O aplicativo não venderá, alugará ou trocará informações pessoais do usuário para fins de marketing ou publicidade.</Text>
                            <Text />

                            <Text style={style.text}>4. Segurança de Informações</Text>
                            <Text style={style.text}>   O aplicativo COMMODUS usa medidas técnicas e organizacionais adequadas para proteger as informações pessoais do usuário contra acesso não autorizado, uso, divulgação ou destruição. O aplicativo adota políticas de segurança de informações apropriadas para garantir a confidencialidade e integridade das informações pessoais do usuário.</Text>
                            <Text />

                            <Text style={style.text}>5. Atualizações na Política de Privacidade</Text>
                            <Text style={style.text}>   Esta política de privacidade pode ser atualizada a qualquer momento sem aviso prévio. As atualizações serão efetivas assim que a nova política de privacidade for publicada no aplicativo. É responsabilidade do usuário revisar periodicamente esta política de privacidade para estar ciente de quaisquer alterações.</Text>
                            <Text />

                            <Text style={style.text}>6. Contato</Text>
                            <Text style={style.text}>   Se o usuário tiver dúvidas ou preocupações sobre esta política de privacidade ou sobre o uso das informações pessoais pelo aplicativo COMMODUS, entre em contato conosco por e-mail no endereço contato.commodus@gmail.com.</Text>
                            <Text />
                            <Text style={style.text}>   Ao concordar o usuário reconhece que leu e entendeu a Política de Privacidade e concorda em obedecer todas as regras e regulamentos estabelecidos neste documento.</Text>
                            <Text />                          

                        </ScrollView>
                    </View>
                    <View style={style.viewBottom}>
                        <View style={style.viewCheckBox}>
                            <Checkbox
                                status={accept ? 'checked' : 'unchecked'}
                                onPress={() => setAccept(!accept)}
                            />
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <Text adjustsFontSizeToFit style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Eu aceito os termos de política de privacidade</Text>
                            </TouchableWithoutFeedback>
                        </View>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (accept) {
                                    navigation.navigate('Login')
                                } else {
                                    showToast('Para avançar, deve ser feito o aceite das políticas de privacidade')
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
        fontSize: RFValue(15),
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

export default Privacy;