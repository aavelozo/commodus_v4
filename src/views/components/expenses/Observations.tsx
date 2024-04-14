import React from 'react'
import { Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { DefaultStyles } from '../../DefaultStyles';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';


interface ObservationsProps {
    setObservations : (observations: string) => void,
    setIsEnabled : (enabled: boolean) => void,
    ref ? : React.RefObject<HTMLElement>,
    observations ? : string,
    isEnabled ? : boolean
}

//OBSERVACOES
function Observations(props : ObservationsProps) : JSX.Element {    
    return (
        <>
            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                    thumbColor={props?.isEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled=>props.setIsEnabled(enabled)}
                    value={props?.isEnabled}
                />
                <TouchableWithoutFeedback 
                    onPress={() => props.setIsEnabled(!props?.isEnabled)}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        Observações
                    </Text>
                </TouchableWithoutFeedback>                    
            </View>

            {
                props?.isEnabled ? <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label='Observações'
                    onChangeText={(observacoes:string) => props.setObservations(observacoes)}
                    value={props.observations}
                    maxLength={20}
                /> : false
            }
        </>
    );
};

export default Observations;