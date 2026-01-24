import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Share, Alert, Linking, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Styles } from './style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLetterById, deleteLetter } from '../../services/auth';
import { useTheme } from '../../theme/ThemeContext';
import Logo from '../../../assets/logotelas.svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EditarCartas">;

export default function EditarCartas() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { letterId } = route.params as { letterId: number };
    const [letter, setLetter] = useState<any>(null);
    const { theme } = useTheme();

    const styles = Styles(theme);

    const loadLetter = async () => {
    try {
        const token = await AsyncStorage.getItem("autToken");
        if (!token) return;

        const data = await getLetterById(letterId, token);

        // Ajusta estrutura
        setLetter({
  ...data.letter.data,   // 👈 aqui está o template_id
  expires_at: data.letter.expires_at,
  is_paid: data.letter.is_paid,
  id: data.id,
  photos: data.photos
});


    } catch (e) {
        console.log("Erro ao carregar a carta:", e);
    }
};


    useEffect(() => {
        loadLetter();
    }, []);

    const handleOpenLink = () => {
        Linking.openURL(`http://192.168.1.7:3000/letters/${letter.share_url}`);
      };

    // 🔗 Compartilhar URL
    const handleShare = async () => {
        if (!letter?.share_url) return;

        const url = `http://192.168.1.7:3000/letters/${letter.share_url}`;

        await Share.share({
            message: `Veja minha carta: ${url}`,
        });
    };

    // 🗑️ Deletar Carta
    const handleDelete = () => {
        Alert.alert(
            "Apagar Carta",
            "Tem certeza que deseja apagar esta carta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    async onPress() {
                        try {
                            const token = await AsyncStorage.getItem("autToken");
                            if (!token) return;

                            await deleteLetter(letterId, token);

                            Alert.alert("Sucesso!", "Carta apagada.");
                            navigation.goBack();
                        } catch (err) {
                            console.log(err);
                            Alert.alert("Erro", "Não foi possível apagar a carta.");
                        }
                    }
                }
            ]
        );
    };

    // 🖼️ Pega template
    const getTemplateImage = () => {
        
        if (!letter?.template_id) return null;

        switch (Number(letter.template_id)) {
            case 1:
                return require("../../../assets/template1.png");
            case 2:
                return require("../../../assets/template2.png");
            case 3:
                return require("../../../assets/template3.png");
            default:
                return null;
        }
    };

    const templateImage = getTemplateImage();

    if (!letter) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ color: theme.carregandotextedit ,textAlign: "center", marginTop: 40 }}>Carregando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <View style={styles.arrow}>
                        <MaterialCommunityIcons name="arrow-left" size={30} style= {{color: theme.text}} />
                    </View>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Logo width={160} height={160} color={theme.primary} />
                    <Text style={styles.title}>Visualizar Carta</Text>
                </View>

                <View style={styles.buttonContainer}>
                    
                    {/* BOTÃO COMPARTILHAR */}
                    <TouchableOpacity style={styles.compartilhar} onPress={handleShare}>
                        <View style={styles.share}>
                            <MaterialCommunityIcons name="share-variant-outline" size={30} color={theme.iconcompartilhar} />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.titlemid}>{letter.letter_title}</Text>
                </View>

                {/* IMAGEM DO TEMPLATE */}
                {templateImage && (
  <View style={{ alignItems: "center", marginTop: 20 }}>
    <Image
      source={templateImage}
      style={{ width: 200, height: 200, resizeMode: "contain" }}
    />
  </View>
)}


                {/* LINK */}
                <View style={styles.boxlink}>
                    <Text style={{ color: theme.texteditarcartas }}>Link da carta:</Text>
                    <Text style={{ color: theme.texteditarcartas }}>
                        {letter.share_url}
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
                                <Text style={styles.buttonText}>Acessar</Text>
                              </TouchableOpacity>

                    {/* Botão Apagar */}
                    <TouchableOpacity style={styles.apagar} onPress={handleDelete}>
                        <View style={styles.trash}>
                            <MaterialCommunityIcons name="trash-can-outline" size={30} color="#B41513" />
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
