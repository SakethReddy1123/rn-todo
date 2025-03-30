import { View, StyleSheet } from 'react-native';
import { TaskList } from '@/src/components/task-list';
import { AddTaskButton } from '@/src/components/add-task-button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <TaskList />
      <AddTaskButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 