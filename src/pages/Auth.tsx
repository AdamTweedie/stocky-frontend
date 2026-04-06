import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tier } from '@/types/stock';

const TIERS: { value: Tier; label: string; price: string; features: string[] }[] = [
  { value: 'free', label: 'Free', price: '$0/mo', features: ['Basic news feed', 'Up to 3 watchlist stocks', 'Limited AI summaries'] },
  { value: 'basic', label: 'Basic', price: '$9.99/mo', features: ['Full news feed', 'Up to 15 watchlist stocks', 'Unlimited AI summaries', 'Sentiment analysis'] },
  { value: 'pro', label: 'Pro', price: '$29.99/mo', features: ['Everything in Basic', 'Unlimited watchlist', 'Priority AI summaries', 'Industry insights', 'API access'] },
];

const Auth = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier>('free');
  const { login, register, googleSignIn, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    try {
      await login(username, password);
      toast({ title: 'Welcome back!' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    try {
      await register(email, username, password, selectedTier);
      toast({ title: 'Account created!' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Signup failed', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl border-border/50 bg-card/80 backdrop-blur-xl relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">StockPulse</CardTitle>
          </div>
          <CardDescription>Track stock news in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-identifier">Email or Username</Label>
                  <Input
                    id="login-identifier"
                    placeholder="Enter your email or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in…' : 'Log In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Choose your plan</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TIERS.map((tier) => (
                      <button
                        key={tier.value}
                        type="button"
                        onClick={() => setSelectedTier(tier.value)}
                        className={`relative rounded-lg border p-3 text-left transition-all ${
                          selectedTier === tier.value
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{tier.label}</span>
                          {selectedTier === tier.value && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-primary mb-2">{tier.price}</p>
                        <ul className="space-y-1">
                          {tier.features.map((f) => (
                            <li key={f} className="text-[11px] text-muted-foreground">• {f}</li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account…' : selectedTier === 'free' ? 'Create Free Account' : `Subscribe to ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}`}
                </Button>
              </form>
            </TabsContent>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={googleSignIn} type="button">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;