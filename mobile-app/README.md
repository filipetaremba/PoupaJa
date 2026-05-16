## Passos iniciais

# Aceder a pasta pelo promt de comando
cd mobile-app

# Intalar as dependencias necessarias
npx expo install react-dom react-native-web
npx create-expo-app@latest . --template blank-typescript

# Rodar programa
- npm run android
- npm run ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac
- npm run web