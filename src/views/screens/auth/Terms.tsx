import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, ToastAndroid } from "react-native"
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper'
import { DefaultStyles } from "../../DefaultStyles"
import Header from "../../components/Header"
import TitleView from "../../components/TitleView"
import { RFValue } from "react-native-responsive-fontsize"
import Trans from "../../../controllers/internatiolization/Trans";
import _ from 'lodash';

function Terms({ navigation }): JSX.Element {
    return (
        <>
            <Header noBars />
            <View style={style.title}>
                <TitleView title={`${_.capitalize(Trans.t('terms of use'))} ${Trans.t('and')} LGPD`} />
                <View style={style.menu}>
                    <View style={style.viewTop}>
                        <ScrollView >
                            <Text style={style.text}>   {Trans.t('This Terms of Use is a legal agreement between you and the company COMMODUS, which defines the terms and conditions that govern the use of the application made available by the Company. By using the application, you agree to the terms of this Term. If you do not agree with the terms of this Application, do not use the application.')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('1. Purpose of the Application')}</Text>
                            <Text style={style.text}>  {Trans.t("The application aims to make the user's life easier by managing automotive expenses. Allowing users to record and track their vehicle-related expenses such as fuel, maintenance and insurance.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('2. Eligibility')}</Text>
                            <Text style={style.text}>   {Trans.t("The Application is intended for user's aged 16 or over. By using the Application, you declare that you are at least 16 years old.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('3. General Provisions')}</Text>
                            <Text style={style.text}>   {Trans.t('This Term is governed by Brazilian law and any disputes arising from the use of the application will be resolved by the competent Brazilian courts. If any provision of these Terms is considered invalid or unenforceable.')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('4. Use of the Application')}</Text>
                            <Text style={style.text}>   {Trans.t('The use of the application is the exclusive responsibility of the user, who must use it in accordance with Brazilian legislation and the rules established in these Terms. The user is solely responsible for the content they post on the application and must ensure that it does not infringe the rights of third parties.')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('5. Intellectual Property')}</Text>
                            <Text style={style.text}>   {Trans.t("The application, including its content and design, is protected by intellectual property laws, including copyrights, trademarks and patents. The user agrees not to copy, reproduce, distribute or create derivative works of the application without the Company's prior written authorization.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('6. Registration')}</Text>
                            <Text style={style.text}>   {Trans.t('Access to the application can be done through registration, in which the user must provide accurate and updated information, including their name, email address and password. The user is solely responsible for maintaining the confidentiality of their password and for all activities carried out under their account.')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('7. User Responsibilities')}</Text>
                            <Text style={style.text}>   {Trans.t('When using the Application, you are responsible for:')}</Text>
                            <Text style={style.text}>    {Trans.t('- Ensure that the information provided is accurate and up to date.')}</Text>
                            <Text style={style.text}>    {Trans.t('- Maintain the security of your user account and password.')}</Text>
                            <Text style={style.text}>    {Trans.t('- Ensure that the information provided does not violate the intellectual property rights of the Provider or third parties.')}</Text>
                            <Text style={style.text}>    {Trans.t('- Comply with applicable laws when using the Application.')}</Text>
                            <Text style={style.text}>    {Trans.t('')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('8. Company Responsibilities')}</Text>
                            <Text style={style.text}>   {Trans.t('The COMMODUS Company is responsible for:')}</Text>
                            <Text style={style.text}>    {Trans.t('- Maintain the security and privacy of user information.')}</Text>
                            <Text style={style.text}>    {Trans.t('- Provide technical support and Application updates.')}</Text>
                            <Text style={style.text}>    {Trans.t('- Provide accurate information about the Application and its services.')}</Text>
                            <Text style={style.text}>   {Trans.t('COMMODUS Company is not responsible for any direct, indirect, special or consequential damages arising from the use of the application, including loss of data or profits.')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('9. Application and Website Updates')}</Text>
                            <Text style={style.text}>   {Trans.t('COMMODUS updates both the application and the website in order to provide performance improvements, fix bugs and make new features available, however, there is no specific frequency, depending on the sole and exclusive decision of its managers.')}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('10. Termination')}</Text>
                            <Text style={style.text}>   {Trans.t("The Company may terminate the user's access to the application at any time, without prior notice, if the user violates these Terms.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('11. Updates to Terms and Conditions of Use')}</Text>
                            <Text style={style.text}>   {Trans.t("This Term may be updated at any time without prior notice. Updates will be effective as soon as the new Term is published in the application. It is the user's responsibility to periodically review these Terms to be aware of any changes.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('12. Contact')}</Text>
                            <Text style={style.text}>   {Trans.t('If the user has questions about these Terms and Conditions of Use of the COMMODUS application, please contact us by email at contato.commodus@gmail.com.')} </Text>
                            <Text style={style.text}>   {Trans.t('By agreeing to these Terms, the user acknowledges that they have read and understood its terms and agrees to comply with all rules and regulations established in this document.')}</Text>


                        </ScrollView>
                    </View>
                    <View style={style.viewBottom}>


                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate('UserRegistration')}
                        >
                            <View style={style.button}>
                                <Text style={style.textButton}>{_.capitalize(Trans.t('back'))}</Text>
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