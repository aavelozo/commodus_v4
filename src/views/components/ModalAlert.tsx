import React from 'react'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import AwesomeAlert from 'react-native-awesome-alerts';
import { DefaultStyles } from '../DefaultStyles';

//COM-19

function ModalAlert(props : React.PropsWithChildren) : JSX.Element {
    const [modalVisible, setModalVisible] = React.useState(true);   

    return (
        <AwesomeAlert
            show={modalVisible}
            showProgress={false}
            title={props.title}
            contentContainerStyle={{ width: '100%', backgroudColor: '#D9D9D9', paddingHorizontal: RFValue(20) }}
            messageStyle={{ fontSize: RFValue(14), fontFamily: DefaultStyles.formElement.fontFamily, alignItems: 'center', justifyContent: 'center', }}
            titleStyle={{ fontSize: RFValue(20), fontFamily: DefaultStyles.formElement.fontFamily, alignItems: 'center' }}
            message={props.message}
            confirmButtonStyle={{ height: RFValue(40), width: props.onlyConfirm ? '100%' : '40%', alignItems: 'center', justifyContent: 'center', borderRadius: RFValue(10), elevation: 1, }}
            cancelButtonStyle={{ height: RFValue(40), width: '40%', alignItems: 'center', justifyContent: 'center', borderRadius: RFValue(10), elevation: 1, }}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={!props.onlyConfirm}
            showConfirmButton={true}
            cancelText={props.textCancel}
            confirmText={props.textConfirm}
            confirmButtonColor={DefaultStyles.colors.botao}
            cancelButtonColor={DefaultStyles.colors.fundo}
            confirmButtonTextStyle={{ color: DefaultStyles.colors.tabBar, fontSize: RFValue(15), fontFamily: DefaultStyles.formElement.fontFamily }}
            cancelButtonTextStyle={{ color: DefaultStyles.colors.tabBar, fontSize: RFValue(15), fontFamily: DefaultStyles.formElement.fontFamily }}
            onCancelPressed={() => {
                setModalVisible(false)
                props.updateShowAlert(false)
            }}
            onConfirmPressed={() => {
                setModalVisible(false)
                props.updateShowAlert(false)
            }}
        />
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ModalAlert;