import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Aguardar o root navigator estar pronto antes de navegar
    if (rootNavigationState?.key) {
      router.replace('/login');
    }
  }, [rootNavigationState?.key]);

  return null;
}