import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Hash,
  Building,
  Camera,
  Save,
  CircleAlert
} from 'lucide-react-native';
import { API_BASE_URL, API_KEY } from '@/utils/constants';
import Toast from 'react-native-toast-message';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/cliente/dados-perfil`, {
          method: 'GET',
          headers: {
            'Content-Type': ' application/x-www-form-urlencoded',
            Authorization: `${API_KEY}`,
          },
        });
        const data = await response.json();

        setFormData(data.info || []);

        setLoading(false);

      } catch (error) {
        setHasError(true);
        console.error('Erro ao buscar dados do utilizador:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para escolher uma foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        fotoPerfil: result.assets[0]
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email || !formData.nif || !formData.telefone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("nome", formData.nome || "");
    form.append("email", formData.email || "");
    form.append("nif", formData.nif || "");
    form.append("telefone", formData.telefone || "");
    form.append("endereco", formData.endereco || "");
    form.append("provincia", formData.provincia || "");

    if (formData.fotoPerfil) {
      const uri = formData.fotoPerfil.uri;
      const extension = uri.split('.').pop();
      const mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      const filename = uri.split('/').pop() || `profile_${Date.now()}.${extension}`;

      form.append("fotoPerfil", {
        uri,
        name: filename,
        type: mimeType,
      } as any);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cliente/editar-perfil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${API_KEY}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!response.ok || data.tipo !== 'Sucesso') {
        throw new Error(data.msg || 'Erro ao atualizar perfil');
      }

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Dados atualizados com sucesso!',
      });

      router.replace('/(tabs)/perfil');
    } catch (error: any) {
      Alert.alert('Erro', error.message || "Falha ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const provincias = [
    'Luanda', 'Benguela', 'Huíla', 'Namibe', 'Cunene', 'Cuando Cubango',
    'Moxico', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Uíge', 'Zaire',
    'Cabinda', 'Kwanza Norte', 'Kwanza Sul', 'Bié', 'Huambo', 'Bengo'
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      {(!loading && !hasError) &&
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profilePhotoSection}>
            <View style={styles.avatarContainer}>
              {formData.fotoPerfil ? (
                <Image
                  source={{ uri: formData.fotoPerfil.uri }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <User size={40} color="#1E579C" />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoText}>Toque para alterar foto</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#1E579C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChangeText={(value) => handleInputChange('nome', value)}
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail *</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#1E579C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NIF *</Text>
              <View style={styles.inputContainer}>
                <Hash size={20} color="#1E579C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite seu NIF"
                  value={formData.nif}
                  onChangeText={(value) => handleInputChange('nif', value)}
                  keyboardType="numeric"
                  maxLength={9}
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telemóvel *</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#1E579C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="+244 999 999 999"
                  value={formData.telefone}
                  onChangeText={(value) => handleInputChange('telefone', value)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Localização</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#1E579C" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite seu endereço"
                  value={formData.endereco}
                  onChangeText={(value) => handleInputChange('endereco', value)}
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Província</Text>
              <View style={styles.inputContainer}>
                <Building size={20} color="#1E579C" />
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => {/* TODO: Implementar picker */ }}
                >
                  <Text style={[styles.textInput, { color: formData.provincia ? '#333333' : '#999999' }]}>
                    {formData.provincia || 'Selecione sua província'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Selecione uma província:</Text>
                <View style={styles.suggestionsGrid}>
                  {provincias.map((provincia, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestionChip,
                        formData.provincia === provincia && styles.selectedChip
                      ]}
                      onPress={() => handleInputChange('provincia', provincia)}
                    >
                      <Text style={[
                        styles.suggestionText,
                        formData.provincia === provincia && styles.selectedChipText
                      ]}>
                        {provincia}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSave}
                disabled={loading}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>{loading ? 'Aguarde...' : 'Salvar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      }

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

      {(!loading && formData.length == 0 && hasError) && (
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
            Um erro ocorreu ao carregar as informações.
          </Text>
        </View>
      )}

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
  profilePhotoSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
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
  photoText: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    color: '#333333',
    marginLeft: 12,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 8,
  },
  pickerButton: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#1E579C15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E579C30',
  },
  selectedChip: {
    backgroundColor: '#1E579C',
    borderColor: '#1E579C',
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#1E579C',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A5785',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#1A5785',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1A5785',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});