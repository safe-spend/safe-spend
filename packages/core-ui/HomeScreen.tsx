import { StyleSheet, Pressable, ScrollView, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { BaseRepository, initialize } from '@safe-spend/framework';
import { UserAccount } from '@safe-spend/framework/src/db/entities/UserAccount';

const userRepo: BaseRepository<UserAccount> = BaseRepository.getInstance('users');

export const HomeScreen = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    initialize().then(() => {
      userRepo.observeAll().subscribe((all) => {
        setUsers(all || []);
        setLoading(false);
      });
    });
  }, []);

  const handleAddUser = async () => {
    try {
      const now = new Date();
      await userRepo.save({
        id: Math.random().toString(36).slice(2),
        name: `User ${users.length + 1}`,
        email: `user${users.length + 1}@example.com`,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>User Accounts</Text>
        <Pressable style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Add User</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView}>
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || '?'}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>
          </View>
        ))}
        {users.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>Add a user to get started</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#eee',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#eee',
    fontSize: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: '#eee',
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  }
});