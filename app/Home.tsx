import { View, Text, ScrollView, TextInput } from "react-native";
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
import { useMqqtMessageAtom } from "@/store/atom";


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

export default function Home() {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [receivedMessages, setReceivedMessages] = useState<ReceivedMessage[]>([]);
    const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);

    const methods = useForm<MqttProps>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            brokerUrl: "mqtt://broker.emqx.io:1883",
            topic: "/ecs/abmas/0/data",
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
            console.log("Message received:", data.topic, data.message);
            const newMessage: ReceivedMessage = {
                topic: data.topic,
                message: data.message,
                timestamp: new Date(),
            };
            setReceivedMessages(prev => [newMessage, ...prev].slice(0, 50)); 
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

        // Cleanup
        return () => {
            mqtt.removeAllListeners("connected");
            mqtt.removeAllListeners("disconnected");
            mqtt.removeAllListeners("error");
            mqtt.removeAllListeners("message");
            mqtt.removeAllListeners("subscribed");
            mqtt.removeAllListeners("unsubscribed");
        };
    }, []);
    const onMessage = (data: {message: string, topic: string}) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(data.message);
        } catch (e) {
            parsedMessage = { raw: data.message };
        }

        const newMessage: ReceivedMessage ={
            topic: data.topic,
            message: data.message,
            parsedMessage: parsedMessage,
            timestamp: new Date(),
        }

        useMqqtMessageAtom((prev: ReceivedMessage[]) => [newMessage, ...prev].slice(0, 50));
    }
    const handleConnect = (data: MqttProps) => {
        if (!isConnected) {
            setConnectionStatus("Connecting...");

            const brokerUrl = useNormalizedURL(data.brokerUrl);

            mqtt.connect(brokerUrl, {
                clientId: "rn-client-" + Math.random().toString(16).substr(2, 8),
                protocolId: "MQTT",
                protocolVersion: 4,
                clean: true,
            })
                .then(() => {
                    setIsConnected(true);
                    setConnectionStatus("Connected");
                    mqtt.subscribe(data.topic);
                })
                .catch((err: Error) => {
                    console.log("Failed to connect to MQTT broker", err);
                    setIsConnected(false);
                    setConnectionStatus(`Connection Failed: ${err.message}`);

                    methods.setError("brokerUrl", {
                        type: "manual",
                        message: `Gagal terhubung: ${err.message}`,
                    });
                });
        } else {
            mqtt.disconnect();
            setIsConnected(false);
            setConnectionStatus("Disconnected");
            setReceivedMessages([]);
            console.log("Disconnected from MQTT broker");
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
        <View className="flex-1 bg-slate-100 p-4">
            <Text className="text-2xl font-bold text-center mb-4">ABMAS</Text>

            <Text className="text-lg font-bold mb-2">Status: {connectionStatus}</Text>

            <Form<MqttProps> methods={methods}>
                <FormLabel>Broker URL</FormLabel>
                <FormField
                    name="brokerUrl"
                    render={({ value, onChange, onBlur }) => (
                        <TextInput
                            placeholder="mqtt://broker.emqtr.io:1883"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            className="mb-2 w-full"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                            editable={!isConnected}
                        />
                    )}
                />
                <FormMessage name="brokerUrl" />

                <FormLabel>Topic</FormLabel>
                <FormField
                    name="topic"
                    render={({ value, onChange, onBlur }) => (
                        <TextInput
                            placeholder="/ecs/abmas/i/data"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            className="mb-2 w-full"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isConnected}
                        />
                    )}
                />
                <FormMessage name="topic" />

                <Button
                    onPress={methods.handleSubmit(handleConnect)}
                    className="mb-4 w-full"
                    disabled={methods.formState.isSubmitting}
                >
                    <ButtonText>
                        {methods.formState.isSubmitting ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
                    </ButtonText>
                </Button>
            </Form>

            {isConnected && (
                <View className="mb-4">
                    <Text className="text-lg font-bold mb-2">Subscribed Topics:</Text>
                    {subscribedTopics.map(topic => (
                        <Text key={topic} className="bg-blue-100 p-2 rounded mb-1">{topic}</Text>
                    ))}

                    <Button onPress={handlePublish} className="mb-2 w-full">
                        <ButtonText>Publish Test Message</ButtonText>
                    </Button>

                    <Button onPress={clearMessages} className="w-full" variant="outline">
                        <ButtonText>Clear Messages</ButtonText>
                    </Button>
                </View>
            )}

            <Text className="text-lg font-bold mb-2">Received Messages:</Text>
            <ScrollView className="flex-1 bg-white rounded p-2">
                {receivedMessages.length === 0 ? (
                    <Text className="text-gray-500">No messages received yet</Text>
                ) : (
                    receivedMessages.map((msg, index) => (
                        <View key={index} className="border-b border-gray-200 py-2">
                            <Text className="font-bold">{msg.topic}</Text>
                            <Text>{msg.message}</Text>
                            <Text className="text-xs text-gray-500">
                                {msg.timestamp.toLocaleTimeString()}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <Button disabled={!isConnected} onPress={() => router.push("/(deviceOne)")} className="mt-4 w-full">
               {
                isConnected ? (
                    <ButtonText>Go to First Device</ButtonText>
                ) : (
                    <ButtonText>Connect to access First Device</ButtonText>
                )
               } 
            </Button>
            <Button disabled={!isConnected} onPress={() => router.push("/(deviceTwo)")} className="mt-4 w-full">
               {isConnected ? (
                <ButtonText>Go to Second Device</ButtonText>
               ) : (
                <ButtonText>Connect to access Second Device</ButtonText>
               )}
            </Button>
            <Button disabled={!isConnected} onPress={() => router.push("/(deviceThree)")} className="mt-4 w-full">
                {isConnected ? (
                    <ButtonText>Go to Third Device</ButtonText>
                ) : (
                    <ButtonText>Connect to access Third Device</ButtonText>
                )}
            </Button>
            <Button disabled={!isConnected} onPress={() => router.push("/(deviceFour)")} className="mt-4 w-full">
                {isConnected ? (
                    <ButtonText>Go to Fourth Device</ButtonText>
                ) : (
                    <ButtonText>Connect to access Fourth Device</ButtonText>
                )}
            </Button>
            <Button disabled={!isConnected} onPress={() => router.push("/(deviceFive)")} className="mt-4 w-full">
                {isConnected ? (
                    <ButtonText>Go to Fifth Device</ButtonText>
                ) : (
                    <ButtonText>Connect to access Fifth Device</ButtonText>
                )}
            </Button>
        </View>
    );
}

