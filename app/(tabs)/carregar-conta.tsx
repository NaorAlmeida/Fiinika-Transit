import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
} from 'lucide-react-native';
import { API_BASE_URL, API_KEY } from '@/utils/constants';

export default function CarregarContaScreen() {
  const router = useRouter();
  const [showResume, setShowResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [montante, setMontante] = useState("");
  const [montanteInt, setMontanteInt] = useState(0);

  const encargos = 150;
  const numericValue = parseFloat(montante.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const totalPay = numericValue + encargos;

  const formatCurrency = (value: string): string => {
    // Pega só os dígitos
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      setMontanteInt(0);
      return "";
    }

    const intValue = parseInt(numericValue, 10);
    setMontanteInt(intValue);

    const number = intValue / 100;

    return number.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValueChange = (text: string) => {
    const formatted = formatCurrency(text);
    setMontante(formatted);
    setShowResume(formatted !== "");
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/cliente/carteira/carregar/referencia-multicaixa`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: API_KEY,
          },
          body: `montante=${encodeURIComponent(totalPay)}`,
        }
      );

      const data = await response.json();

      if (!response.ok || data.tipo !== "Sucesso") {
        throw new Error(data.message || "Erro ao carregar a conta");
      }

      router.push({
        pathname: "/(tabs)/referencia-pagamento",
        params: {
          valor: totalPay,
          entidade: data.info.entidade,
          referencia: data.info.referenca,
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Um erro ocorreu ao carregar a conta. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carregar Conta</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Indique o valor que deseja carregar na conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Valor a carregar *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="0,00"
                value={montante}
                onChangeText={handleValueChange}
                keyboardType="numeric"
                placeholderTextColor="#999999"
              />
              <Text style={styles.currencyLabel}>KZ</Text>
            </View>
          </View>
        </View>

        {showResume && (
          <View style={styles.resumoSection}>
            <Text style={styles.resumoTitle}>Resumo</Text>

            <View style={styles.resumoCard}>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Valor a carregar na conta</Text>
                <Text style={styles.resumoValue}>
                  KZ {numericValue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                </Text>
              </View>

              <View style={styles.resumoDivider} />

              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Encargos bancários</Text>
                <Text style={styles.resumoValue}>
                  KZ {encargos.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                </Text>
              </View>

              <View style={styles.resumoDivider} />

              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabelTotal}>Total a pagar</Text>
                <Text style={styles.resumoValueTotal}>
                  KZ {totalPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.pagarButton}
              onPress={handlePay}
              disabled={loading}
            >
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.pagarButtonText}>{loading ? 'Aguarde...' : 'Pagar'}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  backButton: {
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
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-medium',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: '#1E579C',
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Barlow-Bold',
    color: '#333333',
    marginLeft: 12,
    textAlign: 'right',
  },
  currencyLabel: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#1E579C',
    marginLeft: 8,
  },
  resumoSection: {
    marginBottom: 32,
  },
  resumoTitle: {
    fontSize: 20,
    fontFamily: 'Barlow-Bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  resumoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resumoLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    flex: 1,
  },
  resumoValue: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    textAlign: 'right',
  },
  resumoLabelTotal: {
    fontSize: 16,
    fontFamily: 'Barlow-Bold',
    color: '#333333',
    flex: 1,
  },
  resumoValueTotal: {
    fontSize: 20,
    fontFamily: 'Barlow-Bold',
    color: '#28A745',
    textAlign: 'right',
  },
  resumoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  pagarButton: {
    backgroundColor: '#1A5785',
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagarButtonText: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});