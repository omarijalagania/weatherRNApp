import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const Loader = () => {
  return <Text style={styles.loader}>Loading...</Text>;
};


const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 22,
        color: 'red'
    }   
})

export default Loader;
