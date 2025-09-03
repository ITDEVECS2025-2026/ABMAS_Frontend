import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import mqtt, { MqttClient, IClientOptions } from "mqtt";

// Define interface untuk MQTTService
interface MQTTService extends EventEmitter {
  connect(brokerUrl: string, options?: IClientOptions): Promise<void>;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, message: string): void;
  disconnect(): void;
  isConnected(): boolean;
  getSubscribedTopics(): string[];
}

class MQTTServiceImpl extends EventEmitter implements MQTTService {
  private client: MqttClient | null = null;
  private subscribedTopics: Set<string> = new Set();
  private isConnecting: boolean = false;
  private connectionTimeoutRef: ReturnType<typeof setTimeout> | null = null;

  connect(brokerUrl: string, options: IClientOptions = {}): Promise<void> {
    if (this.isConnecting) {
      return Promise.reject(new Error("Already trying to connect"));
    }
    
    if (this.isConnected()) {
      return Promise.resolve();
    }

    this.isConnecting = true;
    
    return new Promise((resolve, reject) => {
      try {
        console.log("Connecting to MQTT broker:", brokerUrl);
        
        // Setup timeout untuk koneksi
        this.connectionTimeoutRef = setTimeout(() => {
          this.isConnecting = false;
          this.cleanupClient();
          reject(new Error("Connection timeout after 15 seconds"));
        }, 15000);

        this.client = mqtt.connect(brokerUrl, {
          ...options,
          reconnectPeriod: 0, // Nonaktifkan reconnect otomatis
          connectTimeout: 10000, // Timeout koneksi 10 detik
          clean: true,
        });

        this.client.on("connect", () => {
          console.log("MQTT Connected successfully");
          this.isConnecting = false;
          if (this.connectionTimeoutRef) {
            clearTimeout(this.connectionTimeoutRef);
            this.connectionTimeoutRef = null;
          }
          this.emit("connected");
          resolve();
        });

        this.client.on("error", (err: Error) => {
          console.log("MQTT Connection error:", err);
          this.isConnecting = false;
          if (this.connectionTimeoutRef) {
            clearTimeout(this.connectionTimeoutRef);
            this.connectionTimeoutRef = null;
          }
          this.cleanupClient();
          this.emit("error", err);
          reject(err);
        });

        this.client.on("message", (topic: string, payload: Buffer) => {
          const message = payload.toString();
          console.log("Received message on topic:", topic, "message:", message);
          this.emit("message", { topic, message });
        });

        this.client.on("close", () => {
          console.log("MQTT Connection closed");
          this.isConnecting = false;
          this.emit("disconnected");
        });

        this.client.on("offline", () => {
          console.log("MQTT Client offline");
          this.isConnecting = false;
          this.emit("disconnected");
        });

      } catch (error) {
        this.isConnecting = false;
        if (this.connectionTimeoutRef) {
          clearTimeout(this.connectionTimeoutRef);
          this.connectionTimeoutRef = null;
        }
        console.log("MQTT Connection exception:", error);
        reject(error);
      }
    });
  }

  private cleanupClient(): void {
    if (this.client) {
      this.client.removeAllListeners();
      this.client.end(true, () => {
        console.log("MQTT client cleaned up");
      });
      this.client = null;
    }
    this.subscribedTopics.clear();
  }

  subscribe(topic: string): void {
    if (!this.client || !this.client.connected) {
      console.log("Cannot subscribe - not connected to MQTT broker");
      this.emit("error", new Error("Not connected to MQTT broker"));
      return;
    }
    
    if (this.subscribedTopics.has(topic)) {
      console.log("Already subscribed to topic:", topic);
      return;
    }
    
    this.client.subscribe(topic, (err: Error | null) => {
      if (err) {
        console.log("Subscribe error:", err);
        this.emit("error", err);
      } else {
        console.log("Subscribed to topic:", topic);
        this.subscribedTopics.add(topic);
        this.emit("subscribed", topic);
      }
    });
  }

  unsubscribe(topic: string): void {
    if (!this.client || !this.client.connected) {
      console.log("Cannot unsubscribe - not connected to MQTT broker");
      return;
    }
    
    this.client.unsubscribe(topic, (err?: Error) => {
      if (err) {
        console.log("Unsubscribe error:", err);
        this.emit("error", err);
      } else {
        console.log("Unsubscribed from topic:", topic);
        this.subscribedTopics.delete(topic);
        this.emit("unsubscribed", topic);
      }
    });
  }

  publish(topic: string, message: string): void {
    if (!this.client || !this.client.connected) {
      console.log("Cannot publish - not connected to MQTT broker");
      this.emit("error", new Error("Not connected to MQTT broker"));
      return;
    }
    
    this.client.publish(topic, message, { qos: 0, retain: false }, (err?: Error) => {
      if (err) {
        console.log("Publish error:", err);
        this.emit("error", err);
      } else {
        console.log("Published to topic:", topic, "message:", message);
        this.emit("published", { topic, message });
      }
    });
  }

  disconnect(): void {
    this.isConnecting = false;
    if (this.connectionTimeoutRef) {
      clearTimeout(this.connectionTimeoutRef);
      this.connectionTimeoutRef = null;
    }
    this.cleanupClient();
    this.emit("disconnected");
  }

  isConnected(): boolean {
    return this.client !== null && this.client.connected;
  }

  getSubscribedTopics(): string[] {
    return Array.from(this.subscribedTopics);
  }
}


const mqttService: MQTTService = new MQTTServiceImpl();
export default mqttService;