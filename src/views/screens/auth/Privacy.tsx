import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, ToastAndroid } from "react-native"
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper'
import { DefaultStyles } from "../../DefaultStyles"
import Header from "../../components/Header"
import TitleView from "../../components/TitleView"
import { RFValue } from "react-native-responsive-fontsize"
import Trans from "../../../controllers/internatiolization/Trans";
import _ from 'lodash';

function Privacy({ navigation }): JSX.Element {

    return (
        <>
            <Header noBars />
            <View style={style.title}>
            <TitleView title={_.capitalize(Trans.t('privacy policy'))} />
                <View style={style.menu}>
                    <View style={style.viewTop}>
                        <ScrollView >
                            <Text style={style.text}>   {Trans.t("This privacy policy describes how the COMMODUS Automotive Expense Management application collects, uses and shares users' personal information. The app aims to help users manage their automotive expenses easily and efficiently. Your privacy is important to us and we are committed to protecting it.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t("1. Information Collection")}</Text>
                            <Text style={style.text}>   {Trans.t("The COMMODUS application collects the following personal information from users:")}</Text>
                            <Text style={style.text}>    {Trans.t("- Registration information: The application may ask the user to provide their name, email address, password and other relevant registration information.")}</Text>
                            <Text style={style.text}>    {Trans.t("- Vehicle information: The application may collect information about the user's vehicle, including the model, year, brand and other related information.")}</Text>
                            <Text style={style.text}>    {Trans.t("- Value information: the application can collect information about the user's expenses related to the vehicle, such as fuel, maintenance and other expenses.")}</Text>
                            <Text style={style.text}>   {Trans.t( "Additionally, the COMMODUS app may collect non-personal information such as device information, browser information, and other technical information to improve the user experience.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t('2. Use of Informartion')}</Text>
                            <Text style={style.text}>   {Trans.t("The COMMODUS application uses the information collected for the following purposes:")}</Text>
                            <Text style={style.text}>    {Trans.t("- Provide personalized services to the user.")}</Text>
                            <Text style={style.text}>    {Trans.t("- Send notifications and alerts to the user about vehicle expenses.")}</Text>
                            <Text style={style.text}>    {Trans.t("- Provide analysis and reports on user's vehicle expenses.")}</Text>
                            <Text style={style.text}>    {Trans.t("- Improve the quality of the application and the services offered.")}</Text>
                            <Text style={style.text}>    {Trans.t("- Comply with legal and regulatory obligations.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t("3. Information Sharing")}</Text>
                            <Text style={style.text}>   {Trans.t("The COMMODUS application may share user personal information with third parties only in the following circumstances:")}</Text>
                            <Text style={style.text}> {Trans.t("- With user consent.")}</Text>
                            <Text style={style.text}> {Trans.t("- To comply with legal and regulatory obligations.")}</Text>
                            <Text style={style.text}> {Trans.t("- To protect the rights, property and security of the application, users and other interested parties.")}</Text>
                            <Text style={style.text}>   {Trans.t("The application will not sell, rent or exchange user personal information for marketing or advertising purposes.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t("4. Information Security")}</Text>
                            <Text style={style.text}>   {Trans.t("The COMMODUS application uses appropriate technical and organizational measures to protect the user's personal information against unauthorized access, use, disclosure or destruction. The application adopts appropriate information security policies to ensure the confidentiality and integrity of the user's personal information.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t("5. Updates to the Privacy Policy")}</Text>
                            <Text style={style.text}>   {Trans.t("This privacy policy may be updated at any time without prior notice. Updates will be effective once the new privacy policy is published on the app. It is the user's responsibility to periodically review this privacy policy to be aware of any changes.")}</Text>
                            <Text />

                            <Text style={style.text}>{Trans.t("6. Contact")}</Text>
                            <Text style={style.text}>   {Trans.t("If the user has questions or concerns about this privacy policy or the use of personal information by the COMMODUS application, please contact us by email at contato.commodus@gmail.com.")}</Text>
                            <Text style={style.text}>   {Trans.t("By agreeing, the user acknowledges that they have read and understood the Privacy Policy and agree to comply with all rules and regulations established in this document.")}</Text>
                            <Text />

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

export default Privacy;