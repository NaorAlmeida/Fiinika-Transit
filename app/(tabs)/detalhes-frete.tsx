import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ArrowLeft, MapPin, Package, Clock, DollarSign, CircleCheck as CheckCircle, Circle, Truck, Calendar, User, Camera, FileText, QrCode, Info, Navigation, Shield } from 'lucide-react-native';

export default function DetalhesFrete() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('geral');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  // Dados mockados do frete
  const freteData = {
    id: params.id || '1',
    origem: 'São Paulo, SP',
    destino: 'Rio de Janeiro, RJ',
    valor: '2.500 KZ',
    status: 'Em trânsito',
    data: '15/01/2024',
    tiposCarga: 'Equipamentos industriais',
    peso: '15 toneladas',
    prazo: '2 dias',
    observacoes: 'Carga frágil, manuseio cuidadoso'
  };

  const detalhesGerais = {
    precoFinal: '6.500 KZ',
    designacao: 'Transporte de equipamentos industriais',
    propostaPreco: '6.800 KZ',
    pontoPartida: 'Luanda, Talatona',
    pontoDescarga: 'Benguela, Centro',
    peso: '15 toneladas',
    tipoMercadoria: 'Equipamentos industriais',
    dataPrevista: '25/01/2024',
    servicoRecorrente: 'Não',
    recorrencia: 'N/A',
    outrosServicos: 'Seguro de carga',
    transportador: 'Transportador 3',
    comentarios: [
      { id: 1, autor: 'Cliente', texto: 'Carga muito frágil, cuidado no manuseio', data: '15/01/2024 10:30' },
      { id: 2, autor: 'Transportador', texto: 'Entendido, faremos o transporte com cuidado especial', data: '15/01/2024 11:15' }
    ]
  };

  const acompanhamento = [
    {
      titulo: 'Início do frete',
      subtitulo: 'veículo em direcção ao ponto de carregamento',
      status: 'Completo',
      data: '12:00H | 20/09/2024'
    },
    {
      titulo: 'Recepção de carga confirmada',
      subtitulo: '',
      status: 'Pendente',
      data: ''
    },
    {
      titulo: 'Entrega da mercadoria',
      subtitulo: '',
      status: 'Pendente',
      data: ''
    }
  ];

  const progressSteps = [
    { title: 'Pedido criado', completed: true },
    { title: 'Processado', completed: true },
    { title: 'Em trânsito', completed: true },
    { title: 'Entregue', completed: false }
  ];

  const transportadores = [
    {
      id: 1,
      nome: 'Transportador 1',
      data: '12/09/2024',
      valor: '6.800 KZ',
      status: 'Participante'
    },
    {
      id: 2,
      nome: 'Transportador 2',
      data: '12/09/2024',
      valor: '7.200 KZ',
      status: 'Participante'
    },
    {
      id: 3,
      nome: 'Transportador 3',
      data: '12/09/2024',
      valor: '6.500 KZ',
      status: 'Escolhido'
    }
  ];

  const tempoRestante = '2h 45min';

  const handlePhotoUpload = async () => {
    try {
      setUploadingPhoto(true);
      
      // Solicitar permissões
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão necessária para acessar a galeria de fotos.');
        return;
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Simular upload (substituir por upload real)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploadedPhoto(result.assets[0]);
        Alert.alert('Sucesso', 'Foto carregada com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar a foto. Tente novamente.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocumentUpload = async () => {
    try {
      setUploadingDocument(true);
      
      // Abrir seletor de documentos
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        // Simular upload (substituir por upload real)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setUploadedDocument(result.assets[0]);
        Alert.alert('Sucesso', 'Documento carregado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar o documento. Tente novamente.');
    } finally {
      setUploadingDocument(false);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rota do Frete</title>
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
        // Coordenadas de São Paulo (origem)
        const origemCoords = [-23.5505, -46.6333];
        // Coordenadas do Rio de Janeiro (destino)
        const destinoCoords = [-22.9068, -43.1729];
        
        // Inicializar o mapa centralizado entre origem e destino
        const centerLat = (origemCoords[0] + destinoCoords[0]) / 2;
        const centerLng = (origemCoords[1] + destinoCoords[1]) / 2;
        
        const map = L.map('map').setView([centerLat, centerLng], 6);
        
        // Adicionar tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Adicionar marcador de origem
        const origemMarker = L.marker(origemCoords).addTo(map);
        origemMarker.bindPopup('Origem: São Paulo, SP').openPopup();
        
        // Adicionar marcador de destino
        const destinoMarker = L.marker(destinoCoords).addTo(map);
        destinoMarker.bindPopup('Destino: Rio de Janeiro, RJ');
        
        // Adicionar linha conectando origem e destino
        const routeLine = L.polyline([origemCoords, destinoCoords], {
          color: '#1E579C',
          weight: 3,
          opacity: 0.8
        }).addTo(map);
        
        // Ajustar zoom para mostrar toda a rota
        map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
        
        // Prevenir zoom com scroll do mouse
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.enable();
      </script>
    </body>
    </html>
  `;

  const handleCancelFrete = () => {
    Alert.alert(
      'Cancelar Frete',
      'Tem certeza que deseja cancelar este frete? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Não',
          style: 'cancel'
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Frete Cancelado', 'O frete foi cancelado com sucesso.', [
              {
                text: 'OK',
                onPress: () => router.push('/(tabs)/fretes')
              }
            ]);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E579C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Frete</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Acompanhar Progresso</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Em trânsito</Text>
            </View>
          </View>
          <View style={styles.progressTimeline}>
            {progressSteps.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  <View style={[
                    styles.timelineCircle,
                    { backgroundColor: step.completed ? '#28A745' : '#E5E5E5' }
                  ]}>
                    {step.completed && (
                      <CheckCircle size={16} color="#FFFFFF" />
                    )}
                  </View>
                  {index < progressSteps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: step.completed ? '#28A745' : '#E5E5E5' }
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineTitle,
                    { color: step.completed ? '#28A745' : '#666666' }
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.timelineSubtitle}>
                    {step.completed ? 'Concluído' : 'Aguardando'}
                  </Text>
                  {step.completed && (
                    <Text style={styles.timelineTime}>
                      {index === 0 ? '15/01 - 08:30' : index === 1 ? '15/01 - 10:15' : '15/01 - 14:20'}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.freteInfoSection}>
          <View style={styles.routeHeader}>
            <MapPin size={20} color="#1E579C" />
            <Text style={styles.routeText}>
              {freteData.origem} → {freteData.destino}
            </Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Package size={16} color="#666666" />
              <Text style={styles.infoLabel}>Tipo de Carga</Text>
              <Text style={styles.infoValue}>{freteData.tiposCarga}</Text>
            </View>
            <View style={styles.infoItem}>
              <Truck size={16} color="#666666" />
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{freteData.peso}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={16} color="#666666" />
              <Text style={styles.infoLabel}>Prazo</Text>
              <Text style={styles.infoValue}>{freteData.prazo}</Text>
            </View>
            <View style={styles.infoItem}>
              <DollarSign size={16} color="#666666" />
              <Text style={styles.infoLabel}>Valor</Text>
              <Text style={styles.infoValue}>{freteData.valor}</Text>
            </View>
          </View>
        </View>
        <View style={styles.leilaoSection}>
          <View style={styles.leilaoHeader}>
            <Text style={styles.sectionTitle}>Resultado do Leilão</Text>
            <View style={styles.tempoContainer}>
              <Clock size={16} color="#FFC107" />
              <Text style={styles.tempoText}>Tempo restante: {tempoRestante}</Text>
            </View>
          </View>
          {transportadores.map((transportador) => (
            <View key={transportador.id} style={styles.transportadorCard}>
              <View style={styles.transportadorHeader}>
                <View style={styles.transportadorInfo}>
                  <User size={20} color="#1E579C" />
                  <Text style={styles.transportadorNome}>{transportador.nome}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { 
                    backgroundColor: transportador.status === 'Escolhido' 
                      ? '#28A74515' 
                      : '#1E579C15' 
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { 
                      color: transportador.status === 'Escolhido' 
                        ? '#28A745' 
                        : '#1E579C' 
                    }
                  ]}>
                    {transportador.status}
                  </Text>
                </View>
              </View>
              <View style={styles.transportadorDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={14} color="#666666" />
                  <Text style={styles.detailText}>{transportador.data}</Text>
                </View>
                <Text style={styles.valorText}>{transportador.valor}</Text>
              </View>
              {transportador.status === 'Participante' && (
                <TouchableOpacity style={styles.escolherButton}>
                  <Text style={styles.escolherButtonText}>Escolher</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <View style={styles.tabsSection}>
          <View style={styles.tabsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tabsScrollView}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'geral' && styles.activeTab]}
                onPress={() => setActiveTab('geral')}
              >
                <Text style={[styles.tabText, activeTab === 'geral' && styles.activeTabText]}>
                  Informação geral
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'acompanhamento' && styles.activeTab]}
                onPress={() => setActiveTab('acompanhamento')}
              >
                <Text style={[styles.tabText, activeTab === 'acompanhamento' && styles.activeTabText]}>
                  Acompanhamento
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'confirmacao' && styles.activeTab]}
                onPress={() => setActiveTab('confirmacao')}
              >
                <Text style={[styles.tabText, activeTab === 'confirmacao' && styles.activeTabText]}>
                  Confirmação
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.tabContent}>
            {activeTab === 'geral' && (
              <View style={styles.geralContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Preço final do frete</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.precoFinal}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Designação</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.designacao}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Proposta de preço</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.propostaPreco}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Ponto de partida</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.pontoPartida}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Ponto de descarga</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.pontoDescarga}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Peso</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.peso}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Tipo de mercadoria</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.tipoMercadoria}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Data prevista para frete</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.dataPrevista}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Serviço recorrente</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.servicoRecorrente}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Recorrência</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.recorrencia}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Outros serviços</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.outrosServicos}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowLabel}>Transportador</Text>
                  <Text style={styles.infoRowValue}>{detalhesGerais.transportador}</Text>
                </View>
                <View style={styles.photoSection}>
                  <Text style={styles.photoSectionTitle}>Foto da mercadoria</Text>
                  <TouchableOpacity 
                    style={[styles.addPhotoButton, uploadingPhoto && styles.uploadingButton]}
                    onPress={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  >
                    <Camera size={20} color="#1E579C" />
                    <Text style={styles.addPhotoText}>
                      {uploadingPhoto ? 'Carregando...' : 'Adicionar foto'}
                    </Text>
                  </TouchableOpacity>
                  
                  {uploadingPhoto ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.loadingSpinner} />
                      <Text style={styles.loadingText}>Carregando foto...</Text>
                    </View>
                  ) : uploadedPhoto ? (
                    <View style={styles.uploadedFileContainer}>
                      <View style={styles.uploadedFileInfo}>
                        <Camera size={20} color="#28A745" />
                        <Text style={styles.uploadedFileName}>Foto carregada</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => setUploadedPhoto(null)}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Package size={40} color="#CCCCCC" />
                      <Text style={styles.photoPlaceholderText}>Nenhuma foto adicionada</Text>
                    </View>
                  )}
                </View>
                <View style={styles.photoSection}>
                  <Text style={styles.photoSectionTitle}>Factura</Text>
                  <TouchableOpacity 
                    style={[styles.addPhotoButton, uploadingDocument && styles.uploadingButton]}
                    onPress={handleDocumentUpload}
                    disabled={uploadingDocument}
                  >
                    <FileText size={20} color="#1E579C" />
                    <Text style={styles.addPhotoText}>
                      {uploadingDocument ? 'Carregando...' : 'Adicionar factura'}
                    </Text>
                  </TouchableOpacity>
                  
                  {uploadingDocument ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.loadingSpinner} />
                      <Text style={styles.loadingText}>Carregando documento...</Text>
                    </View>
                  ) : uploadedDocument ? (
                    <View style={styles.uploadedFileContainer}>
                      <View style={styles.uploadedFileInfo}>
                        <FileText size={20} color="#28A745" />
                        <Text style={styles.uploadedFileName}>
                          {uploadedDocument.name || 'Documento carregado'}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => setUploadedDocument(null)}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <FileText size={40} color="#CCCCCC" />
                      <Text style={styles.photoPlaceholderText}>Nenhuma factura carregada</Text>
                    </View>
                  )}
                </View>
                <View style={styles.commentsSection}>
                  <Text style={styles.photoSectionTitle}>Comentários</Text>
                  {detalhesGerais.comentarios.map((comentario) => (
                    <View key={comentario.id} style={styles.commentCard}>
                      <Text style={styles.commentAuthor}>{comentario.autor}</Text>
                      <Text style={styles.commentText}>{comentario.texto}</Text>
                      <Text style={styles.commentDate}>{comentario.data}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.mapSection}>
                  <Text style={styles.photoSectionTitle}>Mapa da Rota</Text>
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
                </View>
                <View style={styles.cancelSection}>
                  <TouchableOpacity 
                    style={styles.cancelFreteButton}
                    onPress={handleCancelFrete}
                  >
                    <Text style={styles.cancelFreteButtonText}>Cancelar Frete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {activeTab === 'acompanhamento' && (
              <View style={styles.acompanhamentoContent}>
                <Text style={styles.acompanhamentoTitle}>Acompanhamento do frete</Text>
                {acompanhamento.map((item, index) => (
                  <View key={index} style={styles.acompanhamentoItem}>
                    <View style={styles.acompanhamentoIndicator}>
                      {item.status === 'Completo' ? (
                        <CheckCircle size={20} color="#28A745" />
                      ) : (
                        <Circle size={20} color="#E5E5E5" />
                      )}
                    </View>
                    <View style={styles.acompanhamentoInfo}>
                      <Text style={styles.acompanhamentoItemTitle}>{item.titulo}</Text>
                      {item.subtitulo && (
                        <Text style={styles.acompanhamentoSubtitle}>{item.subtitulo}</Text>
                      )}
                      <View style={styles.acompanhamentoStatus}>
                        <View style={[
                          styles.statusBadgeSmall,
                          { backgroundColor: item.status === 'Completo' ? '#28A74515' : '#FFC10715' }
                        ]}>
                          <Text style={[
                            styles.statusTextSmall,
                            { color: item.status === 'Completo' ? '#28A745' : '#FFC107' }
                          ]}>
                            {item.status}
                          </Text>
                        </View>
                        {item.data && (
                          <Text style={styles.acompanhamentoData}>{item.data}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {activeTab === 'confirmacao' && (
              <View style={styles.confirmacaoContent}>
                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>ENTREGA DE MERCADORIA</Text>
                  <View style={styles.qrContainer}>
                    <QrCode size={120} color="#1E579C" />
                  </View>
                  <Text style={styles.qrSubtext}>Escaneie para confirmar entrega</Text>
                </View>
                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>RECEPÇÃO DE MERCADORIA</Text>
                  <View style={styles.qrContainer}>
                    <QrCode size={120} color="#1E579C" />
                  </View>
                  <Text style={styles.qrSubtext}>Escaneie para confirmar recepção</Text>
                </View>
              </View>
            )}
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
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 0,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28A745',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
    color: '#000000',
  },
  progressTimeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    position: 'absolute',
    top: 32,
    left: 16,
    width: 2,
    height: 24,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#999999',
  },
  freteInfoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginLeft: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
  },
  leilaoSection: {
    marginBottom: 32,
  },
  leilaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tempoText: {
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
    color: '#856404',
    marginLeft: 4,
  },
  transportadorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transportadorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transportadorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportadorNome: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  transportadorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  valorText: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    color: '#28A745',
  },
  escolherButton: {
    backgroundColor: '#1A5785',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  escolherButtonText: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
  },
  tabsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 32,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabsScrollView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E579C',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  activeTabText: {
    fontFamily: 'Barlow-SemiBold',
    color: '#1E579C',
  },
  tabContent: {
    padding: 16,
  },
  geralContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
    flex: 1,
  },
  infoRowValue: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    textAlign: 'right',
    flex: 1,
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 12,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: '#1E579C',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  addPhotoText: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#1E579C',
    marginLeft: 8,
  },
  photoPlaceholder: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#CCCCCC',
    marginTop: 8,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
    color: '#1E579C',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#333333',
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 11,
    fontFamily: 'Barlow-Regular',
    color: '#999999',
  },
  acompanhamentoContent: {
    gap: 16,
  },
  acompanhamentoTitle: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  acompanhamentoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  acompanhamentoIndicator: {
    marginRight: 12,
    marginTop: 2,
  },
  acompanhamentoInfo: {
    flex: 1,
  },
  acompanhamentoItemTitle: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  acompanhamentoSubtitle: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  acompanhamentoStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextSmall: {
    fontSize: 10,
    fontFamily: 'Barlow-SemiBold',
  },
  acompanhamentoData: {
    fontSize: 12,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
  },
  confirmacaoContent: {
    gap: 32,
    alignItems: 'center',
  },
  qrSection: {
    alignItems: 'center',
    width: '100%',
  },
  qrTitle: {
    fontSize: 14,
    fontFamily: 'Barlow-Bold',
    color: '#333333',
    marginBottom: 16,
    letterSpacing: 1,
  },
  qrContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrSubtext: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  mapSection: {
    marginTop: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  map: {
    flex: 1,
  },
  cancelSection: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelFreteButton: {
    backgroundColor: '#DC3545',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelFreteButtonText: {
    fontSize: 16,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
  },
  uploadingButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderTopColor: '#1E579C',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
  },
  uploadedFileContainer: {
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#28A745',
  },
  uploadedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  uploadedFileName: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#28A745',
    marginLeft: 8,
  },
  removeButton: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    fontSize: 12,
    fontFamily: 'Barlow-SemiBold',
    color: '#FFFFFF',
  },
});