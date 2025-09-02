import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { API_BASE_URL, API_KEY } from '@/utils/constants';

export default function RootLayout() {
  useFrameworkReady();

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/verifica-sessao`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `${API_KEY}`,
          },
        });
        const data = await response.json();

        setIsLogged(data.hasUserAuth === 'YES');
      } catch (error) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 120,
        }}
      >
        <ActivityIndicator size="large" color="#1E579C" />
        <Text style={{ color: '#666666', marginTop: 8 }}>A carregar...</Text>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      </View>
    );
  }

  if (hasError || !isLogged) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
    </>
  );
}
