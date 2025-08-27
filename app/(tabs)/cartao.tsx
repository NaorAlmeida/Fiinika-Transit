import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Hash, Phone, MapPin, QrCode } from 'lucide-react-native';

export default function CartaoScreen() {
  const router = useRouter();

  const userData = {
    nome: 'João Silva',
    numeroId: '123456789',
    telemovel: '+244 999 999 999',
    endereco: 'Rua das Flores, 123, Luanda'
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cartão de Validação</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>FIINIKA TRANSIT</Text>
              <Text style={styles.cardSubtitle}>Cartão de Validação</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.userInfo}>
                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <User size={18} color="#1E579C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nome</Text>
                    <Text style={styles.infoValue}>{userData.nome}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Hash size={18} color="#1E579C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Nº de ID</Text>
                    <Text style={styles.infoValue}>{userData.numeroId}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Phone size={18} color="#1E579C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Telemóvel</Text>
                    <Text style={styles.infoValue}>{userData.telemovel}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <MapPin size={18} color="#1E579C" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>{userData.endereco}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.qrSection}>
                <View style={styles.qrContainer}>
                  <QrCode size={80} color="#1E579C" />
                </View>
                <Text style={styles.qrText}>Código de Validação</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.validUntil}>Válido até: 31/12/2024</Text>
              <Text style={styles.cardNumber}>Card #FT-{userData.numeroId}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>Baixar Cartão</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Como usar o cartão</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Apresente este cartão aos transportadores para validação
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              O QR code contém suas informações de identificação
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Mantenha o cartão sempre atualizado com suas informações
            </Text>
          </View>
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
  cardContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Barlow-Bold',
    color: '#1E579C',
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
  },
  qrSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  qrContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  qrText: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  validUntil: {
    fontSize: 10,
    fontFamily: 'Barlow-Regular',
    color: '#999999',
  },
  cardNumber: {
    fontSize: 10,
    fontFamily: 'Barlow-Medium',
    color: '#1E579C',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#1A5785',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A5785',
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#1A5785',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
});