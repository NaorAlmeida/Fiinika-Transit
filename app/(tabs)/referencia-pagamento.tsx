import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Clipboard from "expo-clipboard";
import { Clock, Copy, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useBalance } from '@/context/balanceContext';
import { formatCurrency } from '@/utils/helpers';

interface PaymentData {
  valor: string;
  entidade: string;
  referencia: string;
}

export default function ReferenciaPagamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [finalBalance, setFinalBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const { balance, setBalance } = useBalance();
  const [showPopup, setShowPopup] = useState(false);

  const paymentData: Partial<PaymentData> = {
    valor: typeof params.valor === "string" ? params.valor : undefined,
    entidade: typeof params.entidade === "string" ? params.entidade : undefined,
    referencia: typeof params.referencia === "string" ? params.referencia : undefined,
  };

  if (!paymentData.valor || !paymentData.entidade || !paymentData.referencia) {
    router.push('/(tabs)');
    return null;
  }

  const handleCopyReference = async () => {
    if (paymentData.referencia) {
      await Clipboard.setStringAsync(paymentData.referencia);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  function formatCurrency(value: string | number): string {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) return "KZ 0,00";

    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    }).format(numericValue);
  }

const handleFinalize = async () => {
  try {
    const desconto = 150;
    const final = Number(paymentData.valor) - desconto;

    const newBalance = balance + final;
    setFinalBalance(final); 
    setBalance(newBalance);
    setShowPopup(true);

    console.log(`Novo saldo: ${formatCurrency(newBalance)}`, balance, paymentData.valor);

    setTimeout(() => {
      setShowPopup(false);
      router.push('/(tabs)');
    }, 2000);
  } catch (e) {
    console.error("Erro ao salvar", e);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Referência de Pagamento</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.valueSection}>
          <Text style={styles.valueLabel}>Valor</Text>
          <Text style={styles.valueAmount}>{formatCurrency(paymentData.valor)}</Text>
        </View>

        <View style={styles.entitySection}>
          <Text style={styles.sectionLabel}>Entidade</Text>
          <View style={styles.warningCard}>
            <Clock size={16} color="#856404" />
            <Text style={styles.warningText}>
              Espere por 5 minutos antes de realizar o pagamento para que referência
              reflita no sistema da EMIS.
            </Text>
          </View>
          <Text style={styles.entityNumber}>{paymentData.entidade}</Text>
        </View>

        <View style={styles.referenceSection}>
          <View style={styles.referenceHeader}>
            <Text style={styles.sectionLabel}>Referência</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyReference}
            >
              {copied ? (
                <CheckCircle size={16} color="#28A745" />
              ) : (
                <Copy size={16} color="#8FAFC0" />
              )}
              <Text style={[styles.copyText, copied && styles.copiedText]}>
                {copied ? 'Copiado!' : 'Copiar'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.referenceNumber}>{paymentData.referencia}</Text>
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Instruções de carregamento</Text>

          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Dirija-se a um Multicaixa ou Internet Banking
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Escolha pagamentos por referência
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Insira a entidade e a sua referência
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>4</Text>
              </View>
              <Text style={styles.instructionText}>
                Indique o valor que pretende carregar
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>5</Text>
              </View>
              <Text style={styles.instructionText}>
                O seu carregamento será processado imediatamente
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={handleFinalize}
        >
          <Text style={styles.finalizeButtonText}>Finalizar (já paguei)</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showPopup} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <CheckCircle size={100} color="#fff" fill="#4BB543" />
            <Text style={styles.popupTitle}>Pagamento concluído!</Text>
            <Text style={styles.popupText}> {formatCurrency(finalBalance)} adicionados na sua conta.</Text>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 16,
    paddingTop: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    color: '#000000',
    textAlign: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  valueSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 8,
  },
  valueAmount: {
    fontSize: 32,
    fontFamily: 'Barlow-Bold',
    color: '#000000',
  },
  entitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 12,
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  entityNumber: {
    fontSize: 48,
    fontFamily: 'Barlow-Bold',
    color: '#000000',
    textAlign: 'center',
  },
  referenceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  copyText: {
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
    color: '#8FAFC0',
    marginLeft: 4,
  },
  copiedText: {
    color: '#28A745',
  },
  referenceNumber: {
    fontSize: 48,
    fontFamily: 'Barlow-Bold',
    color: '#000000',
    textAlign: 'center',
  },
  instructionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E579C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,

  },
  instructionNumberText: {
    fontSize: 12,
    fontFamily: 'Barlow-Bold',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  finalizeButton: {
    backgroundColor: '#1A5785',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 32,
  },
  finalizeButtonText: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    color: '#FFFFFF',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 30,
    marginHorizontal: 20,
    height: 260,
    borderRadius: 12,
    alignItems: "center",
    shadowRadius: 6,
  },
  popupTitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  popupText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});