export type MqttProps = {
  brokerUrl: string;
  topic: string;
};

export interface ReceivedMessage {
  topic: string;
  message: string;
  parsedMessage?: Record<string, any>; 
  timestamp: Date;
}