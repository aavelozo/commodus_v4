import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryAxis, VictoryBar } from "victory-native";
import Oil from '../../assets/iconSvg/oil.svg'
import Fuel from '../../assets/iconSvg/fuel.svg'
import Seguro from '../../assets/iconSvg/seguro.svg'
import Chave from '../../assets/iconSvg/chaveinglesa.svg'
import Outros from '../../assets/iconSvg/outros.svg'
import Pneu from '../../assets/iconSvg/pneu.svg'
import Aparencia from '../../assets/iconSvg/car-wash.svg'




function PercentageExpenses({ data, monthlyExpenses }): JSX.Element {
    return (
        monthlyExpenses.current > 0 ?
        <View style={{ borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "flex-start" }}>
            <Text style={style.titleGraph}>Porcentagem dos gastos</Text>


            <VictoryPie
                innerRadius={60}
                height={350}
                colorScale={data.map(({ color }) => color)}
                data={data}
                animate={{
                    duration: 2000
                }}

                // padding={{ left: 10, top: 50 }}
                // containerComponent={<VictoryContainer responsive={true} width={200}
                //     style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end' }} />}
                labelRadius={({ innerRadius }) => innerRadius + RFValue(25)}
                labels={({ datum }) => {
                    if (datum.y > 0) {
                        return `${(datum.y / monthlyExpenses.current * 100).toFixed(0)}%`
                        // return `${(datum.y).toFixed(0)}%`
                    } else {
                        return
                    }
                }}
                cornerRadius={({ datum }) => 5}
            />
            {
                data.length > 0 ?
                    data.map((data, index) => {
                        var Icon = ''
                        if (data.x == 'Borracharia') {
                            Icon = <Pneu width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        } else if (data.x == 'Combustível') {
                            Icon = <Fuel width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        } else if (data.x == 'Mecânica') {
                            Icon = <Chave width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        } else if (data.x == 'Óleo') {
                            Icon = <Oil width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        } else if (data.x == 'Documento') {
                            Icon = <Seguro width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        } else if (data.x == 'Outros') {
                            Icon = <Outros width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        } else if (data.x == 'Aparência') {
                            Icon = <Aparencia width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                        }
                        return (
                            data.y > 0 ?
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: RFValue(20), marginBottom: RFValue(10) }}>
                                {Icon}
                                <View style={{ borderWidth: 1, height: RFValue(12), width: RFValue(12), backgroundColor: data.color, marginHorizontal: RFValue(10) }}></View>
                                <Text style={[style.textButton, style.textLegend]}>{data.x}: R${data.y.toFixed(2)}  </Text>
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
        alignSelf: 'flex-start',
        marginTop: RFValue(5),
        fontSize: RFValue(14),
        marginLeft: RFValue(10),
        color: DefaultStyles.colors.tabBar,
    }, textButton: {
        textAlign: 'center',
        color: DefaultStyles.colors.tabBar,
        fontWeight: '500'
    },
    textLegend: {
        fontSize: RFValue(17)
    },
});

export default PercentageExpenses;