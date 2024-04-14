import React from 'react'
import { View, StyleSheet, FlatList, Dimensions, ScrollView } from 'react-native'

function FormLayout(props: React.PropsWithChildren) : JSX.Element {
    return (
        <ScrollView>
            <View style={styles.container}>
            {props.children}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})

export default FormLayout