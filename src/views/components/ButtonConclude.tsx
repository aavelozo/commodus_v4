import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DefaultStyles } from "../DefaultStyles";
import { ActivityIndicator } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

/**
 * Botao cancelar padrao para uso no app
 * @author Alencar
 * @created 2022-10-06
 */
function ButtonConclude(props) : JSX.Element {
    return (
        <TouchableOpacity 
            {...props} 
            style={[
                DefaultStyles.buttonConclude,
                {
                    left: props.loading || props.saving ? RFValue(10) : undefined
                }

            ]}
            disabled={props.loading || props.saving || false}
        >
            {props.loading || props.saving
                ? <ActivityIndicator />
                : <Text 
                    style={DefaultStyles.textButton}
                >
                    {props.text || 'Concluir'}
                </Text>
            }
        </TouchableOpacity>
    );
       
} 

export default ButtonConclude;