import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Menu, Eye, EyeOff, ClipboardX } from 'lucide-react-native';
import { API_BASE_URL, API_KEY } from '@/utils/constants';

type Transaction = {
  id: string;
  tipo: string;
  valor: number;
  dataCriacao: string;
  referencia: string;
  estado: string;
};

export default function CarteiraScreen() {
  const navigation = useNavigation();
  const [showBalance, setShowBalance] = useState(true);
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);



  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/cliente/carteira/movimentos`, {
        method: 'GET',
        headers: {
          Authorization: `${API_KEY}`,
        },
      });
      const data = await response.json();
      setTransactionsData(data.lista || {});

      console.log(data);

    } catch (error) {
      setHasError(true);
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const totalReceitas = 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carteira</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo Atual</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <Eye size={20} color="#FFFFFF" />
              ) : (
                <EyeOff size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceValue}>
            {showBalance ? `${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} KZ` : '••••••'}
          </Text>
        </View>

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
          </View>

          {transactionsData.map((transaction: any) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionMethod}>
                  {transaction.metodo}
                </Text>
                <Text style={styles.transactionValue}>
                  {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} KZ
                </Text>
                <Text style={styles.transactionDate}>
                  {transaction.data}
                </Text>
                <Text style={styles.transactionReference}>
                  {transaction.referencia}
                </Text>
              </View>

              <View style={[
                styles.statusBadge,
                {
                  backgroundColor: transaction.estado === 'Pago'
                    ? '#28A74515'
                    : transaction.estado === 'Expirado'
                      ? '#DC354515'
                      : '#FFC10715'
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  {
                    color: transaction.estado === 'Pago'
                      ? '#28A745'
                      : transaction.estado === 'Expirado'
                        ? '#DC3545'
                        : '#FFC107'
                  }
                ]}>
                  {transaction.estado.toUpperCase()}
                </Text>
              </View>
            </View>
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

          {(!loading && transactionsData.length === 0 && !hasError) && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 100,
              }}
            >
              <ClipboardX size={60} strokeWidth={1} color="#99A1AF" />
              <Text style={{ color: '#666666', marginTop: 8 }}>
                Nenhuma transação encontrada.
              </Text>
            </View>
          )}

          {(!loading && transactionsData.length === 0 && hasError) && (
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
                Um erro ocorreu ao carregar os transactionsData.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#1E579C',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
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
    opacity: 0.8,
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: 'Barlow-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
  },
  transactionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#1E579C',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionMethod: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  transactionValue: {
    fontSize: 14,
    fontFamily: 'Barlow-Bold',
    color: '#28A745',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  transactionReference: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Barlow-SemiBold',
    textTransform: 'uppercase',
  },
});