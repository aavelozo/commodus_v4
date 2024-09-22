import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryPie } from "victory-native";
import Oil from '../../assets/iconSvg/oil.svg'
import Fuel from '../../assets/iconSvg/fuel.svg'
import Seguro from '../../assets/iconSvg/seguro.svg'
import Chave from '../../assets/iconSvg/chaveinglesa.svg'
import Outros from '../../assets/iconSvg/outros.svg'
import Pneu from '../../assets/iconSvg/pneu.svg'
import Aparencia from '../../assets/iconSvg/car-wash.svg'
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash'


/**
 * Graph component
 * @param param0 
 * @returns 
 * @author Bruno
 */
function PercentageExpenses({ data, monthlyExpenses }): JSX.Element {
    console.log('data')
    console.log(data)
    return (
        monthlyExpenses.current > 0 ?
            <View style={{ marginHorizontal: RFValue(3), elevation: RFValue(3), borderRadius: RFValue(15), marginTop: RFValue(10), paddingBottom: RFValue(10), alignItems: "flex-start", backgroundColor: DefaultStyles.colors.fundoInput }}>
                <Text style={style.titleGraph}>{_.capitalize(Trans.t('percentage of expenses'))}</Text>


                <VictoryPie
                    innerRadius={RFValue(60)}
                    height={RFValue(350)}
                    colorScale={data.map(({ color }) => color)}
                    data={data}
                    animate={{
                        duration: 1000
                    }}

                    // padding={{ left: 10, top: 50 }}
                    // containerComponent={<VictoryContainer responsive={true} width={200}
                    //     style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end' }} />}
                    labelRadius={({ innerRadius }) => innerRadius + RFValue(15)}
                    labels={({ datum }) => {
                        console.log(datum.y)
                        if (datum.y > 0) {
                            return `${(datum.y / monthlyExpenses.current * 100).toFixed(2)}%`
                            // return `${(datum.y).toFixed(0)}%`
                        } else {
                            return
                        }
                    }}
                    cornerRadius={({ datum }) => RFValue(5)}
                />
                {
                    data.length > 0 ?
                        data.map((data, index) => {
                            var Icon = ''
                            if (data.x == 'tire') {
                                Icon = <Pneu width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            } else if (data.x == 'fuel') {
                                Icon = <Fuel width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            } else if (data.x == 'mechanic') {
                                Icon = <Chave width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            } else if (data.x == 'oil') {
                                Icon = <Oil width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            } else if (data.x == 'document') {
                                Icon = <Seguro width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            } else if (data.x == 'others') {
                                Icon = <Outros width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            } else if (data.x == 'appearance') {
                                Icon = <Aparencia width={RFValue(20)} height={RFValue(20)} fill={DefaultStyles.colors.tabBar} />
                            }
                            return (
                                data.y > 0 ?
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: RFValue(20), marginBottom: RFValue(5), }}>
                                        {Icon}
                                        <View style={{ borderWidth: 0.5, height: RFValue(10), width: RFValue(10), backgroundColor: data.color, marginHorizontal: RFValue(10) }} />
                                        <Text style={[style.textButton, style.textLegend]}>
                                            {_.capitalize(Trans.t(data.x))}: {(data?.y || 0).toLocaleString(Trans.getDeviceLocale().replace("_", "-"), { style: 'currency', currency: Trans.getLocaleCurrency(), minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Text>
                                    </View>
                                    : false
                            )
                        })
                        : false
                }

            </View>
            : false
    )
}

const style = StyleSheet.create({
    titleGraph: {
        alignSelf: 'center',
        marginTop: RFValue(5),
        fontSize: RFValue(15),
        marginLeft: RFValue(10),
        color: DefaultStyles.colors.tabBar,
    },
    textButton: {
        textAlign: 'center',
        color: DefaultStyles.colors.tabBar,
        fontWeight: '500'
    },
    textLegend: {
        fontSize: RFValue(17)
    },
});

export default PercentageExpenses;