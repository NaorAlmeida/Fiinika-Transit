import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  Menu,
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  CreditCard,
  BookText,
  Building,
  Pencil,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL, API_KEY } from '@/utils/constants';

export default function PerfilScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/cliente/dados-perfil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `${API_KEY}`,
        },
      });
      const data = await response.json();
      setProfileData(data.info || {});
    } catch (error) {
      setHasError(true);
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>

            {profileData.fotoPerfil ? (
              <Image
                source={{ uri: `${API_BASE_URL}/uploads/clientes/${profileData.fotoPerfil}` }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <User size={40} color="#1E579C" />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{profileData.nome}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  profileData.estado === 'Activo' ? '#28A74515' : '#DC354515',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    profileData.estado === 'Autorizado' ? '#28A745' : '#DC3545',
                },
              ]}
            >
              {profileData.estado}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Mail size={20} color="#1E579C" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <BookText size={20} color="#1E579C" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>NIF</Text>
              <Text style={styles.infoValue}>{profileData.nif}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Phone size={20} color="#1E579C" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Telemóvel</Text>
              <Text style={styles.infoValue}>{profileData.telefone}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <MapPin size={20} color="#1E579C" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{profileData.endereco}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Building size={20} color="#1E579C" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Província</Text>
              <Text style={styles.infoValue}>{profileData.provincia}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Nº de Fretes</Text>
            <Text style={styles.statValue}>{profileData.numeroFretes}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Gasto</Text>
            {/* <Text style={styles.statValue}>
              {profileData.saldoDisponivel.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}{' '}
              KZ
            </Text> */}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/(tabs)/editar-perfil')}
          >
            <Pencil size={20} color="#1A5785" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.validationButton}
            onPress={() => router.push('/(tabs)/cartao')}
          >
            <CreditCard size={20} color="#FFFFFF" />
            <Text style={styles.validationButtonText}>Cartão de Validação</Text>
          </TouchableOpacity>
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
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1E579C',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E579C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Barlow-Bold',
    color: '#333333',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 52,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Barlow-Bold',
    color: '#28A745',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1A5785',
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#1A5785',
    marginLeft: 8,
  },
  validationButton: {
    backgroundColor: '#1A5785',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
