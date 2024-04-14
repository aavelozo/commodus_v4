import React from 'react'
import { View } from 'react-native'
import RadioForm from 'react-native-simple-radio-button'
import { RFValue } from 'react-native-responsive-fontsize'
import { DefaultStyles } from '../DefaultStyles'

function Radio(props: React.PropsWithChildren) : JSX.Element {
    
    return (
        <View style={{ paddingVertical: RFValue(10), marginTop: RFValue(12) }}>
            <RadioForm
                radio_props={props.enginesTypes}
                onPress={(value) => props.funcao(value)}
                initial={props.selected}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                buttonSize={RFValue(10)}
                buttonOuterSize={RFValue(20)}
                buttonColor={DefaultStyles.colors.tabBar}
                labelColor={DefaultStyles.colors.tabBar}
                selectedButtonColor={'#007C76'}
                selectedLabelColor={DefaultStyles.colors.tabBar}
                labelStyle={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, alignItems: 'center', justifyContent: 'center',fontFamily: 'verdana' }}
            />
        </View>
    )
};

export default Radio;

