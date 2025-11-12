// Lokasi: app/(tabs)/abmas/_layout.tsx
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { useSetAtom } from "jotai";
import mqtt from "@/lib/mqtt";
import parsedPayload from "@/utils/parsedPayload";
import { ReceivedMessage } from "@/interfaces/IMqtt";

// Import atom yang ada dan yang baru
import {
  mqqtMessageAtom,
  mqttIsConnectedAtom,
  mqttConnectionStatusAtom,
  mqttSubscribedTopicsAtom,
} from "@/store/atom"; // <-- Sesuaikan path jika perlu

export default function MqttLayout() {
  // Gunakan useSetAtom untuk *memperbarui* state global
  const setIsConnected = useSetAtom(mqttIsConnectedAtom);
  const setConnectionStatus = useSetAtom(mqttConnectionStatusAtom);
  const setSubscribedTopics = useSetAtom(mqttSubscribedTopicsAtom);
  const setReceivedMessages = useSetAtom(mqqtMessageAtom);

  // Ini adalah useEffect yang kita pindahkan dari index.tsx
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
        message:
          typeof parsedData === "string"
            ? parsedData
            : JSON.stringify(parsedData),
        timestamp: new Date(),
      };
      // Cukup panggil setReceivedMessages satu kali
      setReceivedMessages((prev) => [newMessage, ...prev].slice(0, 50));
    };

    const onSubscribed = (topic: string) => {
      setSubscribedTopics((prev) => [...prev, topic]);
      console.log("Subscribed to:", topic);
    };

    const onUnsubscribed = (topic: string) => {
      setSubscribedTopics((prev) => prev.filter((t) => t !== topic));
      console.log("Unsubscribed from:", topic);
    };

    // Daftarkan semua listener
    mqtt.addListener("connected", onConnected);
    mqtt.addListener("disconnected", onDisconnected);
    mqtt.addListener("error", onError);
    mqtt.addListener("message", onMessage);
    mqtt.addListener("subscribed", onSubscribed);
    mqtt.addListener("unsubscribed", onUnsubscribed);

    // Cleanup listeners saat layout di-unmount
    return () => {
      mqtt.removeAllListeners("connected");
      mqtt.removeAllListeners("disconnected");
      mqtt.removeAllListeners("error");
      mqtt.removeAllListeners("message");
      mqtt.removeAllListeners("subscribed");
      mqtt.removeAllListeners("unsubscribed");
    };
    
    // Dependensi kosong agar hanya berjalan sekali saat layout mount
  }, [setIsConnected, setConnectionStatus, setSubscribedTopics, setReceivedMessages]);

  // Render halaman index (index.tsx)
  return <Slot />;
}