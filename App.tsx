import React, {useRef, useState} from 'react';
import {View, Button, StyleSheet, ScrollView, Text} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

const App: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', data);

      // Add the message to the state
      setMessages(prevMessages => [
        ...prevMessages,
        `Received from WebView: ${data.payload}`,
      ]);
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  // Function to send a message to the WebView
  const sendMessageToWebView = () => {
    const message = JSON.stringify({
      type: 'GREETING',
      payload: 'Hello from React Native!',
    });

    if (webViewRef.current) {
      webViewRef.current.postMessage(message);
      console.log('Message sent to WebView:', message);
      setMessages(prevMessages => [
        ...prevMessages,
        'Sent to WebView: Hello from React Native!',
      ]);
    } else {
      console.error('WebView reference is null. Message not sent.');
    }
  };

  return (
    <View style={styles.container}>
      {/* WebView Section */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <body>
                <h1>React Native WebView</h1>
                <button onclick="sendMessageToReactNative()">Send to React Native</button>
                <h2>Messages</h2>
                <ul id="messages"></ul> <!-- List to display all messages -->
                <script>
                  // Send message to React Native
                  function sendMessageToReactNative() {
                    const message = { type: 'FROM_WEBVIEW', payload: 'Hello From Webview!' };
                    window.ReactNativeWebView.postMessage(JSON.stringify(message));
                    
                    const messageList = document.getElementById('messages');
                    const newMessage = document.createElement('li');
                    newMessage.textContent = 'Sent to React Native: ' + message.payload;
                    messageList.appendChild(newMessage);
                  }

                  // Handle messages received from React Native
                  document.addEventListener('message', (event) => {
                    try {
                      const data = JSON.parse(event.data);
                      const messageList = document.getElementById('messages');
                      const newMessage = document.createElement('li');
                      newMessage.textContent = 'Received from React Native: ' + data.payload;
                      messageList.appendChild(newMessage);
                    } catch (error) {
                      console.error('Error parsing message from React Native:', error);
                    }
                  });
                </script>
              </body>
              </html>
            `,
          }}
          onMessage={onMessage}
          javaScriptEnabled
        />
      </View>

      {/* React Native UI Section */}
      <View style={styles.nativeContainer}>
        <Text style={styles.heading}>React Native Logs</Text>
        <ScrollView style={styles.messageList}>
          {messages.map((message, index) => (
            <Text key={index} style={styles.message}>
              {message}
            </Text>
          ))}
        </ScrollView>
        <Button title="Send to WebView" onPress={sendMessageToWebView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nativeContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageList: {
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginVertical: 5,
  },
});

export default App;
