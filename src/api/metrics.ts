// src/api/metrics.ts
import { apiFetch } from "./client";

// Metrics response type - exact format TBD based on backend response
export type MetricsResponse = Record<string, unknown>;

/**
 * Fetch metrics data - GET /metrics
 * Requires authorization header
 */
export async function fetchMetrics(): Promise<MetricsResponse> {
    return apiFetch<MetricsResponse>("/metrics");
}
