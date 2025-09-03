
export function useNormalizedURL(url: string): string {
    if (url.startsWith("mqtt://")){
        return "ws://" + url.replace("mqtt://", "").replace(":1883", ":8083") + "/mqtt";
    }
    if (url.startsWith("tcp://")){
        return "ws://" + url.replace("tcp://", "").replace(":1883", ":8083") + "/mqtt";
    }
    return url;
}