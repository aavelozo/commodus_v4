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
            <Header noBars />
            <View style={style.title}>
                <TitleView title="Termos de uso e LGPD" />
                <View style={style.menu}>
                    <View style={style.viewTop}>
                        <ScrollView >
                            <Text style={style.text}>   Este Termo de uso é um acordo legal entre você e a empresa COMMODUS, que define os termos e condições que regem o uso do aplicativo disponibilizado pela Empresa. Ao utilizar o aplicativo, você concorda com os termos deste Termo. Se você não concordar com os termos deste Aplicativo, não utilize o aplicativo.</Text>
                            <Text />

                            <Text style={style.text}>1. Objetivo do Aplicativo</Text>
                            <Text style={style.text}>   O aplicativo tem como objetivo facilitar a vida do usuário com o gerenciamento de despesas automotivas. Permitindo que os usuários registrem e acompanhem suas despesas relacionadas a veículos, como combustível, manutenção e seguro.</Text>
                            <Text />

                            <Text style={style.text}>2. Elegibilidade</Text>
                            <Text style={style.text}>   O Aplicativo é destinado a usuários com 16 anos ou mais. Ao utilizar o Aplicativo, você declara que tem pelo menos 16 anos.</Text>
                            <Text />

                            <Text style={style.text}>3. Disposições Gerais</Text>
                            <Text style={style.text}>   Este Termo é regido pelas leis brasileiras e quaisquer disputas decorrentes do uso do aplicativo serão resolvidas pelos tribunais brasileiros competentes. Se qualquer disposição deste Termo for considerada inválida ou inexequível.</Text>
                            <Text />

                            <Text style={style.text}>4. Uso do Aplicativo</Text>
                            <Text style={style.text}>   O uso do aplicativo é de responsabilidade exclusiva do usuário, que deve utilizá-lo de acordo com a legislação brasileira e com as regras estabelecidas neste Termo. O usuário é o único responsável pelo conteúdo que postar no aplicativo e deve garantir que não infrinja os direitos de terceiros.</Text>
                            <Text />

                            <Text style={style.text}>5. Propriedade Intelectual</Text>
                            <Text style={style.text}>   O aplicativo, incluindo o seu conteúdo e design, é protegido por leis de propriedade intelectual, incluindo direitos autorais, marcas registradas e patentes. O usuário concorda em não copiar, reproduzir, distribuir ou criar obras derivadas do aplicativo sem autorização prévia e por escrito da Empresa.</Text>
                            <Text />

                            <Text style={style.text}>6. Registro</Text>
                            <Text style={style.text}>   O acesso ao aplicativo pode ser feito através de um cadastro, no qual o usuário deve fornecer informações precisas e atualizadas, incluindo seu nome, endereço de e-mail e senha. O usuário é o único responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.</Text>
                            <Text />

                            <Text style={style.text}>7. Responsabilidades do Usuário</Text>
                            <Text style={style.text}>   Ao usar o Aplicativo, você é responsável por:</Text>
                            <Text style={style.text}>    - Garantir que as informações fornecidas sejam precisas e atualizadas.</Text>
                            <Text style={style.text}>    - Manter a segurança de sua conta de usuário e senha.</Text>
                            <Text style={style.text}>    - Garantir que as informações fornecidas não violem os direitos de propriedade intelectual do Provedor ou de terceiros.</Text>
                            <Text style={style.text}>    - Cumprir as leis aplicáveis ao usar o Aplicativo.</Text>
                            <Text style={style.text}>    - Não tentar acessar ou interferir com o Aplicativo ou seus sistemas ou redes relacionados.</Text>
                            <Text />

                            <Text style={style.text}>8. Responsabilidades da Empresa</Text>
                            <Text style={style.text}>   A Empresa COMMODUS se responsabiliza a:</Text>
                            <Text style={style.text}>    - Manter a segurança e privacidade das informações do usuário.</Text>
                            <Text style={style.text}>    - Fornecer suporte técnico e atualizações do Aplicativo.</Text>
                            <Text style={style.text}>    - Fornecer informações precisas sobre o Aplicativo e seus serviços.</Text>
                            <Text style={style.text}>   A Empresa COMMODUS não se responsabiliza por quaisquer danos diretos, indiretos, especiais ou consequentes decorrentes do uso do aplicativo, incluindo perda de dados ou lucros.</Text>                         
                            <Text />

                            <Text style={style.text}>9. Atualizações do Aplicativo e Site</Text>
                            <Text style={style.text}>   O COMMODUS atualiza tanto o aplicativo quanto o site a fim de proporcionar melhorias de desempenho, correção de bugs e disponibilização de novas funcionalidades, porém, não há uma periodicidade específica, dependendo da decisão única e exclusiva de seus gestores.</Text>
                            <Text />

                            <Text style={style.text}>10. Rescisão</Text>
                            <Text style={style.text}>   A Empresa pode rescindir o acesso do usuário ao aplicativo a qualquer momento, sem aviso prévio, se o usuário violar este Termo.</Text>
                            <Text />

                            <Text style={style.text}>11. Atualizações nos Termos e Condições de uso</Text>
                            <Text style={style.text}>   Este Termo pode ser atualizado a qualquer momento sem aviso prévio. As atualizações serão efetivas assim que o novo Termo for publicado no aplicativo. É responsabilidade do usuário revisar periodicamente este Termo para estar ciente de quaisquer alterações.
                            </Text>
                            <Text />

                            <Text style={style.text}>12. Contato</Text>
                            <Text style={style.text}>   Se o usuário tiver dúvidas sobre este Termo e Condições de Uso do aplicativo COMMODUS, entre em contato conosco por e-mail no endereço contato.commodus@gmail.com. </Text>
                            <Text style={style.text}>   Ao concordar com este Termo, o usuário reconhece que leu e entendeu seus termos e concorda em obedecer a todas as regras e regulamentos estabelecidos neste documento.
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
                                    navigation.navigate('Privacy')
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

export default Terms;