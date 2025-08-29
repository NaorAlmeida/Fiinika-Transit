import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Home, Truck, Wallet, User, LogOut } from 'lucide-react-native';
import { API_BASE_URL, API_KEY } from '@/utils/constants';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', route: '/(tabs)/', icon: Home },
    { name: 'Meus Fretes', route: '/(tabs)/fretes', icon: Truck },
    { name: 'Carteira', route: '/(tabs)/carteira', icon: Wallet },
    { name: 'Meu Perfil', route: '/(tabs)/perfil', icon: User },
  ];

  const handleLogout = async () => {
    try {
      fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: API_KEY,
        },
      });
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      throw new Error("Um erro ocorreu! Por favor, tente novamente.");
    }
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.appName}>Fiinika Transit</Text>
        <Text style={styles.appSubtitle}>Sistema de Transporte</Text>
      </View>

      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.drawerItem, isActive && styles.activeDrawerItem]}
              onPress={() => router.push(item.route as any)}
            >
              <IconComponent
                size={24}
                color={isActive ? '#FFFFFF' : '#1E579C'}
              />
              <Text
                style={[
                  styles.drawerItemText,
                  isActive && styles.activeDrawerItemText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
          <LogOut size={20} color="#666" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E579C',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: 'Barlow-SemiBold',
            fontSize: 18,
          },
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: 280,
          },
          headerLeft: () => null,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="fretes"
          options={{
            title: 'Meus Fretes',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="carteira"
          options={{
            title: 'Carteira',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="perfil"
          options={{
            title: 'Meu Perfil',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="novo-frete"
          options={{
            title: 'Novo Frete',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="editar-perfil"
          options={{
            title: 'Editar Perfil',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="cartao"
          options={{
            title: 'Cartão de Validação',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="detalhes-frete"
          options={{
            title: 'Detalhes do Frete',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="carregar-conta"
          options={{
            title: 'Carregar Conta',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="referencia-pagamento"
          options={{
            title: 'Referência de Pagamento',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Barlow-Bold',
    color: '#1E579C',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 0,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  activeDrawerItem: {
    backgroundColor: '#1E579C',
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    color: '#333333',
  },
  activeDrawerItemText: {
    color: '#FFFFFF',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 24,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    color: '#DC3545',
  },
});
