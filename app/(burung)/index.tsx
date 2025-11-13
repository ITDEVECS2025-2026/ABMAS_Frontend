import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAtom } from 'jotai';
import { FontAwesome, Feather } from '@expo/vector-icons';

import {
    birdDetectionConnectedAtom,
    totalBurungAtom,
    rataRataConfidenceAtom,
} from '@/store/birdDetectionStore';
import { useBirdDetection } from '@/lib/hooks/useBirdDetection';

export default function BirdDetectionScreen() {
    useBirdDetection();
    const [isConnected] = useAtom(birdDetectionConnectedAtom);
    const [total] = useAtom(totalBurungAtom);
    const [confidence] = useAtom(rataRataConfidenceAtom);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Deteksi Burung Pipit</Text>
                    <View style={[
                        styles.statusBadge,
                        isConnected ? styles.connectedBadge : styles.disconnectedBadge
                    ]}>
                        <Text style={styles.statusText}>
                            {isConnected ? 'Terhubung' : 'Terputus'}
                        </Text>
                        <View style={[
                            styles.statusDot,
                            isConnected ? styles.connectedDot : styles.disconnectedDot
                        ]} />
                    </View>
                </View>


                <View style={styles.cardList}>

               
                    <View style={styles.card}>
                        <Feather name="hash" size={28} color="#0ea5e9" />
                        <Text style={styles.cardTitle}>TOTAL BURUNG TERDETEKSI</Text>
                        <Text style={styles.cardData}>
                            {total === null ? 'No Data' : total}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <FontAwesome name="shield" size={28} color="#16a34a" />
                        <Text style={styles.cardTitle}>RATA-RATA CONFIDENCE</Text>
                        <Text style={styles.cardData}>
                            {confidence === null
                                ? 'No Data'
                                : `${(confidence * 100).toFixed(0)}%`}
                        </Text>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f4f8', 
    },
    container: {
        flex: 1,
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 60,
        paddingHorizontal: 8,
        gap: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    connectedBadge: {
        backgroundColor: '#dcfce7', 
    },
    disconnectedBadge: {
        backgroundColor: '#fee2e2', 
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        marginRight: 8,
        color: '#1e293b',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    connectedDot: {
        backgroundColor: '#22c55e', 
    },
    disconnectedDot: {
        backgroundColor: '#ef4444', 
    },
  
    cardList: {
        marginTop: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
     
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b', 
        marginTop: 12,
        marginBottom: 8,
    },
    cardData: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#1e293b', 
    },
});