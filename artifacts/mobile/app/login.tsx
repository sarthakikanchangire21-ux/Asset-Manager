import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
  };

  const validate = () => {
    if (mode === 'register' && name.trim().length < 2) return 'Please enter your full name.';
    if (!email.trim().includes('@')) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result =
      mode === 'register'
        ? await register(name.trim(), email.trim(), password)
        : await login(email.trim(), password);

    if (result.error) {
      setError(result.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setLoading(false);
  };

  const bottomPad = Platform.OS === 'web' ? 40 : insets.bottom + 40;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Top gradient accent */}
      <LinearGradient
        colors={['#00C89640', '#070B1400']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: bottomPad },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <LinearGradient
            colors={['#00C896', '#009970']}
            style={styles.logoIcon}
          >
            <Feather name="trending-up" size={32} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.appName, { color: colors.foreground }]}>FinBuddy AI</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Your personal finance advisor
          </Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Mode tabs */}
          <View style={[styles.modeTabs, { backgroundColor: colors.secondary }]}>
            {(['login', 'register'] as Mode[]).map(m => (
              <Pressable
                key={m}
                style={[
                  styles.modeTab,
                  mode === m && { backgroundColor: colors.card },
                ]}
                onPress={() => switchMode(m)}
              >
                <Text
                  style={[
                    styles.modeTabTxt,
                    {
                      color: mode === m ? colors.foreground : colors.mutedForeground,
                      fontFamily: mode === m ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    },
                  ]}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Fields */}
          {mode === 'register' && (
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Full Name</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.secondary, borderColor: error && name.trim().length < 2 ? colors.destructive : colors.border }]}>
                <Feather name="user" size={17} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Jane Doe"
                  placeholderTextColor={colors.mutedForeground}
                  value={name}
                  onChangeText={v => { setName(v); setError(''); }}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Email</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Feather name="mail" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="you@example.com"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={v => { setEmail(v); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Password</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Feather name="lock" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={v => { setPassword(v); setError(''); }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={12}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={17}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.destructive + '18' }]}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={[styles.errorTxt, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}

          {/* Submit */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#00C896', '#009970']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitTxt}>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Text>
                  <Feather name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          {/* Switch mode hint */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchTxt, { color: colors.mutedForeground }]}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <Pressable onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              <Text style={[styles.switchLink, { color: colors.primary }]}>
                {mode === 'login' ? ' Sign up' : ' Sign in'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          Your data stays on your device — always private.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  content: {
    paddingHorizontal: 24,
    gap: 28,
  },
  logoArea: { alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 30, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  tagline: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  modeTabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  modeTabTxt: { fontSize: 14 },
  fieldGroup: { gap: 6 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  errorTxt: { fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
  submitBtn: { borderRadius: 16, overflow: 'hidden' },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  submitTxt: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  switchLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
