import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard,
  Info
} from 'lucide-react-native';

export default function CarregarContaScreen() {
  const router = useRouter();
  const [valor, setValor] = useState('');
  const [showResumo, setShowResumo] = useState(false);

  const encargos = 150;
  const valorNumerico = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const totalPagar = valorNumerico + encargos;

  const formatarMoeda = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue === '') return '';
    
    // Converte para número e formata
    const number = parseInt(numericValue) / 100;
    return number.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const handleValorChange = (text: string) => {
    const formatted = formatarMoeda(text);
    setValor(formatted);
    setShowResumo(formatted !== '' && parseFloat(formatted.replace(/[^\d,]/g, '').replace(',', '.')) > 0);
  };

  const handlePagar = () => {
    if (valorNumerico <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    router.push({
      pathname: '/(tabs)/referencia-pagamento',
      params: { valor: valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E579C" />
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
                value={valor}
                onChangeText={handleValorChange}
                keyboardType="numeric"
                placeholderTextColor="#999999"
              />
              <Text style={styles.currencyLabel}>KZ</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info size={16} color="#1E579C" />
              <Text style={styles.infoTitle}>Informações importantes</Text>
            </View>
            <Text style={styles.infoText}>
              • Valor mínimo para carregamento: 1.000 KZ{'\n'}
              • Valor máximo por transação: 500.000 KZ{'\n'}
              • Encargos bancários aplicáveis: 150 KZ{'\n'}
              • Processamento instantâneo
            </Text>
          </View>
        </View>

        {showResumo && (
          <View style={styles.resumoSection}>
            <Text style={styles.resumoTitle}>Resumo</Text>
            
            <View style={styles.resumoCard}>
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Valor a carregar na conta</Text>
                <Text style={styles.resumoValue}>
                  KZ {valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              
              <View style={styles.resumoDivider} />
              
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabel}>Encargos bancários</Text>
                <Text style={styles.resumoValue}>
                  KZ {encargos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
              
              <View style={styles.resumoDivider} />
              
              <View style={styles.resumoItem}>
                <Text style={styles.resumoLabelTotal}>Total a pagar</Text>
                <Text style={styles.resumoValueTotal}>
                  KZ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.pagarButton}
              onPress={handlePagar}
            >
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.pagarButtonText}>Pagar</Text>
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
    fontFamily: 'Barlow-SemiBold',
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
    paddingVertical: 16,
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
  infoCard: {
    backgroundColor: '#F0F4F8',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E579C',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#1E579C',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    lineHeight: 18,
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