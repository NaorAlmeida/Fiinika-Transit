import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { 
  Menu, 
  ArrowLeft, 
  MapPin, 
  Package, 
  Calendar, 
  DollarSign,
  Truck,
  Clock,
  FileText,
  Plus,
  Camera
} from 'lucide-react-native';
import { useState } from 'react';

export default function NovoFreteScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    designacao: '',
    pontoPartida: '',
    pontoDescarga: '',
    tipoMercadoria: 'Escolha o tipo de mercadoria',
    peso: '',
    dataPrevista: '',
    servicoRecorrente: false,
    recorrencia: '',
    outrosServicos: {
      carregamento: false,
      descarga: false,
      mudanca: false,
      outros: false
    },
    propostaPreco: '',
    comentario: '',
  });

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleInputChange = (field: string, value: string | boolean | object) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServicoChange = (servico: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      outrosServicos: {
        ...prev.outrosServicos,
        [servico]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Validação básica
    if (!formData.designacao || !formData.pontoPartida || !formData.pontoDescarga || !formData.peso || !formData.propostaPreco) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    Alert.alert(
      'Sucesso!', 
      'Novo pedido criado com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/fretes')
        }
      ]
    );
  };

  const tiposMercadoria = [
    'Escolha o tipo de mercadoria',
    'Equipamentos industriais',
    'Materiais de construção',
    'Produtos alimentícios',
    'Móveis e eletrodomésticos',
    'Produtos químicos',
    'Automóveis',
    'Produtos farmacêuticos',
    'Outros'
  ];

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mapa Luanda</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        // Coordenadas de Luanda, Angola
        const luandaCoords = [-8.8383, 13.2344];
        
        // Inicializar o mapa
        const map = L.map('map').setView(luandaCoords, 13);
        
        // Adicionar tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Adicionar marcador no centro
        const marker = L.marker(luandaCoords).addTo(map);
        marker.bindPopup('Localização').openPopup();
        
        // Prevenir zoom com scroll do mouse
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.enable();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo pedido</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Designação</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={formData.designacao}
              onChangeText={(value) => handleInputChange('designacao', value)}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ponto de partida</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={formData.pontoPartida}
              onChangeText={(value) => handleInputChange('pontoPartida', value)}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ponto de descarga</Text>
            <TextInput
              style={styles.textInput}
              placeholder=""
              value={formData.pontoDescarga}
              onChangeText={(value) => handleInputChange('pontoDescarga', value)}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.mapContainer}>
            <WebView
              source={{ html: mapHtml }}
              style={styles.map}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              scrollEnabled={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Mercadoria</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => {/* TODO: Implementar picker */}}
              >
                <Text style={[
                  styles.pickerText,
                  { color: formData.tipoMercadoria === 'Escolha o tipo de mercadoria' ? '#999999' : '#333333' }
                ]}>
                  {formData.tipoMercadoria}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Peso aproximado em KG</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0.0"
              value={formData.peso}
              onChangeText={(value) => handleInputChange('peso', value)}
              keyboardType="numeric"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Data prevista para frete</Text>
            <TextInput
              style={styles.textInput}
              placeholder="mm/dd/yyyy"
              value={formData.dataPrevista}
              onChangeText={(value) => handleInputChange('dataPrevista', value)}
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Serviço recorrente?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => handleInputChange('servicoRecorrente', true)}
              >
                <View style={[styles.radioCircle, formData.servicoRecorrente && styles.radioSelected]} />
                <Text style={styles.radioText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.radioOption}
                onPress={() => handleInputChange('servicoRecorrente', false)}
              >
                <View style={[styles.radioCircle, !formData.servicoRecorrente && styles.radioSelected]} />
                <Text style={styles.radioText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Defina a recorrência mensal (número de vezes por mês)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0"
              value={formData.recorrencia}
              onChangeText={(value) => handleInputChange('recorrencia', value)}
              keyboardType="numeric"
              placeholderTextColor="#999999"
              editable={formData.servicoRecorrente}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Deseja outros serviços</Text>
            <View style={styles.checkboxGroup}>
              <TouchableOpacity 
                style={styles.checkboxOption}
                onPress={() => handleServicoChange('carregamento', !formData.outrosServicos.carregamento)}
              >
                <View style={[styles.checkbox, formData.outrosServicos.carregamento && styles.checkboxSelected]} />
                <Text style={styles.checkboxText}>Carregamento (no veículo)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkboxOption}
                onPress={() => handleServicoChange('descarga', !formData.outrosServicos.descarga)}
              >
                <View style={[styles.checkbox, formData.outrosServicos.descarga && styles.checkboxSelected]} />
                <Text style={styles.checkboxText}>Descarga (do veículo)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkboxOption}
                onPress={() => handleServicoChange('mudanca', !formData.outrosServicos.mudanca)}
              >
                <View style={[styles.checkbox, formData.outrosServicos.mudanca && styles.checkboxSelected]} />
                <Text style={styles.checkboxText}>Serviço de mudança</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.checkboxOption}
                onPress={() => handleServicoChange('outros', !formData.outrosServicos.outros)}
              >
                <View style={[styles.checkbox, formData.outrosServicos.outros && styles.checkboxSelected]} />
                <Text style={styles.checkboxText}>Outros serviços</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Proposta de preço</Text>
            <TextInput
              style={styles.textInput}
              placeholder="KZ"
              value={formData.propostaPreco}
              onChangeText={(value) => handleInputChange('propostaPreco', value)}
              keyboardType="numeric"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Comentário</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder=""
              value={formData.comentario}
              onChangeText={(value) => handleInputChange('comentario', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Foto da mercadoria</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Camera size={40} color="#CCCCCC" />
              <Text style={styles.uploadText}>Clique para fazer upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Criar</Text>
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
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  pickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#1A5785',
    backgroundColor: '#1A5785',
  },
  radioText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#333333',
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginRight: 8,
  },
  checkboxSelected: {
    borderColor: '#1A5785',
    backgroundColor: '#1A5785',
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#333333',
  },
  uploadButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#CCCCCC',
    marginTop: 8,
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#1A5785',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
  },
});