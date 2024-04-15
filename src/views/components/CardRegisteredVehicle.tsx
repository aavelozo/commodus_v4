import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Icon from 'react-native-vector-icons/Fontisto'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../DefaultStyles'
import Models from '../../database/models/Models'
import { setCurrentViewVehicle } from '../screens/vehicles/ViewVehicle'
const { width, height } = Dimensions.get('window')

function CardRegisteredVehicle(props : React.PropsWithChildren) : JSX.Element {
    const navigator = useNavigation();
    const vehicle = ((props.route || {}).params || {}).vehicle || props.vehicle || {};
    return (
        <TouchableOpacity
            onPress={() => {
                setCurrentViewVehicle(vehicle);
                navigator.navigate(props.screen);
            }}
            //Ao clicar no card, abre a tela com o veículo clicado 
        >
            <View style={style.buttonVehicle}>
                <View style={style.viewPicture}>
                    {
                        vehicle.data().photo ?
                        // Caso tenha foto, renderiza a foto. Caso contrario, mostra ícone do carro
                            <Image
                                style={{ width: '100%', height: '100%', borderRadius: 5 }}
                                resizeMethod='auto'
                                // source={{ uri: 'asset:/' + vehicle.data().foto }}
                                source={{ uri: vehicle.data().photo }}
                            /> :
                            <Icon name='car' size={RFValue(80)} color={DefaultStyles.colors.tabBar} />
                    }
                </View>
                {/* dados do veiculo */}
                <View style={style.info}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[style.textInfo, { fontSize: RFValue(17) }]}>Veículo: {`${vehicle.data().model?.id}-${vehicle.data().plate}`}</Text>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={style.textInfo}>Cor: {vehicle.data().color}</Text>
                    <Text style={style.textInfo}>KM: {vehicle.data().km}</Text>
                    <Text style={style.textInfo}>{vehicle.data().type}</Text>
                </View>
                <View style={style.icon}>
                    <Fontisto name="angle-right" size={RFValue(20)} color={DefaultStyles.colors.tabBar} style={{ alignSelf: 'center', paddingLeft: 3, paddingTop: 4 }} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    buttonVehicle: {
        flexDirection: 'row',
        width: width * 0.85,
        height: height * 0.13,
        backgroundColor: DefaultStyles.colors.fundoInput,
        borderRadius: RFValue(15),
        marginBottom: RFValue(20),
        paddingRight: RFValue(20),
        paddingLeft: RFValue(15),
        paddingVertical: RFValue(10),
        elevation: RFValue(3)
    },
    viewPicture: {
        width: width * 0.27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        paddingLeft: RFValue(15),
  
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.07,
    },
    textInfo: {
        fontSize: RFValue(14),
        color: DefaultStyles.colors.tabBar,
        fontFamily: 'verdana'
    }
});

export default CardRegisteredVehicle;