import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

/**
 * Generic form layout to use with scroll view in edit fields
 * @param props 
 * @returns 
 * @author Bruno
 */
function FormLayout(props: React.PropsWithChildren) : JSX.Element {
    return <ScrollView>
        <View style={styles.container}>
            {props.children}
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})

export default FormLayout