import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getProfile, getSubscription, upgradeSubscription } from '@/services/usersApi';
import { User as UserType, Subscription, Tier } from '@/types/stock';

const TIERS: { value: Tier; label: string; price: string; features: string[] }[] = [
  { value: 'free', label: 'Free', price: '$0/mo', features: ['Basic news feed', 'Up to 3 watchlist stocks', 'Limited AI summaries'] },
  { value: 'basic', label: 'Basic', price: '$9.99/mo', features: ['Full news feed', 'Up to 15 watchlist stocks', 'Unlimited AI summaries', 'Sentiment analysis'] },
  { value: 'pro', label: 'Pro', price: '$29.99/mo', features: ['Everything in Basic', 'Unlimited watchlist', 'Priority AI summaries', 'Industry insights', 'API access'] },
];

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    getProfile().then(setProfile).catch(() => {});
    getSubscription().then(setSubscription).catch(() => {});
  }, [isAuthenticated, navigate]);

  const handleUpgrade = async (tier: Tier) => {
    if (tier === subscription?.tier) return;
    setUpgrading(true);
    try {
      const res = await upgradeSubscription(tier);
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      toast({ title: `Switched to ${tier} plan` });
      getSubscription().then(setSubscription).catch(() => {});
      getProfile().then(setProfile).catch(() => {});
    } catch (err: any) {
      toast({ title: 'Upgrade failed', description: err.message, variant: 'destructive' });
    } finally {
      setUpgrading(false);
    }
  };

  const currentTier = subscription?.tier || profile?.tier || 'free';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Profile Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-lg">
                  {(profile?.name || user?.name || '?').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{profile?.name || user?.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {profile?.email || user?.email || 'No email'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current plan:</span>
              <Badge variant="secondary" className="capitalize">{currentTier}</Badge>
              {subscription?.tier_status && (
                <Badge variant={subscription.tier_status === 'active' ? 'default' : 'destructive'} className="capitalize">
                  {subscription.tier_status}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription Plans
            </CardTitle>
            <CardDescription>Choose the plan that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TIERS.map((tier) => {
                const isCurrent = currentTier === tier.value;
                return (
                  <div
                    key={tier.value}
                    className={`relative rounded-xl border p-5 transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{tier.label}</h3>
                      {isCurrent && <Badge variant="default" className="text-[10px]">Current</Badge>}
                    </div>
                    <p className="text-xl font-bold text-primary mb-3">{tier.price}</p>
                    <ul className="space-y-1.5 mb-4">
                      {tier.features.map((f) => (
                        <li key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <Check className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isCurrent ? 'secondary' : 'default'}
                      size="sm"
                      className="w-full"
                      disabled={isCurrent || upgrading}
                      onClick={() => handleUpgrade(tier.value)}
                    >
                      {isCurrent ? 'Current Plan' : tier.value === 'free' ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;