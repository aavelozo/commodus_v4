import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryAxis, VictoryBar } from "victory-native";




function CashFlow({ data, monthlyExpenses }): JSX.Element {

    return (
        monthlyExpenses.current > 0 ?
            <View style={{ borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "center" }}>
                <Text style={style.titleGraph}>Fluxo de caixa</Text>

                <VictoryChart
                    // theme={VictoryTheme.material}
                    minDomain={{ y: 0 }}
                >
                    <VictoryLine
                        style={{
                            data: { stroke: "#c43a31", strokeWidth: 2 }
                        }}
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 1000 }
                        }}

                        interpolation={"linear"}
                        x={data.x}
                        y={data.y}
                        data={data}
                    />

                    <VictoryAxis
                        dependentAxis
                        tickFormat={(x) => `R$${x}`}
                    />
                    <VictoryAxis
                        // tickFormat={total.name}
                        tickLabelComponent={<VictoryLabel angle={RFValue(-30)} textAnchor="end" style={{ fontSize: RFValue(8) }} />}
                    />

                </VictoryChart>
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

export default CashFlow;