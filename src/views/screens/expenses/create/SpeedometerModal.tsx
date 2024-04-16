import React, { useCallback, useState } from 'react'
import { Modal, View, Dimensions, ImageBackground, TouchableWithoutFeedback, StyleSheet, Image, Text } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window')
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome'
import EditExpenseController from '../../../../controllers/EditExpenseController';

function SpeedometerModal(props: React.PropsWithChildren): JSX.Element {
    const [visibleModal, setVisibleModal] = useState(true)
    const navigation = useNavigation();

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
                    navigation.navigate('ViewExpense')
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    <View style={{ flex: 3, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Clicado na parte central (LOGO), vai para tela Dashboard */}
                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('ViewExpense')
                        }}>
                            <Image
                                resizeMode="contain"
                                source={require('../../../assets/logoCommodus.png')}
                                style={{ width: '50%' }}

                            />
                        </TouchableWithoutFeedback>
                    </View>

                    <ImageBackground
                        style={{ flex: 2, width: '100%' }}
                        resizeMode="contain" source={require('../../../assets/velocimetroIconesNovo.png')}
                    >

                        <TouchableWithoutFeedback onPress={() => { //Oleo
                            setVisibleModal(false)
                            navigation.navigate('OilExpense')
                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.06 : height * 0.04, left: width * 0.0416 }]} />
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {  //Documento
                            setVisibleModal(!visibleModal)
                            navigation.navigate('DocumentationExpense')
                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.16 : height * 0.15, left: width * 0.075 }]} />
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {  //Outros
                            setVisibleModal(false)
                            navigation.navigate('MechanicExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height * 0.25, left: width * 0.21 }]} />
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('FuelExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.28 : height * 0.29, left: width * 0.425 }]} />
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('TyreExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height * 0.25, right: width * 0.21 }]} />
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                            setVisibleModal(false)
                            navigation.navigate('AppearanceExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.16 : height * 0.15, right: width * 0.06 }]} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {  //Outros
                            setVisibleModal(false)
                            navigation.navigate('OthersExpense')

                        }}>
                            <View style={[style.iconTouch, { bottom: height >= 700 ? height * 0.06 : height * 0.04, right: width * 0.038 }]} />
                        </TouchableWithoutFeedback>


                        <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%', paddingBottom: RFValue(20) }}>
                            <TouchableWithoutFeedback onPress={() => {  //Botao velocimentro para voltar
                                setVisibleModal(false)
                                navigation.navigate('ViewExpense')

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
    }
});

export default SpeedometerModal;