import React from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Fuel from '../assets/iconSvg/fuel.svg'
import Oil from '../assets/iconSvg/oil.svg'
import Doc from '../assets/iconSvg/seguro.svg'
import Wash from '../assets/iconSvg/car-wash.svg'
import Mec from '../assets/iconSvg/chaveinglesa.svg'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../DefaultStyles'
import Utils from '../../controllers/Utils'
import moment from 'moment'
import 'moment/locale/pt-br'
import { useNavigation } from '@react-navigation/native'

function ButtonCardExpense(props): JSX.Element {
    const item = props.data
    const navigation = useNavigation();
    let routeName = '';
    switch ((item || {}).type || "") {
        case 'FUEL':
            routeName ='FuelExpense';
            break;
        case 'OIL':
            routeName ='OilExpense';
            break;
        case 'DOCUMENT':
            routeName ='DocumentationExpense';
            break;
        case 'APPEARANCE':
            routeName ='AppearanceExpense';
            break;
        case 'MECHANIC':
            routeName ='MechanicExpense';
            break;
        case 'TYRE':
            routeName ='TyreExpense';
            break;
        case 'OTHER':
            routeName ='OthersExpense';
            break;
        default:
            throw new Error(`tipo de despesa nao esperada: ${(item || {}).type}`);
    }

    console.log('routeNames',navigation.getState()?.routeNames);

    return (
        <TouchableWithoutFeedback 
            onPress={() => {
                navigation.navigate('StackIncludeExpense', { 
                    screen: routeName, 
                    params: {
                        expenseId: item.id 
                    }
                });
            }}
        >
            <View>
                <View style={[style.cardExpense]}>
                    <View style={style.icon}>
                        {item.type == 'FUEL' &&
                            <Fuel width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item.type == 'OIL' &&
                            <Oil width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item.type == 'DOCUMENT' &&
                            <Doc width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                         {item.type == 'APPEARANCE' &&
                            <Wash width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                         {item.type == 'MECHANIC' &&
                            <Mec width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                    </View>
                    <View style={{ justifyContent: 'center', paddingLeft: RFValue(10), width: '55%' }}>
                        <Text style={style.textExpense}>{item.othersdatas.codOil || item.othersdatas.fuel || item.othersdatas.documentName
                        || item.othersdatas.regularWashing || item.othersdatas.completeWashing || item.othersdatas.service}</Text>
                        <Text style={style.textExpense}>{item.establishment}</Text>
                        <Text style={style.textExpense}>{item.vehicleName}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-end', width: '30%', paddingVertical: 5 }}>
                        <Text style={style.textExpense}> {moment(item.date).format("DD/MM/YY")}</Text>
                        <Icon name="angle-right" size={30} color={DefaultStyles.colors.tabBar} />
                        <Text style={style.textExpense}>R${Number(item.totalValue).toFixed(2)}</Text>
                    </View>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#ccc' }} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    cardExpense: {
        height: Dimensions.get('window').height * 0.11,
        paddingHorizontal: RFValue(10),
        flexDirection: 'row',
        width: '100%'
    },
    icon: {
        width: Dimensions.get('window').width * 0.13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textExpense: {
        fontSize: RFValue(16),
        color: '#333'
    },
});

export default ButtonCardExpense;