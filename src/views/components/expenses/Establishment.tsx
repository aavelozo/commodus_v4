import React from 'react'
import { Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { DefaultStyles } from '../../DefaultStyles';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';

interface EstablishmentProps {
    setEstablishment : (establishment: string) => void,
    setIsEnabled : (enabled: boolean) => void,
    ref ? : React.RefObject<HTMLElement>,
    establishment ? : string,
    isEnabled ? : boolean,    
}

function Establishment(props : EstablishmentProps) : JSX.Element {
    
    return (
        <>
            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                <Switch
                    ref={props?.ref}
                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                    thumbColor={props.isEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled=>props.setIsEnabled(enabled)}
                    value={props.isEnabled}
                />
                <TouchableWithoutFeedback
                    onPress={() => props.setIsEnabled(!props.isEnabled)}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        {_.capitalize(Trans.t('establishment'))}
                    </Text>
                </TouchableWithoutFeedback>                    
            </View>

            {
                props.isEnabled ? <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label={_.capitalize(Trans.t('establishment'))}
                    onChangeText={estab => props.setEstablishment(estab)}
                    value={props.establishment}
                    maxLength={20}
                /> : false
            }
        </>
    );
};

export default Establishment;