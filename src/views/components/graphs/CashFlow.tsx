import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryAxis, VictoryBar } from "victory-native";
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash'




function CashFlow({ data, monthlyExpenses }): JSX.Element {

    return (
        monthlyExpenses.current > 0 ?
            <View style={{ marginHorizontal: RFValue(3), borderWidth: 1, borderRadius: RFValue(10), marginTop: RFValue(10), alignItems: "center", backgroundColor: '#F4F4F4' }}>
                <Text style={style.titleGraph}>{_.capitalize(Trans.t('cash flow'))}</Text>

                <VictoryChart
                    // theme={VictoryTheme.material}
                    minDomain={{ y: 0 }}
                >
                    <VictoryLine
                        style={{
                            data: { stroke: "#c43a31", strokeWidth: RFValue(3), },


                        }}
                        width={300}
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
                        tickFormat={(x) => (x || 0).toLocaleString(Trans.getDeviceLocale().replace("_", "-"), { style: 'currency', currency: Trans.getLocaleCurrency(), minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        tickLabelComponent={<VictoryLabel angle={RFValue(-45)} textAnchor="end" style={{ fontSize: RFValue(8) }} />}
                    />
                    <VictoryAxis
                        // tickFormat={total.name}
                        tickLabelComponent={<VictoryLabel angle={RFValue(-20)} textAnchor="end" style={{ fontSize: RFValue(8) }} />}
                    />

                </VictoryChart>
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
});

export default CashFlow;