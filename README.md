# Welcome to ABMAS FRONTEND 👋

# Project Structure 📂 
 ```bash
app/
 ├── deviceOne/         # Page & layout for Device 1
 ├── deviceTwo/         # Page & layout for Device 2
 ├── deviceThree/       # Page & layout for Device 3
 ├── deviceFour/        # Page & layout for Device 4
 ├── deviceFive/        # Page & layout for Device 5
 ├── Home.tsx           # Dashboard utama (status MQTT + chart + navigation)
 ├── _layout.tsx        # Root layout (routing)
components/
 ├── form/              # Reusable form components
 └── ui/                # UI primitives (button, text, spinner, stack, provider)
constants/
 └── Colors.ts          # Global color constants
hooks/                  # Custom hooks (e.g. useMQTT)
interfaces/             # TypeScript interfaces (IForm, Device, etc.)
lib/
 └── mqtt.ts            # MQTTService (connect, publish, subscribe, events)
styles/
 └── global.css         # NativeWind + Gluestack global styles
 ```

# Tech Stack ⚡
-  React Native (Expo) → Base framework
-  NativeWind → TailwindCSS for React Native
-  Gluestack UI → Scalable UI components & design system
-  MQTT.js → Realtime IoT communication
-  TypeScript → Strong typing & maintainability

# MQTT Integration 📡 
📍 MQTTService (lib/mqtt.ts)
Helper class for managing MQTT connection via WebSocket.

 ## Methods
 connect(brokerUrl: string, options?: object) → Connect to broker
 subscribe(topic: string) → Subscribe to topic
 publish(topic: string, message: string) → Publish message
 disconnect() → Disconnect client


 ## Events
 connected → Triggered on successful connection
 message → Triggered when receiving payload
 disconnected → Triggered on disconnect
 error → Triggered on error

 ## Example Usage
 ```bash
 import MQTTService from "@/lib/mqtt";

 useEffect(() => {
   MQTTService.connect("wss://broker.emqx.io:8084/mqtt")
    .then(() => MQTTService.subscribe("farm/device1/temp"));

   MQTTService.on("message", (topic, msg) => {
     console.log("Message:", topic, msg);
   })
 ;

   return () => MQTTService.disconnect();
 }, []);
 ```

# UI Components 🖼️
📍 Form Components (components/form)
Form.tsx → Wrapper untuk form handling
FormField.tsx → Input field
FormLabel.tsx → Input label
FormMessage.tsx → Error / helper text

📍 UI Primitives (components/ui)
button/ → Custom Button (NativeWind + Gluestack)
text/ → Typography system
spinner/ → Loading indicator
vstack/ → Vertical stack layout
gluestack-ui-provider/ → Theme provider
 fyi : you can add another Component using command :
       - npx gluestack-ui add <Components>
# Pages 🏠
📍 Home.tsx
Shows MQTT status (Online / Offline)
Displays charts (soil moisture, pH, temperature, etc.)
5 navigation buttons → Device 1–5

📍 Device Pages
deviceOne/index.tsx … deviceFive/index.tsx
Each page displays sensor data detail for corresponding device

# Get started
1. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the app

   ```bash
   npx expo start -c --tunnel 
   ```
   (to clear cache and available connect to expo app)
   
4. Build APK (for Android)
    ```bash
   eas build -p android --profile preview
    ```

# Author 👨‍💻
Built with ❤️ by Jordan Arya Leksana (ITS)
