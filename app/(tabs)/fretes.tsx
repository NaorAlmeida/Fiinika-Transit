import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Menu, LucideMapPinned, ClipboardX, CircleAlert } from 'lucide-react-native';
import { API_BASE_URL, API_KEY } from '@/utils/constants';

export default function FretesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [fretes, setFretes] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    const fetchFretes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/frete/lista/30`, {
          method: 'GET',
          headers: {
            'Content-Type': ' application/x-www-form-urlencoded',
            Authorization: `${API_KEY}`,
          },
        });
        const data = await response.json();

        setFretes(data.lista || []);
      } catch (error) {
        setHasError(true);
        console.error('Erro ao buscar fretes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFretes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return '#28A745';
      case 'Processado':
        return '#FFC107';
      case 'Confirmado':
        return '#17A2B8';
      default:
        return '#6C757D';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Fretes</Text>
      </View>

      <View style={styles.content}>
        <ScrollView
          style={styles.fretesList}
          showsVerticalScrollIndicator={false}
        >
          {fretes.map((frete) => (
            <TouchableOpacity
              key={frete.codigo}
              style={styles.freteCard}
              onPress={() =>
                router.push(`/(tabs)/detalhes-frete?id=${frete.id}`)
              }
            >
              <View style={styles.cardHeader}>
                <LucideMapPinned size={20} color="#1E579C" />
                <Text style={styles.cardTitle}>ROTA</Text>
              </View>

              <Text style={styles.routeText}>
                {frete.origem} → {frete.destino}
              </Text>

              <Text style={styles.dateText}>{formatDate(frete.dataCriacao)}</Text>

              <View style={styles.bottomRow}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(frete.status)}15` },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(frete.estado) },
                    ]}
                  >
                    {frete.estado}
                  </Text>
                </View>

                <Text style={styles.costText}>{frete.valor}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {loading && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 160,
              }}
            >
              <ActivityIndicator size="large" color="#1E579C" />
              <Text style={{ color: '#666666', marginTop: 8 }}>
               A carregar...
              </Text>
            </View>
          )}

          {(!loading && fretes.length === 0 && !hasError) && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 160,
              }}
            >
              <ClipboardX size={60} strokeWidth={1} color="#99A1AF" />
              <Text style={{ color: '#666666', marginTop: 8 }}>
                Nenhum frete encontrado.
              </Text>
            </View>
          )}

          {(!loading && fretes.length != 0 && hasError) && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 160,
              }}
            >
              <CircleAlert size={60} strokeWidth={1} color="#ff0000" />
              <Text style={{ color: '#666666', marginTop: 8 }}>
               Um erro ocorreu ao carregar os fretes.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  addButtonIcon: {
    color: '#1E579C',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fretesList: {
    flex: 1,
  },
  freteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: 'Barlow-Bold',
    color: '#1E579C',
    letterSpacing: 1,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Barlow_500Medium',
    color: '#333333',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Barlow-SemiBold',
  },
  costText: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    color: '#28A745',
  },
});
