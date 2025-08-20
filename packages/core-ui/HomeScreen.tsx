// import { AccountManager, BaseRepository, EntityName, Feature, IAuthProvider, initialize, sync, UserAccount } from '@safe-spend/framework';
import { Account, FeatureName, initialize, PM, ProviderName, sync, Token } from '@safe-spend/framework';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export const HomeScreen = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  // const [accountManager, setAccountManager] = useState<AccountManager | null>(null);
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
        PM().getAccounts().then(setAccounts);
      })
    }
    const handleUrl = async (event: { url: string }) => {
      try {
        const url = event.url;
        console.log('callback: ' + url);
        setLoading(true);
        await PM().handleCallback(url)
        await PM().getAccounts().then(setAccounts);
        setLoading(false);
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

  const test = async () => {
    await PM().handleCallback("safespend://auth?state=Google.UserProfile.-xNKjMic&code=4%2F0AVMBsJh127zhdf9RXjjrtVGGxhrKpFRrC-9XvmaPUSOOl2FwhwAo79heLGF06tHwnI6UwQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent")
  }

  const handleLogin = async (provider: ProviderName, feature: FeatureName) => {
    setError(null);
    try {
      const url = await PM().get(provider, feature)?.generateLoginUrl();
      if (!url) {
        setError('No login URL available for ' + provider);
        return;
      }
      console.log('Opening URL:', url);
      Linking.openURL(url);
    } catch (e) {
      setError('Failed to start login: ' + e);
    } finally {
    }
  };

  const runSync = async (account: Account) => {
    await sync(account);
  }

  const revokeAccess = async (account: Account, token: Token) => {
    setError(null);
    try {
      const service = PM().get(account.providerName, token.featureName);
      await service?.revokeAccess(account);
      await PM().getAccounts().then(setAccounts);
    } catch (e) {
      setError('Failed to revoke access: ' + e);
    }
  };

  const AccountFeatures = ({ account }: { account: Account }) => {

    const [tokens, setTokens] = useState<Token[]>([]);
    useEffect(() => {
      const fetchTokens = async () => {
        const tokens = await PM().getTokens(account);
        setTokens(tokens);
      };
      fetchTokens();
    }, [account]);

    return <>
      <Text style={styles.title}>Features</Text>
      {tokens.map(token => (
        <View key={token.id}>
          <Text style={styles.accountEmail}>{token.featureName} Ops</Text>
          <View style={styles.providersContainer}>
            <Pressable style={styles.providerButton} onPress={() => revokeAccess(account, token)}>
              <Text style={styles.providerButtonText}>Revoke</Text>
            </Pressable>
            {token.featureName == FeatureName.EmailAccess &&
              <Pressable style={styles.providerButton} onPress={() => runSync(account)}>
                <Text style={styles.providerButtonText}>Sync</Text>
              </Pressable>}
          </View>
        </View>
      ))}
    </>;
  }

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
      <Pressable onPress={() => test()}>
        <Text>Test</Text>
      </Pressable>
      <ScrollView style={styles.scrollView}>
        {accounts.map(account => (
          <View key={account.id} style={styles.accountCard}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountEmail}>{account.email}</Text>
            <Text style={styles.accountProvider}>{account.providerName}</Text>
            <AccountFeatures account={account} />
            {/* <Text style={styles.accountProvider}>Features: {account.token?.features.join(', ')}</Text>
            <Pressable style={styles.providerButton} onPress={() => revokeAccess(account)}>
              <Text style={styles.providerButtonText}>Revoke</Text>
            </Pressable>
            {account.token?.features.includes(Feature.MailSync) && <Pressable style={styles.providerButton} onPress={() => runSync(account)}>
              <Text style={styles.providerButtonText}>Sync</Text>
            </Pressable>} */}
          </View>
        ))}
        {accounts.length === 0 && <Text style={styles.emptyText}>No accounts found</Text>}
      </ScrollView>
      {PM().getFeatures().map(f => (<View key={f}>
        <Text style={styles.title}>{f} Providers</Text>
        <View style={styles.providersContainer}>
          {PM().getProviders(f).map(p => (
            <Pressable key={p} style={styles.providerButton} onPress={() => handleLogin(p, f)}>
              <Text style={styles.providerButtonText}>{p}</Text>
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