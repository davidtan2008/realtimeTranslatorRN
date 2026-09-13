import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { featureRegistry } from '../domain/FeatureID';
import type { FeatureID } from '../domain/FeatureID';
import { InMemoryTaskStore } from '../domain/TaskStore';
import { Tokens } from '../designsystem/Tokens';

export type RootStackParamList = {
  Home: undefined;
  Conversation: undefined;
  Interpretation: undefined;
  Meeting: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const tasks = new InMemoryTaskStore();

export function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Tokens.canvas },
          headerTintColor: Tokens.listen,
          headerTitleStyle: { color: Tokens.textPrimary },
          contentStyle: { backgroundColor: Tokens.canvas },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '对译', headerShown: false }} />
        <Stack.Screen name="Conversation" component={ModuleScreen} options={{ title: '面对面' }} />
        <Stack.Screen name="Interpretation" component={ModuleScreen} options={{ title: '同声传译' }} />
        <Stack.Screen name="Meeting" component={ModuleScreen} options={{ title: '会议记录' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: '任务历史' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }: { navigation: { navigate: (name: keyof RootStackParamList) => void } }) {
  return (
    <ScrollView style={styles.canvas} contentContainerStyle={styles.home}>
      <Text style={styles.hero}>对译</Text>
      {featureRegistry.map((feature) => (
        <Pressable
          key={feature.id}
          style={[styles.card, { backgroundColor: cardColor(feature.id) }]}
          onPress={() => navigation.navigate(routeName(feature.route))}
        >
          <Text style={styles.cardTitle}>{feature.title}</Text>
          <Text style={styles.cardSub}>{feature.subtitle}</Text>
        </Pressable>
      ))}
      <Pressable style={[styles.card, { backgroundColor: Tokens.sheet }]} onPress={() => navigation.navigate('History')}>
        <Text style={styles.cardTitle}>任务历史</Text>
        <Text style={styles.cardSub}>都保存在这台手机上</Text>
      </Pressable>
    </ScrollView>
  );
}

function ModuleScreen({ route }: { route: { name: string } }) {
  const feature = useMemo<FeatureID>(() => {
    if (route.name === 'Conversation') return 'faceToFace';
    if (route.name === 'Interpretation') return 'simultaneous';
    return 'meeting';
  }, [route.name]);
  const [hasTask, setHasTask] = useState(false);

  return (
    <View style={styles.module}>
      <View style={styles.taskBar}>
        <Text style={{ color: hasTask ? Tokens.listen : Tokens.textSecondary, fontSize: 12 }}>
          {hasTask ? '进行中' : '没有进行中的任务'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={async () => {
              await tasks.startNew(feature, 'zhHans', 'english');
              setHasTask(true);
            }}
          >
            <Text style={{ color: Tokens.listen }}>新任务</Text>
          </Pressable>
          <Pressable onPress={() => setHasTask(false)} disabled={!hasTask}>
            <Text style={{ color: hasTask ? Tokens.danger : Tokens.textSecondary }}>结束任务</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.placeholder}>
        {hasTask
          ? '任务已建立。M2 将把 TurboModule 接到端侧听写。'
          : '先开一个新任务。Assembler 已在 Domain 里可单测。'}
      </Text>
    </View>
  );
}

function HistoryScreen() {
  return (
    <View style={styles.module}>
      <Text style={styles.placeholder}>还没有任务。从首页开一个新任务。</Text>
    </View>
  );
}

function routeName(route: 'conversation' | 'interpretation' | 'meeting'): keyof RootStackParamList {
  if (route === 'conversation') return 'Conversation';
  if (route === 'interpretation') return 'Interpretation';
  return 'Meeting';
}

function cardColor(id: FeatureID): string {
  if (id === 'faceToFace') return Tokens.cardFaceToFace;
  if (id === 'simultaneous') return Tokens.cardSimultaneous;
  return Tokens.cardMeeting;
}

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: Tokens.canvas },
  home: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 40, gap: 14 },
  hero: { color: Tokens.textPrimary, fontSize: 34, fontWeight: '600', marginBottom: 8 },
  card: { borderRadius: 16, padding: 16 },
  cardTitle: { color: Tokens.textPrimary, fontSize: 17, fontWeight: '600' },
  cardSub: { color: Tokens.textSecondary, fontSize: 13, marginTop: 4 },
  module: { flex: 1, backgroundColor: Tokens.canvas, padding: 20 },
  taskBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  placeholder: { color: Tokens.textSecondary, marginTop: 80, fontSize: 15 },
});
