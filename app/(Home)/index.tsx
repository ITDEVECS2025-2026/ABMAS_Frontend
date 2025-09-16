import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import mqtt from "@/lib/mqtt";
import { Form } from "@/components/form/Form";
import { useForm } from "react-hook-form";
import { FormLabel } from "@/components/form/FormLabel";
import { FormField } from "@/components/form/FormField";
import { FormMessage } from "@/components/form/FormMessage";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MqttProps, ReceivedMessage } from "@/interfaces/IMqtt";
import { useNormalizedURL } from "@/utils/useURLConvertion";
import { mqqtMessageAtom, useMqqtMessageAtom } from "@/store/atom";
import { VStack } from "@/components/ui/vstack";
import { useAtom, useSetAtom } from "jotai";
import parsedPayload from "@/utils/parsedPayload"
const validationSchema = z.object({
    brokerUrl: z
        .string()
        .min(1, "URL broker tidak boleh kosong")
        .regex(
            /^(mqtt:\/\/|tcp:\/\/|ws:\/\/|wss:\/\/)/,
            "URL harus dimulai dengan mqtt://, tcp://, ws://, atau wss://"
        ),
    topic: z.string().min(1, "Topic tidak boleh kosong"),
});

export default function Index() {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [receivedMessages, setReceivedMessages] = useAtom(mqqtMessageAtom);
    const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
    const payloadSender = useSetAtom(mqqtMessageAtom);

    const methods = useForm<MqttProps>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            brokerUrl: "mqtt://broker.emqx.io:1883",
            topic: "abmasecs/data",
        },
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        const onConnected = () => {
            setConnectionStatus("Connected");
            setIsConnected(true);
            console.log("MQTT Connected event received");
        };

        const onDisconnected = () => {
            setConnectionStatus("Disconnected");
            setIsConnected(false);
            setSubscribedTopics([]);
            console.log("MQTT Disconnected event received");
        };

        const onError = (error: Error) => {
            setConnectionStatus(`Error: ${error.message}`);
            console.log("MQTT Error event received:", error);
        };

        const onMessage = (data: { topic: string; message: string }) => {
            const parsedData = parsedPayload(data.message);
            console.log("Message received:", data.topic, data.message);
            console.log("Parsed message:", parsedData);
            const newMessage: ReceivedMessage = {
                topic: data.topic,
                message: typeof parsedData === "string" ? parsedData : JSON.stringify(parsedData),
                timestamp: new Date(),
            };
            setReceivedMessages(prev => [newMessage, ...prev].slice(0, 50));
            payloadSender(prev => [newMessage, ...prev].slice(0, 50));
        };

        const onSubscribed = (topic: string) => {
            setSubscribedTopics(prev => [...prev, topic]);
            console.log("Subscribed to:", topic);
        };

        const onUnsubscribed = (topic: string) => {
            setSubscribedTopics(prev => prev.filter(t => t !== topic));
            console.log("Unsubscribed from:", topic);
        };

        mqtt.addListener("connected", onConnected);
        mqtt.addListener("disconnected", onDisconnected);
        mqtt.addListener("error", onError);
        mqtt.addListener("message", onMessage);
        mqtt.addListener("subscribed", onSubscribed);
        mqtt.addListener("unsubscribed", onUnsubscribed);

        return () => {
            mqtt.removeAllListeners("connected");
            mqtt.removeAllListeners("disconnected");
            mqtt.removeAllListeners("error");
            mqtt.removeAllListeners("message");
            mqtt.removeAllListeners("subscribed");
            mqtt.removeAllListeners("unsubscribed");
        };
    }, []);

    // const onMessage = (data: { message: string, topic: string }) => {
    //     const parsedData = parsedPayload(data.message);

    //     console.log("Received message on topic:", data.topic, data.message);
    //    

    //     const newMessage: ReceivedMessage = {
    //         topic: data.topic,
    //         message: data.message,
    //         timestamp: new Date(),
    //         parsedMessage: parsedData,
    //     };

    //     console.log("Updated messages in atom:", newMessage);
    // }

    const handleConnect = (data: MqttProps) => {
        if (!isConnected) {
            setConnectionStatus("menghubungkan...");

            const brokerUrl = useNormalizedURL(data.brokerUrl);

            mqtt.connect(brokerUrl, {
                clientId: "rn-client-" + Math.random().toString(16).substr(2, 8),
                protocolId: "MQTT",
                protocolVersion: 4,
                clean: true,
            })
                .then(() => {
                    setIsConnected(true);
                    setConnectionStatus("terhubung");
                    mqtt.subscribe(data.topic);
                })
                .catch((err: Error) => {
                    console.log("Gagal terhubung ke broker MQTT", err);
                    setIsConnected(false);
                    setConnectionStatus(`Koneksi Gagal: ${err.message}`);

                    methods.setError("brokerUrl", {
                        type: "manual",
                        message: `Gagal terhubung: ${err.message}`,
                    });
                });
            } else {
                setReceivedMessages([]);
                mqtt.disconnect();
                setIsConnected(false);
                setConnectionStatus("Terputus");
                console.log("Terputus dari broker MQTT");
        }
    };

    const handlePublish = () => {
        const topic = methods.getValues("topic");
        const message = "Test message from React Native app";
        mqtt.publish(topic, message);
    };

    const clearMessages = () => {
        setReceivedMessages([]);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.decorativeCircle} />
                <Text style={styles.headerTitle}>🌱 Monitor Tanah</Text>
                <Text style={styles.headerSubtitle}>Sistem Pemantauan Pertanian Lanjutan</Text>
            </View>

            {/* Status Indicator */}
            <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Status</Text>
                    <View style={styles.statusIndicatorRow}>
                        <View style={[
                            styles.statusDot,
                            {
                                backgroundColor: isConnected
                                    ? '#10b981'
                                    : connectionStatus.includes('Error')
                                        ? '#ef4444'
                                        : '#f59e0b'
                            }
                        ]} />
                        <Text style={[
                            styles.statusText,
                            {
                                backgroundColor: isConnected
                                    ? '#dcfce7'
                                    : connectionStatus.includes('Error')
                                        ? '#fee2e2'
                                        : '#fef3c7',
                                color: isConnected
                                    ? '#166534'
                                    : connectionStatus.includes('Error')
                                        ? '#991b1b'
                                        : '#92400e'
                            }
                        ]}>
                            {connectionStatus}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Connection Form */}
            <View style={styles.formCard}>
                <Text style={styles.formTitle}>🔗 Pengaturan Koneksi</Text>
                <Form<MqttProps> methods={methods}>
                    <View style={styles.inputGroup}>
                        <FormLabel style={styles.inputLabel}>Broker URL</FormLabel>
                        <FormField
                            name="brokerUrl"
                            render={({ value, onChange, onBlur }) => (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="mqtt://broker.emqx.io:1883"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="url"
                                        editable={!isConnected}
                                    />
                                    <Text style={styles.inputIcon}>🌐</Text>
                                </View>
                            )}
                        />
                        <FormMessage name="brokerUrl" />
                    </View>

                    <View style={styles.inputGroup}>
                        <FormLabel style={styles.inputLabel}>Topic</FormLabel>
                        <FormField
                            name="topic"
                            render={({ value, onChange, onBlur }) => (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="/ecs/abmas/0/data"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!isConnected}
                                    />
                                    <Text style={styles.inputIcon}>📡</Text>
                                </View>
                            )}
                        />
                        <FormMessage name="topic" />
                    </View>

                    <Button
                        onPress={methods.handleSubmit(handleConnect)}
                        style={[
                            styles.connectButton,
                            { backgroundColor: isConnected ? '#ef4444' : '#10b981' }
                        ]}
                        disabled={methods.formState.isSubmitting}
                    >
                        <ButtonText style={styles.connectButtonText}>
                            {methods.formState.isSubmitting ? "🔄 Menghubungkan..." : isConnected ? "🔌 terputus" : "⚡ terhubung"}
                        </ButtonText>
                    </Button>
                </Form>
            </View>

            {/* Control Panel */}
            {isConnected && (
                <View style={styles.controlPanel}>
                    <Text style={styles.controlTitle}>📋 Subscribed Topics</Text>
                    {subscribedTopics.map((topic, index) => (
                        <View key={topic} style={styles.topicItem}>
                            <Text style={styles.topicText}>📌 {topic}</Text>
                        </View>
                    ))}

                    <View style={styles.buttonRow}>
                        <Button
                            onPress={handlePublish}
                            style={[styles.controlButton, { backgroundColor: '#8b5cf6' }]}
                        >
                            <ButtonText style={styles.controlButtonText}>📤 Test Koneksi</ButtonText>
                        </Button>

                        <Button
                            onPress={clearMessages}
                            style={[styles.controlButton, { backgroundColor: '#f97316' }]}
                        >
                            <ButtonText style={styles.controlButtonText}>🗑️ Bersihkan</ButtonText>
                        </Button>
                    </View>
                </View>
            )}

            {/* Messages Section */}
            <View style={styles.messagesSection}>
                <Text style={styles.messagesTitle}>📨 Live Messages</Text>
                <View style={styles.messagesContainer}>
                    <ScrollView style={styles.messagesScrollView}>
                        {receivedMessages.length === 0 ? (
                            <View style={styles.noMessagesContainer}>
                                <Text style={styles.noMessagesIcon}>📡</Text>
                                <Text style={styles.noMessagesText}>menunggu pesan masuk...</Text>
                                <Text style={styles.noMessagesSubtext}>Hubungkan untuk mulai menerima data</Text>
                            </View>
                        ) : (
                            receivedMessages.map((msg, index) => (
                                <View key={index} style={styles.messageCard}>
                                    <Text style={styles.messageTopicText}>📍 {msg.topic}</Text>
                                    <View style={styles.messageContentContainer}>
                                        <Text style={styles.messageContentText}>{msg.message}</Text>
                                    </View>
                                    <Text style={styles.messageTimestamp}>
                                        🕐 {msg.timestamp.toLocaleTimeString()}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>

            {/* Device Navigation Grid */}
            <VStack style={styles.deviceGrid}>
                <View style={styles.deviceRow}>
                    <Button
                        disabled={!isConnected}
                        onPress={() => router.push("/(deviceOne)")}
                        style={[
                            styles.deviceButton,
                            { backgroundColor: isConnected ? '#10b981' : '#d1d5db' }
                        ]}
                    >
                        <ButtonText style={[
                            styles.deviceButtonText,
                            { color: isConnected ? '#ffffff' : '#6b7280' }
                        ]}>
                            🌾 Sensor 1
                        </ButtonText>
                    </Button>

                    <Button
                        disabled={!isConnected}
                        onPress={() => router.push("/(deviceTwo)")}
                        style={[
                            styles.deviceButton,
                            { backgroundColor: isConnected ? '#059669' : '#d1d5db' }
                        ]}
                    >
                        <ButtonText style={[
                            styles.deviceButtonText,
                            { color: isConnected ? '#ffffff' : '#6b7280' }
                        ]}>
                            🌿 Sensor 2
                        </ButtonText>
                    </Button>
                </View>

                <View style={styles.deviceRow}>
                    <Button
                        disabled={!isConnected}
                        onPress={() => router.push("/(deviceThree)")}
                        style={[
                            styles.deviceButton,
                            { backgroundColor: isConnected ? '#0d9488' : '#d1d5db' }
                        ]}
                    >
                        <ButtonText style={[
                            styles.deviceButtonText,
                            { color: isConnected ? '#ffffff' : '#6b7280' }
                        ]}>
                            🌱 Sensor 3
                        </ButtonText>
                    </Button>

                    <Button
                        disabled={!isConnected}
                        onPress={() => router.push("/(deviceFour)")}
                        style={[
                            styles.deviceButton,
                            { backgroundColor: isConnected ? '#65a30d' : '#d1d5db' }
                        ]}
                    >
                        <ButtonText style={[
                            styles.deviceButtonText,
                            { color: isConnected ? '#ffffff' : '#6b7280' }
                        ]}>
                            🍃 Sensor 4
                        </ButtonText>
                    </Button>
                </View>

                <View style={styles.deviceRowCenter}>
                    <Button
                        disabled={!isConnected}
                        onPress={() => router.push("/(deviceFive)")}
                        style={[
                            styles.deviceButtonSingle,
                            { backgroundColor: isConnected ? '#16a34a' : '#d1d5db' }
                        ]}
                    >
                        <ButtonText style={[
                            styles.deviceButtonText,
                            { color: isConnected ? '#ffffff' : '#6b7280' }
                        ]}>
                            🌳 Sensor 5
                        </ButtonText>
                    </Button>
                </View>
            </VStack>

            {/* Background Elements */}
            <View style={styles.backgroundCircle1} />
            <View style={styles.backgroundCircle2} />
            <View style={styles.backgroundCircle3} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4',
        padding: 16,
        height: '100%',
        width: '100%',
        margin: 3
    },
    header: {
        marginTop: 20,
        marginBottom: 24,
        position: 'relative',
        alignItems: 'center',
    },
    decorativeCircle: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 32,
        height: 32,
        backgroundColor: '#bbf7d0',
        borderRadius: 16,
        opacity: 0.3,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#166534',
        marginBottom: 8,
    },
    headerSubtitle: {
        textAlign: 'center',
        color: '#16a34a',
        fontSize: 14,
    },
    statusCard: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    statusIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 14,
    },
    formCard: {
        marginBottom: 24,
        padding: 24,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#166534',
        marginBottom: 16,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        color: '#15803d',
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 16,
    },
    inputContainer: {
        position: 'relative',
    },
    textInput: {
        backgroundColor: '#f0fdf4',
        borderWidth: 2,
        borderColor: '#bbf7d0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingRight: 48,
        color: '#374151',
        fontSize: 16,
    },
    inputIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
        color: '#4ade80',
        fontSize: 16,
    },
    connectButton: {
        width: '100%',

        borderRadius: 12,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    connectButtonText: {
        color: '#ffffff',
        fontWeight: 'light',
        fontSize: 18,
        textAlign: 'center',
    },
    controlPanel: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    controlTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#166534',
        marginBottom: 12,
    },
    topicItem: {
        backgroundColor: '#dbeafe',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    topicText: {
        color: '#1e40af',
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    controlButton: {
        flex: 1,
        borderRadius: 12,
    },
    controlButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
    },
    messagesSection: {
        marginBottom: 3,
    },
    messagesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#166534',
        marginBottom: 12,
    },
    messagesContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#dcfce7',
        minHeight: 256,
    },
    messagesScrollView: {
        padding: 16,
        maxHeight: 320,
    },
    noMessagesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    noMessagesIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    noMessagesText: {
        color: '#6b7280',
        textAlign: 'center',
        fontSize: 16,
    },
    noMessagesSubtext: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 8,
    },
    messageCard: {
        backgroundColor: '#f0fdf4',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4ade80',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    messageTopicText: {
        fontWeight: 'bold',
        color: '#166534',
        fontSize: 14,
    },
    messageContentContainer: {
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 6,
        marginTop: 4,
    },
    messageContentText: {
        color: '#374151',
        fontFamily: 'monospace',
        fontSize: 14,
    },
    messageTimestamp: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 8,
    },
    deviceGrid: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        gap: 12,
        marginTop: 16,
    },
    deviceRow: {
        flexDirection: 'row',
        gap: 12,
    },
    deviceRowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    deviceButton: {
        flex: 1,


        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    deviceButtonSingle: {
        flex: 1,
        maxWidth: 192,

        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    deviceButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',

        fontSize: 16,
    },
    backgroundCircle1: {
        position: 'absolute',
        top: 80,
        left: 40,
        width: 64,
        height: 64,
        backgroundColor: '#bbf7d0',
        borderRadius: 32,
        opacity: 0.2,
    },
    backgroundCircle2: {
        position: 'absolute',
        top: 240,
        right: 32,
        width: 48,
        height: 48,
        backgroundColor: '#6ee7b7',
        borderRadius: 24,
        opacity: 0.15,
    },
    backgroundCircle3: {
        position: 'absolute',
        bottom: 160,
        left: 24,
        width: 80,
        height: 80,
        backgroundColor: '#dcfce7',
        borderRadius: 40,
        opacity: 0.25,
    },
});