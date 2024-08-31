import React, { useEffect, useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../../DefaultStyles'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryAxis, VictoryBar } from "victory-native";
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash'


function ExpenseLastYear({ data }): JSX.Element {
    return (
        <View style={{ marginHorizontal: RFValue(3), borderWidth: 1, borderRadius: RFValue(10), marginTop: RFValue(10), alignItems: "center", backgroundColor: '#F4F4F4' }}>
            <Text style={[style.titleGraph, {paddingLeft: RFValue(-10)}]}>{_.capitalize(Trans.t('spending from the last 365 days'))}</Text>

            <VictoryChart
                // theme={VictoryTheme.material}
                domainPadding={10}
            >
                <VictoryBar
                    style={{ data: { fill: "#00494A" } }}
                    data={data.reverse()}
                    alignment="middle"
                    sortOrder="descending"
                    labels={({ datum }) =>  (`${datum.y > 0 ? `${datum.y}` : ''}`)}
                />
                <VictoryAxis
                    tickFormat={data.x}
                    tickLabelComponent={<VictoryLabel angle={-30} textAnchor="end" style={{ fontSize: RFValue(10) }} />}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (x||0).toLocaleString(Trans.getDeviceLocale().replace("_","-"),{style:'currency',currency: Trans.getLocaleCurrency(), minimumFractionDigits:2,maximumFractionDigits:2})}
                    tickLabelComponent={<VictoryLabel angle={RFValue(-45)} textAnchor="end" style={{ fontSize: RFValue(10) }} />}
                />
            </VictoryChart>


        </View>
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

export default ExpenseLastYear;