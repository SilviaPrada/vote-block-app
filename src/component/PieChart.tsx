import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { PieChartComponentProps } from '../types/app';

const screenWidth = Dimensions.get('window').width;

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
    return (
        <View style={styles.container}>
            <PieChart
                data={data}
                width={screenWidth - 40} // make the width responsive
                height={225}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    }
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="100"
                hasLegend={false}
                absolute
            />
            <View style={styles.legendContainer}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={[styles.legendText, { color: item.legendFontColor, fontSize: item.legendFontSize }]}>
                            {item.population}{item.name}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
    },
});

export default PieChartComponent;
