import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Task, useTasks } from '@/context/task-context';

export default function TasksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tasks, addTask, updateTask, deleteTask, preferences } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [description, setDescription] = useState('');

  const openNew = () => {
    setEditing(null); setName(''); setTarget(''); setDescription(''); setModalVisible(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task); setName(task.name); setTarget(task.target); setDescription(task.description); setModalVisible(true);
  };
  const save = () => {
    if (!name.trim()) return;
    if (editing) updateTask(editing.id, name, target, description);
    else addTask(name, target, description);
    if (preferences.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss(); setModalVisible(false);
  };
  const remove = (task: Task) => Alert.alert('Remove task?', `Delete ${task.name} from your plan?`, [{ text: 'Keep', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => deleteTask(task.id) }]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 110 }]}>
        <View style={styles.header}>
          <View><Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR SYSTEM</Text><Text style={[styles.title, { color: colors.foreground }]}>Tasks</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Shape the day you want to repeat.</Text></View>
          <Pressable accessibilityLabel="Add task" testID="new-task" onPress={openNew} style={({ pressed }) => [styles.addIcon, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}><Feather name="plus" size={21} color={colors.primaryForeground} /></Pressable>
        </View>
        <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.summaryNumber, { color: colors.foreground }]}>{tasks.length}</Text><View><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>ACTIVE SLOTS</Text><Text style={[styles.summaryCopy, { color: colors.foreground }]}>Keep the list honest and useful.</Text></View></View>
        <View style={styles.listHeader}><Text style={[styles.listTitle, { color: colors.foreground }]}>ALL TASKS</Text><Text style={[styles.listCount, { color: colors.mutedForeground }]}>LOCAL ONLY</Text></View>
        <View style={[styles.list, { backgroundColor: colors.deepCard, borderColor: colors.border }]}>
          {tasks.map((task, index) => (
            <Pressable key={task.id} onPress={() => openEdit(task)} testID={`edit-${task.id}`} style={({ pressed }) => [styles.task, { borderBottomColor: colors.border, opacity: pressed ? 0.72 : 1 }, index === tasks.length - 1 && styles.lastTask]}>
              <View style={[styles.taskMark, { backgroundColor: colors.accent }]}><Feather name="target" size={15} color={colors.primary} /></View>
              <View style={styles.taskCopy}><Text style={[styles.taskName, { color: colors.foreground }]}>{task.name}</Text><Text style={[styles.taskDescription, { color: colors.mutedForeground }]}>{task.description}</Text></View>
              <View style={styles.taskMeta}><Text style={[styles.taskTime, { color: colors.foreground }]}>{task.target}</Text><View style={styles.editHint}><Feather name="edit-3" size={12} color={colors.mutedForeground} /></View></View>
            </Pressable>
          ))}
          {!tasks.length && <View style={styles.empty}><Feather name="plus-circle" size={24} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your system is empty</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Add one task to get started.</Text></View>}
        </View>
        <Text style={[styles.note, { color: colors.mutedForeground }]}>Tasks are saved on this device. Tap any task to edit it.</Text>
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.72)' }]}>
          <View style={[styles.modal, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.modalHeader}><View><Text style={[styles.modalEyebrow, { color: colors.mutedForeground }]}>{editing ? 'REFINE YOUR PLAN' : 'NEW SLOT'}</Text><Text style={[styles.modalTitle, { color: colors.foreground }]}>{editing ? 'Edit task' : 'Add a task'}</Text></View><Pressable accessibilityLabel="Close" onPress={() => setModalVisible(false)}><Feather name="x" size={22} color={colors.mutedForeground} /></Pressable></View>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>TASK NAME</Text>
            <TextInput value={name} onChangeText={setName} autoFocus placeholder="e.g. Read for 20 minutes" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.deepCard, borderColor: colors.border, color: colors.foreground }]} />
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>TARGET TIME</Text>
            <TextInput value={target} onChangeText={setTarget} placeholder="e.g. 07:00 or Anytime" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.deepCard, borderColor: colors.border, color: colors.foreground }]} />
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>WHY IT MATTERS</Text>
            <TextInput value={description} onChangeText={setDescription} placeholder="A short reminder to return to" placeholderTextColor={colors.mutedForeground} multiline style={[styles.input, styles.textArea, { backgroundColor: colors.deepCard, borderColor: colors.border, color: colors.foreground }]} />
            <Pressable testID="save-task" onPress={save} disabled={!name.trim()} style={({ pressed }) => [styles.saveButton, { backgroundColor: name.trim() ? colors.primary : colors.muted, opacity: pressed ? 0.76 : 1 }]}><Text style={[styles.saveText, { color: name.trim() ? colors.primaryForeground : colors.mutedForeground }]}>{editing ? 'Save changes' : 'Add to my system'}</Text></Pressable>
            {editing && <Pressable onPress={() => { setModalVisible(false); remove(editing); }} style={styles.deleteButton}><Feather name="trash-2" size={15} color={colors.destructive} /><Text style={[styles.deleteText, { color: colors.destructive }]}>Remove task</Text></Pressable>}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { paddingHorizontal: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  eyebrow: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.6, marginBottom: 7 },
  title: { fontSize: 34, fontFamily: 'Inter_400Regular', letterSpacing: -1 },
  subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 5 },
  addIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 22, borderWidth: 1, marginBottom: 30 },
  summaryNumber: { fontSize: 36, fontFamily: 'Inter_400Regular' },
  summaryLabel: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.4 },
  summaryCopy: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 5 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  listCount: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.1 },
  list: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  task: { minHeight: 88, flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  lastTask: { borderBottomWidth: 0 },
  taskMark: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  taskCopy: { flex: 1, paddingRight: 8 },
  taskName: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  taskDescription: { fontSize: 10, fontFamily: 'Inter_400Regular', lineHeight: 14, marginTop: 4 },
  taskMeta: { alignItems: 'flex-end', gap: 8 },
  taskTime: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  editHint: { padding: 2 },
  empty: { alignItems: 'center', paddingVertical: 38 },
  emptyTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginTop: 10 },
  emptyText: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 5 },
  note: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 16 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalEyebrow: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.5, marginBottom: 5 },
  modalTitle: { fontSize: 25, fontFamily: 'Inter_600SemiBold' },
  fieldLabel: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 8 },
  input: { minHeight: 50, borderRadius: 14, borderWidth: 1, paddingHorizontal: 15, fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  textArea: { minHeight: 76, paddingTop: 14, textAlignVertical: 'top' },
  saveButton: { minHeight: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  deleteButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 8 },
  deleteText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
});