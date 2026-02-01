import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { PageContainer } from '@toolpad/core/PageContainer';
import { fetchMetrics, MetricsResponse } from '../api/metrics';

export default function Metrics() {
    const [metrics, setMetrics] = React.useState<MetricsResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadMetrics = async () => {
            try {
                const data = await fetchMetrics();
                setMetrics(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load metrics';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadMetrics();
    }, []);

    return (
        <PageContainer>
            <Typography variant="h5" gutterBottom>
                Metrics Dashboard
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {metrics && (
                <Paper sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Raw Response (TODO: format based on actual backend response)
                    </Typography>
                    <Box
                        component="pre"
                        sx={{
                            bgcolor: 'grey.100',
                            p: 2,
                            borderRadius: 1,
                            overflow: 'auto',
                            fontSize: '0.875rem',
                        }}
                    >
                        {JSON.stringify(metrics, null, 2)}
                    </Box>
                </Paper>
            )}
        </PageContainer>
    );
}
