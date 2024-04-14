import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryPie } from "victory-native";



function ExpenseComparison({ data, monthlyExpenses }): JSX.Element {
    return (
        monthlyExpenses.current > 0 ?
            <View style={{ borderTopWidth: 1, borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "center" }}>
                <Text style={style.titleGraph}>Comparativo dos gastos</Text>

                <View style={{ flexDirection: 'row', marginTop: RFValue(10) }}>
                    <View style={{ paddingTop: RFValue(20), alignItems: 'center' }}>
                        <Text style={{ fontSize: RFValue(14), color: DefaultStyles.colors.tabBar, }}>mês anterior: </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(15), color: DefaultStyles.colors.tabBar, }}>R${data[0]?.y.toFixed(2)}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <VictoryPie
                            innerRadius={70}

                            cornerRadius={({ datum }) => 3}
                            height={180}
                            width={200}
                            startAngle={-90}
                            endAngle={90}
                            labels={({ datum }) => { }}
                            colorScale={["#007C76", "#CD1515"]}
                            data={data}

                      
                        />
                        {data[0]?.y > data[1]?.y ?
                            <View style={{ position: 'absolute', top: RFValue(100), alignItems: 'center' }}>
                                <Text style={{ fontSize: RFValue(16), color: DefaultStyles.colors.tabBar, }}>Redução de gastos</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{(100 - ((data[1]?.y / data[0]?.y) * 100)).toFixed(2)}%</Text>

                            </View> :
                            <View style={{ position: 'absolute', top: RFValue(100), alignItems: 'center' }}>
                                <Text style={{ fontSize: RFValue(16), color: DefaultStyles.colors.tabBar, }}>Aumento de gastos</Text>
                                {
                                    data[0]?.y == 0 ?
                                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>--</Text>
                                        :
                                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{(((data[1]?.y - data[0]?.y) / data[0]?.y) * 100).toFixed(2)}%</Text>
                                }


                            </View>}
                    </View>
                    <View style={{ paddingTop: RFValue(20), alignItems: 'center' }}>
                        <Text style={{ fontSize: RFValue(14), color: DefaultStyles.colors.tabBar, }}>mês atual: </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(15), color: DefaultStyles.colors.tabBar, }}>R${data[1]?.y.toFixed(2)}</Text>
                    </View>
                </View >
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
    },
});

export default ExpenseComparison;