import React, { useCallback, useState } from 'react'
import { Modal, View, Dimensions, ImageBackground, TouchableWithoutFeedback, StyleSheet, Image, Text } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window')
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome'
import EditExpenseController from '../../../../controllers/EditExpenseController';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';

/**
 * root component as speedometer for choice expense type to create
 * @param props 
 * @returns 
 * @author Bruno
 */
function SpeedometerModal(props: React.PropsWithChildren): JSX.Element {
    const [visibleModal, setVisibleModal] = useState(true)
    const navigation = useNavigation();
    console.log(height, 'heigth')
    // Sempre que entrar em foco, altera o modal como true
    useFocusEffect(useCallback(() => {
        EditExpenseController.currentExpense = null;
        setVisibleModal(true)
    }, []))

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={visibleModal}
                onRequestClose={() => {
                    setVisibleModal(false)
                    //navigation.navigate('ViewExpense')
                    navigation.goBack();
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <View style={{ flex: 3, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Clicado na parte central (LOGO), vai para tela Dashboard */}
                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            //navigation.navigate('ViewExpense');
                            navigation.goBack();
                        }}>
                            <Image
                                resizeMode="contain"
                                source={require('../../../assets/logoCommodus.png')}
                                style={{ width: '40%' }}

                            />
                        </TouchableWithoutFeedback>
                    </View>

                    <ImageBackground
                        style={{ flex: 2, width: '100%' }}
                        resizeMode="contain" source={require('../../../assets/velocimetroIconesNovo.png')}
                    >
                        <Text style={[style.text,{ bottom: height >= 700 ? height * 0.12 : height * 0.095, left: width * 0.065, position: 'absolute' }]}>
                            {_.capitalize(Trans.t('oil'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => { //Oleo
                            setVisibleModal(false)
                            navigation.navigate('OilExpense')
                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.06 : height * 0.04, left: width * 0.0416 }]} />
                        </TouchableWithoutFeedback>

                        <Text style={[style.text,{ bottom: height >= 700 ? height * 0.22 : height * 0.208, left:  height >= 700 ? width * 0.06 : width * 0.045, position: 'absolute' }]}>
                            {_.capitalize(Trans.t('document'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {  //Documento
                            setVisibleModal(!visibleModal)
                            navigation.navigate('DocumentationExpense')
                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.16 : height * 0.15, left: width * 0.075 }]} />
                        </TouchableWithoutFeedback>

                        <Text style={[style.text,{ bottom: height >= 700 ? height * 0.305 : height * 0.306, left:height >= 700 ? width * 0.21 : width * 0.195, position: 'absolute' }]}>                            
                            {_.capitalize(Trans.t('mechanic'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {  //Outros
                            setVisibleModal(false)
                            navigation.navigate('MechanicExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height * 0.25, left: width * 0.21 }]} />
                        </TouchableWithoutFeedback>

                        <Text style={[style.text,{ bottom: height * 0.34, left: height >= 700 ? width * 0.42 : width * 0.392, position: 'absolute' }]}>
                            {_.capitalize(Trans.t('fuel'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('FuelExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.28 : height * 0.29, left: width * 0.425 }]} />
                        </TouchableWithoutFeedback>

                        <Text style={[style.text,{ bottom: height >= 700 ? height * 0.305 : height * 0.302,  right: height >= 700 ? width * 0.20 : width * 0.18, position: 'absolute' }]}>
                            {_.capitalize(Trans.t('tire'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('TireExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height * 0.25, right: width * 0.21 }]} />
                        </TouchableWithoutFeedback>

                        <Text style={[style.text,{ bottom: height >= 700 ? height * 0.222 : height * 0.21, right: height >= 700 ? width * 0.06 : width * 0.042, position: 'absolute' }]}>
                            {_.capitalize(Trans.t('appearance'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('AppearanceExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.16 : height * 0.15, right: width * 0.06 }]} />
                        </TouchableWithoutFeedback>

                        <Text style={[style.text,{bottom: height >= 700 ? height * 0.122 : height * 0.1, right: height >= 700 ? width * 0.055 : width * 0.045, position: 'absolute' }]}>
                            {_.capitalize(Trans.t('others'))}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => {  //Outros
                            setVisibleModal(false)
                            navigation.navigate('OthersExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.06 : height * 0.04, right: width * 0.038 }]} />
                        </TouchableWithoutFeedback>


                        <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%', paddingBottom: RFValue(20) }}>
                            <TouchableWithoutFeedback onPress={() => {  //Botao velocimentro para voltar
                                setVisibleModal(false)
                                //navigation.navigate('ViewExpense');
                                navigation.goBack();

                            }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#630303', width: RFValue(60), height: RFValue(60), borderRadius: RFValue(30), }}>
                                    <Icon name="plus" size={RFValue(35)} color={'#f4f4f4'} style={{
                                        transform: [{ rotate: '45deg' }],
                                    }} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>


                    </ImageBackground>
                </View >
            </Modal >
        </View >
    )
}

const style = StyleSheet.create({
    iconTouch: {
        width: width * 0.16,
        height: width * 0.17,
        position: 'absolute',
    },
    text: {
        color: '#d5d5d5'
    }
});

export default SpeedometerModal;