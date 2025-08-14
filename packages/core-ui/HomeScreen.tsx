import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native';
import { initialize, AccountManager, UserAccount, Feature, BaseRepository, EntityName, IAuthProvider, sync } from '@safe-spend/framework';

export const HomeScreen = () => {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [accountManager, setAccountManager] = useState<AccountManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize framework and load data
  useEffect(() => {
    async function init() {
      setLoading(true);
      console.log('Initializing...');
      initialize().then(() => {
        console.log('Initialization complete');
        setLoading(false);
        setAccountManager(AccountManager.getInstance());
        const accountsDb: BaseRepository<UserAccount> = BaseRepository.getInstance(EntityName.UserAccounts);
        accountsDb.observeAll().subscribe(accounts => {
          console.log('Accounts loaded:', accounts);
          setAccounts(accounts);
        });
      })
    }
    const handleUrl = async (event: { url: string }) => {
      try {
        const url = event.url;
        const match = url.match(/safespend:\/\/auth\/([^?]+)\?(.+)/);
        if (!match) return;
        const provider = match[1];
        const params = new URLSearchParams(match[2]);
        const code = params.get('code');
        const state = params.get('state');
        if (provider && code) {
          setLoading(true);
          await AccountManager.getInstance().handleCallback(provider, code, state || '');
          const all = await AccountManager.getInstance()['db'].find();
          setAccounts(all);
        }
      } catch (e) {
        setError('Login failed: ' + e);
      } finally {
        setLoading(false);
      }
    };
    const subscription = Linking.addEventListener('url', handleUrl);
    init();
    return () => subscription.remove();
  }, []);

  // Listen for deep link callback
  useEffect(() => {
    if (loading) return;

  }, [loading]);

  const handleLogin = async (provider: IAuthProvider, feature: Feature) => {
    setError(null);
    try {
      const url = await AccountManager.getInstance().requestNewAccount(provider.provider, feature);
      console.log('Opening URL:', url);
      Linking.openURL(url);
    } catch (e) {
      setError('Failed to start login: ' + e);
    } finally {
    }
  };

  const runSync = async (account: UserAccount) => {
    await sync(account);
  }

  const revokeAccess = async (account: UserAccount) => {
    setError(null);
    try {
      await AccountManager.getInstance().revokeAccess(account);
      setAccounts(accounts.filter(a => a.id !== account.id));
    } catch (e) {
      setError('Failed to revoke access: ' + e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingOverlay}><Text style={styles.loadingText}>Loading...</Text></View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.providerButton} onPress={() => setError(null)}>
          <Text style={styles.providerButtonText}>RESET</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      <Text style={styles.title}>User Accounts</Text>
      <ScrollView style={styles.scrollView}>
        {accounts.map(account => (
          <View key={account.id} style={styles.accountCard}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountEmail}>{account.email}</Text>
            <Text style={styles.accountProvider}>{account.provider}</Text>
            <Text style={styles.accountProvider}>Features: {account.token?.features.join(', ')}</Text>
            <Pressable style={styles.providerButton} onPress={() => revokeAccess(account)}>
              <Text style={styles.providerButtonText}>Revoke</Text>
            </Pressable>
            {account.token?.features.includes(Feature.MailSync) && <Pressable style={styles.providerButton} onPress={() => runSync(account)}>
              <Text style={styles.providerButtonText}>Sync</Text>
            </Pressable>}
          </View>
        ))}
        {accounts.length === 0 && <Text style={styles.emptyText}>No accounts found</Text>}
      </ScrollView>
      {[Feature.Login, Feature.MailSync, Feature.Storage].map(f => (<View key={f}>
        <Text style={styles.title}>{f.toUpperCase()} Providers</Text>
        <View style={styles.providersContainer}>
          {accountManager && accountManager.getSupportedProviders(f).map(provider => (
            <Pressable key={provider.provider} style={styles.providerButton} onPress={() => handleLogin(provider, f)}>
              <Text style={styles.providerButtonText}>{provider.getDisplayDetails(f).displayName}</Text>
            </Pressable>
          ))}
        </View>
      </View>))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  title: { fontSize: 22, color: '#eee', fontWeight: 'bold', marginVertical: 10 },
  scrollView: { flex: 1, marginBottom: 20 },
  accountCard: { backgroundColor: '#222', borderRadius: 10, padding: 15, marginBottom: 10 },
  accountName: { fontSize: 18, color: '#eee', fontWeight: 'bold' },
  accountEmail: { fontSize: 14, color: '#999' },
  accountProvider: { fontSize: 12, color: '#aaa', marginTop: 4 },
  emptyText: { color: '#aaa', textAlign: 'center', marginVertical: 20 },
  providersContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  providerButton: { backgroundColor: '#3498db', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, marginRight: 10, marginBottom: 10 },
  providerButtonText: { color: '#fff', fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  loadingText: { color: '#fff', fontSize: 18 },
  errorText: { color: '#F44336', textAlign: 'center', marginTop: 10 },
});