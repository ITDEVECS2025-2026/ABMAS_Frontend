import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import { connect, MqttClient } from "mqtt";

class MQTTService extends EventEmitter {
    client: MqttClient | null = null;

    connect(brokerUrl: string, options = {}) {
        return new Promise<void>((resolve, reject) => {
            try {
                this.client = connect(brokerUrl, {
                    ...options,
                    reconnectPeriod: 1000,
                    clean: true
                })
                this.client.on("connect", () => {
                    this.emit("connected");
                    resolve();
                });

                this.client.on("error", (err) => {
                    this.emit("error", err);
                    reject(err);
                });

                this.client.on("message", (topic, payload) => {
                    this.emit("message", topic, payload.toString());
                });

                this.client.on("close", () => {
                    this.emit("disconnected");
                });
            } catch (error) {
                reject(error);
            }
        })
    }

    subscribe(topic: string) {
        this.client?.subscribe(topic, (err) => {
            if (err) {
                this.emit("error", err);
            } else {
                this.emit("subscribed", topic);
            }
        });
    }

    publish(topic: string, message: string) {
        this.client?.publish(topic, message, (err) => {
            if (err) {
                this.emit("error", err);
            } else {
                this.emit("published", topic, message);
            }
        });
    }

    disconnect() {
        this.client?.end();
        this.emit("disconnected");
    }
}

export default new MQTTService();