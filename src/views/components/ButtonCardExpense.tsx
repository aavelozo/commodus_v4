import React from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Fuel from '../assets/iconSvg/fuel.svg'
import Oil from '../assets/iconSvg/oil.svg'
import Doc from '../assets/iconSvg/seguro.svg'
import Wash from '../assets/iconSvg/car-wash.svg'
import Mec from '../assets/iconSvg/chaveinglesa.svg'
import Tyr from '../assets/iconSvg/pneu.svg'
import Oth from '../assets/iconSvg/outros.svg'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../DefaultStyles'
import moment, { months } from 'moment'
import 'moment/locale/pt-br'
import { useNavigation } from '@react-navigation/native'
import EditExpenseController from '../../controllers/EditExpenseController'
import Trans from '../../controllers/internatiolization/Trans'

function ButtonCardExpense(props): JSX.Element {
    const item = props.data
    //const navigation = useNavigation();
    let routeName = '';

    var dateFormatted = moment(item?.data().date.seconds * 1000).format('DD/MM/YY')

    switch (item?.data().type || "") {
        case 'FUEL':
            routeName = 'FuelExpense';
            break;
        case 'OIL':
            routeName = 'OilExpense';
            break;
        case 'DOCUMENT':
            routeName = 'DocumentationExpense';
            break;
        case 'APPEARANCE':
            routeName = 'AppearanceExpense';
            break;
        case 'MECHANIC':
            routeName = 'MechanicExpense';
            break;
        case 'TYRE':
            routeName = 'TyreExpense';
            console.log(item?.data())
            break;
        case 'OTHER':
            routeName = 'OthersExpense';
            
            console.log(item?.data())
            break;
        default:
            throw new Error(`${Trans.t('not expected expense type')}: ${item?.data().type}`);
    }


    return (
        <TouchableWithoutFeedback
            onPress={() => {
                EditExpenseController.currentExpense = item;
                props.navigate('StackEditExpense', {
                    screen: routeName
                });
            }}
        >
            <View>
                <View style={[style.cardExpense]}>
                    <View style={style.icon}>
                        {item?.data().type == 'FUEL' &&
                            <Fuel width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item?.data().type == 'OIL' &&
                            <Oil width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item?.data().type == 'DOCUMENT' &&
                            <Doc width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item?.data().type == 'APPEARANCE' &&
                            <Wash width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item?.data().type == 'MECHANIC' &&
                            <Mec width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item?.data().type == 'TYRE' &&
                            <Tyr width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item?.data().type == 'OTHER' &&
                            <Oth width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                    </View>
                    <View style={{ justifyContent: 'center', paddingLeft: RFValue(10), width: '55%' }}>
                        <Text style={style.textExpense}>{item?.data().othersdatas.codOil || item?.data().othersdatas.fuel || item?.data().othersdatas.documentName
                            || item?.data().othersdatas.othersServices || item?.data().othersdatas.service || item?.data().othersdatas.typeService || item?.data().othersdatas.description }</Text>
                        <Text style={style.textExpense}>{item?.data().establishment}</Text>
                        <Text style={style.textExpense}>{item?.vehicleName}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-end', width: '30%', paddingVertical: 5 }}>
                        <Text style={style.textExpense}> {dateFormatted}</Text>
                        <Icon name="angle-right" size={30} color={DefaultStyles.colors.tabBar} />
                        <Text style={style.textExpense}>{Number(item?.data()?.totalValue || 0).toLocaleString(Trans.getDeviceLocale().replace("_","-"),{style:'currency',currency: Trans.getLocaleCurrency(), minimumFractionDigits:2,maximumFractionDigits:2})}</Text>
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