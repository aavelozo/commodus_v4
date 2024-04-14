import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryAxis, VictoryBar } from "victory-native";



function ExpenseLastYear({ data }): JSX.Element {
    return (
        <View style={{ borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "flex-start" }}>
            <Text style={style.titleGraph}>Gastos dos últimos 365 dias</Text>

            <VictoryChart
                // theme={VictoryTheme.material}
                domainPadding={10}
            >
                <VictoryBar
                    style={{ data: { fill: "#00494A" } }}
                    data={data.reverse()}
                    alignment="middle"
                    sortOrder="descending"

                />
                <VictoryAxis
                    tickFormat={data.x}
                    tickLabelComponent={<VictoryLabel angle={-30} textAnchor="end" style={{ fontSize: RFValue(9) }} />}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (`R$${x}`)}
                />
            </VictoryChart>


        </View>
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

export default ExpenseLastYear;