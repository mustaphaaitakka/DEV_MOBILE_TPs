import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
type Mode = 'tous' | 'ateliers';

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const mode = 'ateliers' as Mode; // changer en 'ateliers' pour tester

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}

const total = evenements.length;
const nbComplets = evenements.filter(e => placesRestantes(e) === 0).length;
const nbAvecPlaces = evenements.filter(e => placesRestantes(e) > 0).length;
const sommePlaces = evenements.reduce((s, e) => s + placesRestantes(e), 0);

const ateliersDisponibles = evenements.filter(
  e => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

const donnees = mode === 'tous' ? evenements : ateliersDisponibles;

const couleurs: Record<Statut, string> = {
  'Complet': '#f1a2a2',
  'Presque complet': '#f3ca8d',
  'Ouvert': '#a6f5c2',
};
type BadgeEtatProps = { statut: Statut };
function BadgeEtat({ statut }: BadgeEtatProps) {
  return (
    <View style={[styles.badge, { backgroundColor: couleurs[statut] }]}>
      <Text style={styles.badgeTexte}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteEvenementProps) {
  return (
    <View style={styles.carte}>
      <View style={styles.carteInfos}>
        <Text style={styles.carteTitre} numberOfLines={2}>{evenement.titre}</Text>
        <Text style={styles.carteTexte}>{evenement.categorie}</Text>
        <Text style={styles.carteTexte}>
          {placesRestantes(evenement)} places restantes
        </Text>
      </View>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocStatistiqueProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocValeur}>{valeur}</Text>
      <Text style={styles.blocLibelle}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.ecran}>
      <StatusBar style="light" />

      <View style={styles.entete}>
        <Text style={styles.enteteTitre}>CampusAgenda</Text>
      </View>
      <Text style={styles.sousTitre}>Événements du campus</Text>

      <View style={styles.statistiques}>
        <BlocStatistique libelle="Événements" valeur={total} />
        <BlocStatistique libelle="Complets" valeur={nbComplets} />
        <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={sommePlaces} />
      </View>

      <FlatList
        data={donnees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={
          <Text style={styles.vide}>Aucun événement à afficher.</Text>
        }
        contentContainerStyle={styles.liste}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#F1F6FF', paddingTop: 50 },
  entete: {
    backgroundColor: '#0B3A9A',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  enteteTitre: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  sousTitre: { textAlign: 'center', color: '#555', marginVertical: 8 },

  statistiques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bloc: {
    flexBasis: '48%',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  blocValeur: { fontSize: 22, fontWeight: 'bold', color: '#0B2A66' },
  blocLibelle: { fontSize: 13, color: '#1E40AF' },

  titreMode: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0B2A66',
    marginHorizontal: 16,
    marginVertical: 8,
  },

  liste: { paddingHorizontal: 16, paddingBottom: 24 },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  carteInfos: { flex: 1, marginRight: 10 },
  carteTitre: { fontSize: 17, fontWeight: 'bold', color: '#0B2A66' },
  carteTexte: { fontSize: 14, color: '#555', marginTop: 2 },

  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 },
  badgeTexte: { fontSize: 13, fontWeight: 'bold', color: '#222' },

  vide: { textAlign: 'center', color: '#777', marginTop: 20, fontSize: 16 },
});



