import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useBalance } from '@/context/balanceContext';
import { useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Menu, Eye, EyeOff, Plus, CreditCard } from 'lucide-react-native';
import { useState, useRef, useMemo, useEffect } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import { 
  useFonts, 
  Barlow_400Regular, 
  Barlow_500Medium, 
  Barlow_600SemiBold, 
  Barlow_700Bold 
} from '@expo-google-fonts/barlow';
import { formatCurrency } from '@/utils/helpers';


export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [fontsLoaded] = useFonts({
    'Barlow-Regular': Barlow_400Regular,
    'Barlow-Medium': Barlow_500Medium,
    'Barlow-SemiBold': Barlow_600SemiBold,
    'Barlow-Bold': Barlow_700Bold,
  });

  const { balance } = useBalance();  
  const [showBalance, setShowBalance] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de localização negada');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });
    })();
  }, []);



  const mapHtml =  location ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mapa</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        const coords = [${location.lat}, ${location.lng}];
        
        const map = L.map('map', {
          zoomControl: false,  
        }).setView(coords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        const marker = L.marker(coords).addTo(map);
        marker.bindPopup('Você está aqui').openPopup();

        map.scrollWheelZoom.disable();
        map.dragging.enable();
        map.doubleClickZoom.enable();
      </script>
    </body>
    </html>
  `: "";;

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu size={24} color="#1E579C" />
        </TouchableOpacity>
        <View style={styles.headerContent}> 
          <Text style={styles.headerTitle}>Fiinika Transit</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.balanceSection}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo em Carteira</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={20} color="#FFFFFF" /> : <EyeOff size={20} color="#FFFFFF" />}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceValue}>
            { showBalance ? `${formatCurrency(balance)}` : '•••••••'}
          </Text>
        </View>
      </View>

      {/* MAPA */}

      {(!location || !fontsLoaded) ? (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Obtendo localização...</Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
        <WebView
          source={{ html: mapHtml }}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scrollEnabled={false}
        />
      </View>
      )}

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Ações Rápidas</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryActionButton} onPress={() => router.push('/(tabs)/novo-frete')}>
              <Plus size={24} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Iniciar Pedido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton} onPress={() => router.push('/(tabs)/carregar-conta')}>
              <CreditCard size={24} color="#1A5785" />
              <Text style={styles.secondaryActionText}>Carregar Conta</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 12,
  },
  menuButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    color: '#000000',
  },
  headerSpacer: {
    width: 40,
  },
  balanceSection: {
    padding: 16,
    paddingBottom: 8,
  },
  balanceCard: {
    backgroundColor: '#1E579C',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  balanceValue: {
    fontSize: 28,
    fontFamily: 'Barlow-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: '#E5E5E5',
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: '#1A5785',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryActionText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A5785',
  },
  secondaryActionText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#1A5785',
    marginLeft: 8,
  },
});