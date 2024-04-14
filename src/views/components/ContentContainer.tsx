import React from "react";
import { StyleSheet, View } from "react-native";
import { DefaultStyles } from "../DefaultStyles";


/**
 * Componente padrao do conteudo das tabs no app
 * @author Alencar
 * @created 2022-10-05
 */
function ContentContainer(props: React.PropsWithChildren) : JSX.Element {
    return (
        <View {...props} style={[style.contentContainer,props?.style||{}]}>
            {props.children}
        </View>
    );        
} 

const style = StyleSheet.create({    
    contentContainer: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: 25,
        padding: 10,
        width: '100%',
    }
});

export default ContentContainer;