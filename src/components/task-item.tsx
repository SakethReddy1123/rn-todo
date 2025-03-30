import { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/task';
import React from 'react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { dispatch } = useTaskContext();
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);
  
  // For web platform, we need to disable swipe functionality to avoid findDOMNode warning
  const isWeb = Platform.OS === 'web';
  
  const renderRightActions = () => {
    if (isWeb) return null;
    
    return (
      <View style={styles.rightActions}>
        <Pressable
          style={[styles.action, styles.editAction]}
          onPress={() => {
            swipeableRef.current?.close();
            setIsSwipeOpen(false);
            onEdit(task);
          }}
        >
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.action, styles.deleteAction]}
          onPress={() => {
            swipeableRef.current?.close();
            dispatch({ type: 'DELETE_TASK', taskId: task.id });
          }}
        >
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    );
  };

  // For web, provide alternative actions via buttons
  const renderWebActions = () => {
    if (!isWeb) return null;
    
    return (
      <View style={styles.webActions}>
        <Pressable
          style={[styles.webAction, styles.editAction]}
          onPress={() => onEdit(task)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.webAction, styles.deleteAction]}
          onPress={() => dispatch({ type: 'DELETE_TASK', taskId: task.id })}
        >
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    );
  };
  
  // For web, render a non-swipeable version
  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <Pressable
          style={[styles.container, task.isCompleted && styles.completed]}
          onPress={() => dispatch({ type: 'TOGGLE_TASK', taskId: task.id })}
        >
          <View style={styles.content}>
            <Text style={[styles.title, task.isCompleted && styles.completedText]}>
              {task.title}
            </Text>
            {!!task.description && (
              <Text style={styles.description}>{task.description}</Text>
            )}
            <View style={styles.meta}>
              <Text style={[styles.priority, styles[task.priority]]}>
                {task.priority}
              </Text>
              <Text style={styles.category}>{task.category}</Text>
            </View>
          </View>
        </Pressable>
        {renderWebActions()}
      </View>
    );
  }

  // Regular mobile version with swipeable
  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => setIsSwipeOpen(true)}
      onSwipeableClose={() => setIsSwipeOpen(false)}
    >
      <Pressable
        style={[styles.container, task.isCompleted && styles.completed]}
        onPress={() => dispatch({ type: 'TOGGLE_TASK', taskId: task.id })}
      >
        <View style={styles.content}>
          <Text style={[styles.title, task.isCompleted && styles.completedText]}>
            {task.title}
          </Text>
          {!!task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}
          <View style={styles.meta}>
            <Text style={[styles.priority, styles[task.priority]]}>
              {task.priority}
            </Text>
            <Text style={styles.category}>{task.category}</Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  webContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  completed: {
    backgroundColor: '#f8f8f8',
  },
  content: {
    gap: 4,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  priority: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  low: {
    backgroundColor: '#e0f2f1',
    color: '#00897b',
  },
  medium: {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  },
  high: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  rightActions: {
    flexDirection: 'row',
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  webActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webAction: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 4,
  },
  editAction: {
    backgroundColor: '#2196f3',
  },
  deleteAction: {
    backgroundColor: '#f44336',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});