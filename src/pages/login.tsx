// Login Page - Using @toolpad/core SignInPage
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, Link as RouterLink } from 'react-router';
import { useAuth } from '../auth';

export default function LoginPage() {
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Redirect to home if already logged in
    React.useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate('/');
        }
    }, [isAuthenticated, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Please enter username and password');
            return;
        }

        setIsSubmitting(true);
        try {
            await login({ username, password });
            navigate('/');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Card sx={{ maxWidth: 400, width: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                        Sign In
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                        Enter your credentials to continue
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                            placeholder="Enter your username"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            placeholder="Enter your password"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{ mt: 1 }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link component={RouterLink} to="/register">
                                Sign up now
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}