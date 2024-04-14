import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DefaultStyles } from "../DefaultStyles";

/**
 * Botao cancelar padrao para uso no app
 * @author Alencar
 * @created 2022-10-06
 */
function ButtonConclude(props) : JSX.Element {
    return (
        <TouchableOpacity {...props} style={DefaultStyles.buttonConclude}>
            <Text style={DefaultStyles.textButton}>
                {props.text || 'Concluir'}
            </Text>
        </TouchableOpacity>
    );
       
} 

export default ButtonConclude;