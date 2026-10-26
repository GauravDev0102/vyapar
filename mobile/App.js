import React from 'react';
import { View, Text, TouchableOpacity, Linking, StatusBar, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#0f2b4a',
  accent: '#f5a623',
  whatsapp: '#25D366',
  bg: '#f5f6fa',
  card: '#ffffff',
  text: '#1a1a2e',
  muted: '#6b7280',
};

export default function App() {
  const [shop, setShop] = React.useState(null);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem('vyapar_shop');
        const p = await AsyncStorage.getItem('vyapar_products');
        if (s) setShop(JSON.parse(s));
        if (p) setProducts(JSON.parse(p));
      } catch (e) {}
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vyapar</Text>
          <Text style={styles.headerSub}>Shop Manager</Text>
        </View>
        <View style={styles.stats}>
          {[
            { label: 'Products', val: products.length, icon: '📦' },
            { label: 'Orders', val: '0', icon: '🛒' },
            { label: 'Revenue', val: '₹0', icon: '💰' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
        {shop ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{shop.name?.en || 'My Shop'}</Text>
            <Text style={styles.cardSub}>{shop.phone || 'No phone'}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${shop.phone}`)}>
                <Text style={styles.actionIcon}>📞</Text>
                <Text style={styles.actionLabel}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.whatsapp }]} onPress={() => {
                const num = shop.whatsapp?.replace(/[^0-9]/g, '');
                if (num) Linking.openURL(`https://wa.me/${num}`);
              }}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionLabel}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No shop set up yet</Text>
            <Text style={styles.emptySub}>Use the web dashboard to create your shop</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  header: { backgroundColor: COLORS.primary, padding: 24, paddingTop: 40 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  stats: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statVal: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  card: { backgroundColor: COLORS.card, margin: 16, marginTop: 0, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  cardSub: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  actionIcon: { fontSize: 18 },
  actionLabel: { fontSize: 14, fontWeight: '600', color: '#fff' },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.muted },
  emptySub: { fontSize: 13, color: COLORS.muted, marginTop: 4, opacity: 0.7 },
});
