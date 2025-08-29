import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL, API_KEY } from '@/utils/constants';
import Toast from 'react-native-toast-message';


export default function NovoFreteScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [queryPartida, setQueryPartida] = useState("");
  const [queryDescarga, setQueryDescarga] = useState("");
  const [suggestPartida, setSuggestPartida] = useState<any[]>([]);
  const [suggestDescarga, setSuggestDescarga] = useState<any[]>([]);
  const [initialPoint, setInitialPoint] = useState<[number, number]>([13.2344, -8.8383]);
  const [destinationPoint, setDestinationPoint] = useState<[number, number]>([13.2894, -8.8137]);
  const [showDropdownPartida, setShowDropdownPartida] = useState(false);
  const [showDropdownDescarga, setShowDropdownDescarga] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Função para buscar sugestões no OpenStreetMap
  const getSuggestions = async (texto: string, setList: any, setShow: any) => {
    if (texto.length < 3) {
      setList([]);
      setShow(false);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}`,
        {
          headers: {
            "User-Agent": "SeuApp/1.0 (seuemail@dominio.com)",
            "Accept": "application/json",
          },
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setList(data);
        setShow(true);
      } else {
        setList([]);
        setShow(false);
      }
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  };

  const selectPartida = (item: any) => {
    setFormData({ ...formData, origem: item.display_name });
    setQueryPartida(item.display_name);
    setShowDropdownPartida(false);
    setInitialPoint([parseFloat(item.lon), parseFloat(item.lat)]);
  };

  const selectDescarga = (item: any) => {
    setFormData({ ...formData, destino: item.display_name });
    setQueryDescarga(item.display_name);
    setShowDropdownDescarga(false);
    setDestinationPoint([parseFloat(item.lon), parseFloat(item.lat)]);
  };


  const [formData, setFormData] = useState({
    designacao: '',
    origem: '',
    destino: '',
    tipoMercadoria: 'Escolha o tipo de mercadoria',
    pesoKg: 0,
    dataPrevista: '',
    servicoRecorrente: false,
    recorrencia: 0,
    fotoMercadoria: null as ImagePicker.ImagePickerAsset | null,
    outrosServicos: {
      "Carregamento (no veículo)": false,
      "Descarga (do veículo)": false,
      "Serviço de mudança": false,
      "Serviço de Mercadoria": false
    },
    valorProposta: '',
    comentario: '',
  });

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const formatPrice = (text: string) => {
    const onlyNumbers = text.replace(/\D/g, "");
    if (!onlyNumbers) return "";

    const number = parseInt(onlyNumbers, 10);
    return new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number / 100);
  };

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "DISTANCIA") {
        setDistance(message.value);
      }
    } catch (err) {
      console.error("Erro ao ler mensagem da WebView:", err);
    }
  };


  const handleInputChange = (field: string, value: string | boolean | object | number | null) => {

    if (field == "valorProposta") {
      value = formatPrice(value as string);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      // Formatar para yyyy-mm-dd
      const date = new Date(selectedDate);
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()).padStart(2, "0")}`;
      handleInputChange("dataPrevista", formatted);
    }
  };

  type ServicesType =
    | "Carregamento (no veículo)"
    | "Descarga (do veículo)"
    | "Serviço de mudança"
    | "Serviço de Mercadoria";

  const handleServiceChange = (servico: ServicesType, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      outrosServicos: {
        ...prev.outrosServicos,
        [servico]: !prev.outrosServicos[servico],
      }
    }));
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.designacao || !formData.origem || !formData.destino || !formData.pesoKg || !formData.valorProposta) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.pesoKg > 15000) {
      Alert.alert('Erro', 'O peso não pode ser superior a 15.000 kg.');
      return;
    }
    
    if (!formData.fotoMercadoria) {
      Alert.alert('Erro', 'Por favor, envie uma foto da mercadoria.');
      return;
    }

    setLoading(true);

    const selectedServices = Object.keys(formData.outrosServicos)
  .filter((key) => formData.outrosServicos[key as ServicesType]) 
  .join(", ");

    const form = new FormData();
    form.append("designacao", formData.designacao);
    form.append("origem", formData.origem);
    form.append("destino", formData.destino);
    form.append("distancia", distance);
    form.append("tipoMercadorias", formData.tipoMercadoria);
    form.append("pesoKg", String(formData.pesoKg));
    form.append("dataPrevista", formData.dataPrevista);
    form.append("servicoRecorrente", formData.servicoRecorrente ? "SIM" : "NÃO");
    form.append("vezesMensalRecorrencia", String(formData.recorrencia));
    form.append("outrosServicos", selectedServices);
    form.append("valorProposta", "22111");
    form.append("obs", formData.comentario);

    if (formData.fotoMercadoria) {
      const uri = formData.fotoMercadoria.uri;
      const extension = uri.split('.').pop();
      const mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;
      const filename = uri.split('/').pop() || `${Date.now()}.${extension}`;

      form.append("fotoMercadoria", {
        uri,
        name: filename,
        type: mimeType,
      } as any);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/frete/novo-pedido`, {
        method: 'POST',
        headers: {
          Authorization: `${API_KEY}`,
        },
        body: form,
      });
      const data = await response.json();

      console.log(data, form);
      

      if (!response.ok || data.tipo !== 'Sucesso') {
        throw new Error(data.msg || 'Erro ao criar pedido');
      }

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Novo pedido criado com sucesso!',
      });

      router.replace('/(tabs)/fretes');
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar frete.");
    } finally {
      setLoading(false);
    }
  };

  const tiposMercadoria = [
    {
      label: "Bebida",
      options: [
        { value: "1", label: "Água" },
        { value: "2", label: "Bebidas espirituosas" },
        { value: "3", label: "Cerveja" },
        { value: "4", label: "Gasosas e sumos" },
        { value: "5", label: "Outros" },
      ],
    },
    {
      label: "Material de construção",
      options: [
        { value: "6", label: "Aço" },
        { value: "7", label: "Chapas" },
        { value: "8", label: "Cimento" },
        { value: "9", label: "Sucata" },
        { value: "10", label: "Tijolos e blocos" },
        { value: "11", label: "Outros" },
      ],
    },
    {
      label: "Carga seca",
      options: [
        { value: "12", label: "Alimentos não perecíveis" },
        { value: "13", label: "Aparelhos electrónicos" },
        { value: "14", label: "Brinquedos" },
        { value: "15", label: "Electrodomésticos" },
        { value: "16", label: "Mobiliário" },
        { value: "17", label: "Plásticos domésticos" },
        { value: "18", label: "Vestuário e calçados" },
        { value: "19", label: "Outros" },
      ],
    },
    {
      label: "Carga refrigerada",
      options: [
        { value: "20", label: "Frutas" },
        { value: "21", label: "Legumes" },
        { value: "22", label: "Ovos" },
        { value: "23", label: "Verduras" },
        { value: "24", label: "Carnes" },
        { value: "25", label: "Frangos" },
        { value: "26", label: "Peixes" },
        { value: "27", label: "Outros" },
      ],
    },
    {
      label: "Carga viva",
      options: [
        { value: "28", label: "Aves" },
        { value: "29", label: "Bovinos" },
        { value: "30", label: "Caprinos" },
        { value: "31", label: "Suínos" },
        { value: "32", label: "Outros" },
      ],
    },
    {
      label: "Carga a granel",
      options: [
        { value: "33", label: "Açúcar" },
        { value: "34", label: "Algodão" },
        { value: "35", label: "Arroz" },
        { value: "36", label: "Bombó" },
        { value: "37", label: "Café" },
        { value: "38", label: "Cereais em geral" },
        { value: "39", label: "Feijão" },
        { value: "40", label: "Milho" },
        { value: "41", label: "Sal" },
        { value: "42", label: "Soja" },
        { value: "43", label: "Água (indústria)" },
        { value: "44", label: "Outros" },
      ],
    },
    {
      label: "Carga perigosa",
      options: [
        { value: "95", label: "Gasóleo" },
        { value: "96", label: "Gasolina" },
        { value: "97", label: "Corrosivos" },
        { value: "98", label: "Explosivos" },
        { value: "99", label: "Químicos" },
        { value: "100", label: "Resíduos hospitalares" },
        { value: "101", label: "Tóxicos" },
        { value: "102", label: "Outros" },
      ],
    },
    {
      label: "Carga de minério e cimento",
      options: [
        { value: "103", label: "Minério" },
        { value: "104", label: "Betão" },
        { value: "105", label: "Cimento" },
      ],
    },
    {
      label: "Veículo, maquinaria e embarcação",
      options: [
        { value: "106", label: "Veículo" },
        { value: "107", label: "Maquinaria" },
        { value: "108", label: "Embarcação" },
        { value: "109", label: "Outros" },
      ],
    },
    {
      label: "Carga frágil",
      options: [
        { value: "110", label: "Cerâmicas" },
        { value: "111", label: "Louça" },
        { value: "112", label: "Vidros" },
        { value: "113", label: "Outros" },
      ],
    },
    {
      label: "Carga de valor",
      options: [
        { value: "114", label: "Metais preciosos" },
        { value: "115", label: "Pedras preciosas e semi-preciosas" },
        { value: "116", label: "Valores monetários" },
      ],
    },
    {
      label: "Medicamentos",
      options: [
        { value: "117", label: "Refrigerados" },
        { value: "118", label: "Não refrigerados" },
      ],
    },
    {
      label: "Diversos",
      options: [
        { value: "119", label: 'Descrever as mercadorias no campo "Observações"' },
      ],
    },
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
      const partida = ${JSON.stringify(initialPoint)};
      const descarga = ${JSON.stringify(destinationPoint)};

      const map = L.map('map').setView([partida[1], partida[0]], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      L.marker([partida[1], partida[0]]).addTo(map).bindPopup("Ponto de Partida");
      L.marker([descarga[1], descarga[0]]).addTo(map).bindPopup("Ponto de Descarga");

      const apiKey = "5b3ce3597851110001cf62489d33ec5d771142b09952aed755e219c8"; 
      const url = \`https://api.openrouteservice.org/v2/directions/driving-car?api_key=\${apiKey}&start=\${partida[0]},\${partida[1]}&end=\${descarga[0]},\${descarga[1]}\`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const coords = data.features[0].geometry.coordinates;
          const latlngs = coords.map(c => [c[1], c[0]]);
          const rota = L.polyline(latlngs, { color: 'blue', weight: 4 }).addTo(map);
          map.fitBounds(rota.getBounds());

          // Pegando distância em KM
          const distanciaMetros = data.features[0].properties.segments[0].distance;
          const distanciaKm = (distanciaMetros / 1000).toFixed(2);

          // Enviar para React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "DISTANCIA",
            value: distanciaKm
          }));

          // Exibir no mapa
          L.popup()
            .setLatLng(latlngs[Math.floor(latlngs.length / 2)])
            .setContent(distanciaKm + ' km')
            .openOn(map);
        })
        .catch(err => console.error("Erro ao buscar rota:", err));

      map.scrollWheelZoom.disable();
      map.doubleClickZoom.enable();
    </script>
  </body>
  </html>
`;


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
        fotoMercadoria: result.assets[0]
      }));
    }
  };

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
              placeholder="Digite o ponto de partida"
              value={queryPartida}
              onChangeText={(value) => {
                setQueryPartida(value);
                getSuggestions(value, setSuggestPartida, setShowDropdownPartida);
              }}
              placeholderTextColor="#999999"
            />

            {showDropdownPartida && (
              <FlatList
                data={suggestPartida}
                keyExtractor={(item, index) => index.toString()}
                style={styles.dropdown}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectPartida(item)}
                  >
                    <Text>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ponto de descarga</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Digite o ponto de descarga"
              value={queryDescarga}
              onChangeText={(value) => {
                setQueryDescarga(value);
                getSuggestions(value, setSuggestDescarga, setShowDropdownDescarga);
              }}
              placeholderTextColor="#999999"
            />

            {showDropdownDescarga && (
              <FlatList
                data={suggestDescarga}
                keyExtractor={(item, index) => index.toString()}
                style={styles.dropdown}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectDescarga(item)}
                  >
                    <Text>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
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
              onMessage={handleMessage}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Mercadoria</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    {
                      color:
                        formData.tipoMercadoria === 'Escolha o tipo de mercadoria'
                          ? '#999999'
                          : '#333333',
                    },
                  ]}
                >
                  {formData.tipoMercadoria}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal para escolher tipo de mercadoria */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={tiposMercadoria}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.groupContainer}>
                        {/* Título da categoria */}
                        <Text style={styles.groupTitle}>{item.label}</Text>

                        {/* Opções da categoria */}
                        {item.options.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={styles.option}
                            onPress={() => {
                              setFormData({ ...formData, tipoMercadoria: option.label });
                              setModalVisible(false);
                            }}
                          >
                            <Text style={styles.optionText}>{option.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  />

                  {/* Botão cancelar */}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Peso aproximado em KG</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0.0"
              value={formData.pesoKg.toString()}
              onChangeText={(value) => handleInputChange('pesoKg', value)}
              keyboardType="numeric"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 8, fontWeight: "600" }}>
              Data prevista para frete
            </Text>

            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 12,
                borderRadius: 8,
              }}
              onPress={() => setShowPicker(true)}
            >
              <Text>{formData.dataPrevista || "Selecionar data"}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={formData.dataPrevista ? new Date(formData.dataPrevista) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleChange}
              />
            )}
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
              value={formData.recorrencia.toString()}
              onChangeText={(value) => handleInputChange('recorrencia', parseInt(value))}
              keyboardType="numeric"
              placeholderTextColor="#999999"
              editable={formData.servicoRecorrente}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Deseja outros serviços</Text>
            <View style={styles.checkboxGroup}>
              {Object.keys(formData.outrosServicos).map((service) => (
                <TouchableOpacity
                  key={service}
                  style={styles.checkboxOption}
                  onPress={() => handleServiceChange(service as ServicesType, !formData.outrosServicos[service as ServicesType])}
                >
                  <View
                    style={[
                      styles.checkbox,
                      formData.outrosServicos[service as ServicesType] && styles.checkboxSelected,
                    ]}
                  />
                  <Text style={styles.checkboxText}>{service}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Proposta de preço</Text>
            <TextInput
              style={styles.textInput}
              placeholder="KZ"
              value={formData.valorProposta}
              onChangeText={(value) => handleInputChange('valorProposta', value)}
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

            {formData.fotoMercadoria ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: formData.fotoMercadoria.uri }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleInputChange('fotoMercadoria', null)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Camera size={40} color="#CCCCCC" />
                <Text style={styles.uploadText}>Clique para fazer upload</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? "A carregar..." : "Criar" }</Text>
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
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagePreviewContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
    width: '100%',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '60%',
  },
  option: { paddingVertical: 14 },
  optionText: { fontSize: 16, color: '#333' },
  cancelButton: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: '#666' },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 150,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  groupContainer: {
    marginBottom: 15,
  },

  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },

});