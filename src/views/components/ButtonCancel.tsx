import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DefaultStyles } from "../DefaultStyles";

/**
 * Botao cancelar padrao para uso no app
 * @author Alencar
 * @created 2022-10-06
 */
function ButtonCancel(props) : JSX.Element {
    return (
        <TouchableOpacity {...props} style={DefaultStyles.buttonCancel}>
            <Text style={DefaultStyles.textButton}>
                {props.text || 'Cancelar'}
            </Text>
        </TouchableOpacity>
    );
       
} 

export default ButtonCancel;