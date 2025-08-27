import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Copy, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react';

export default function ReferenciaPagamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos em segundos
  const [copied, setCopied] = useState(false);

  const valor = params.valor || '5.000';
  const entidade = '334';
  const referencia = '334791';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyReference = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = () => {
    router.push('/(tabs)/carteira');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referência de Pagamento</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.valueSection}>
          <Text style={styles.valueLabel}>Valor</Text>
          <Text style={styles.valueAmount}>KZ {valor}</Text>
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
          <Text style={styles.entityNumber}>{entidade}</Text>
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
          <Text style={styles.referenceNumber}>{referencia}</Text>
        </View>

        <View style={styles.timerSection}>
          <View style={styles.timerCard}>
            <Clock size={20} color="#FFC107" />
            <Text style={styles.timerText}>
              Tempo restante: {formatTime(timeLeft)}
            </Text>
          </View>
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
    paddingVertical: 4,
    paddingTop: 40,
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
  timerSection: {
    marginBottom: 24,
  },
  timerCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#856404',
    marginLeft: 8,
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
});