import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TaskItem } from './task-item';
import { TaskEditModal } from './task-edit-modal';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/task';
import { useState } from 'react';

export function TaskList() {
  const { state } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  if (state.tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        style={styles.list}
        data={state.tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onEdit={handleEditTask} />
        )}
      />
      
      <TaskEditModal
        task={editingTask}
        visible={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 